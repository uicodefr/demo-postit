package com.uicode.postit.postitserver.service;

import java.util.List;

import org.springframework.security.core.userdetails.UserDetailsService;

import com.uicode.postit.postitserver.dto.user.UserDto;
import com.uicode.postit.postitserver.exception.FunctionnalException;
import com.uicode.postit.postitserver.exception.NotFoundException;

public interface IUserService extends UserDetailsService {

    UserDto getCurrentUser();

    List<UserDto> getUserList();

    UserDto saveUser(Long userId, UserDto userDto) throws NotFoundException, FunctionnalException;

    void deleteUser(Long userId);

    List<String> getRoleList();

}
