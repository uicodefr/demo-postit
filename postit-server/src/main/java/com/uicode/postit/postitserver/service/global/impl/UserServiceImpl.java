package com.uicode.postit.postitserver.service.global.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.google.common.collect.Streams;
import com.uicode.postit.postitserver.dao.global.UserAuthorityDao;
import com.uicode.postit.postitserver.dao.global.UserDao;
import com.uicode.postit.postitserver.dto.global.UserDto;
import com.uicode.postit.postitserver.entity.global.User;
import com.uicode.postit.postitserver.entity.global.UserAuthority;
import com.uicode.postit.postitserver.exception.functionnal.FunctionnalException;
import com.uicode.postit.postitserver.exception.functionnal.InvalidDataException;
import com.uicode.postit.postitserver.exception.functionnal.NotFoundException;
import com.uicode.postit.postitserver.mapper.global.UserMapper;
import com.uicode.postit.postitserver.service.global.GlobalService;
import com.uicode.postit.postitserver.service.global.UserService;
import com.uicode.postit.postitserver.util.parameter.ParameterConst;
import com.uicode.postit.postitserver.util.parameter.ParameterUtil;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private static final Integer MIN_PASSWORD_LENGTH = 5;

    private final UserDao userDao;
    private final UserAuthorityDao userAuthorityDao;
    private final GlobalService globalService;
    private final UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String username) {
        return userDao.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found for : " + username));
    }

    @Override
    public UserDto getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return null;
        }
        Object userPrincipalObj = authentication.getPrincipal();
        if (userPrincipalObj instanceof User userPrincipal) {
            return userMapper.toDto(userPrincipal);
        } else {
            return null;
        }
    }

    @Override
    public List<UserDto> getUserList() {
        log.info("GetUserList");
        Iterable<User> userIterable = userDao.findAll(Sort.by("username").ascending());
        return Streams.stream(userIterable).map(userMapper::toDto).toList();
    }

    @Override
    public UserDto saveUser(Long userId, UserDto userDto)
            throws NotFoundException, FunctionnalException, InvalidDataException {
        User user = null;

        if (userId == null) {
            // Creation
            Optional<String> maxUserParameter = globalService.getParameterValue(ParameterConst.USER_MAX);
            Long maxUser = ParameterUtil.getLong(maxUserParameter, 0l);
            if (userDao.count() >= maxUser) {
                throw new FunctionnalException("Max User achieved, creation is blocked");
            }

            user = new User();
            user.setEnabled(false);
            log.info("Create user");

        } else {
            // Update
            Optional<User> userOpt = userDao.findById(userId);
            user = userOpt.orElseThrow(() -> new NotFoundException("User"));
            log.info("Update user with the id : {}", userId);
        }

        updatePassword(userDto.getPassword(), user);
        updateRoleList(userDto.getRoleList(), user);
        userMapper.updateEntity(userDto, user);

        return userMapper.toDto(userDao.save(user));
    }

    private void updatePassword(String password, User user) throws InvalidDataException {
        if (StringUtils.isEmpty(password)) {
            return;
        }

        if (password.contains(" ") || StringUtils.length(password) < MIN_PASSWORD_LENGTH) {
            throw new InvalidDataException("Password of user is invalid");
        }

        String encodedPassword = new BCryptPasswordEncoder().encode(password);
        user.setPassword(encodedPassword);
    }

    private void updateRoleList(List<String> roleList, User user) throws FunctionnalException {
        if (roleList == null) {
            return;
        }

        List<UserAuthority> authorityList = new ArrayList<>();
        Set<String> roleSet = new HashSet<>(roleList);

        for (String role : roleSet) {
            authorityList.add(userAuthorityDao.findByAuthority(role)
                .orElseThrow(() -> new FunctionnalException("Role not found : " + role)));
        }
        user.setAuthorityList(authorityList);
    }

    @Override
    public void deleteUser(Long userId) {
        Optional<User> userOpt = userDao.findById(userId);
        if (!userOpt.isPresent()) {
            log.warn("User not found for deletion, id = %s", userId);
            return;
        }
        userDao.delete(userOpt.get());
        log.info("Delete user with the id : {}", userId);
    }

    @Override
    public List<String> getRoleList() {
        log.info("getRoleList");
        Iterable<UserAuthority> userAuthorityIterable = userAuthorityDao.findAll(Sort.by("authority").ascending());
        return Streams.stream(userAuthorityIterable).map(UserAuthority::getAuthority).toList();
    }

}
