package com.uicode.postit.postitserver.service.global;

import java.util.List;

import org.springframework.security.core.userdetails.UserDetailsService;

import com.uicode.postit.postitserver.dto.global.UserDto;
import com.uicode.postit.postitserver.exception.functionnal.FunctionnalException;
import com.uicode.postit.postitserver.exception.functionnal.InvalidDataException;
import com.uicode.postit.postitserver.exception.functionnal.NotFoundException;

public interface UserService extends UserDetailsService {

    UserDto getCurrentUser();

    List<UserDto> getUserList();

    UserDto saveUser(Long userId, UserDto userDto) throws NotFoundException, FunctionnalException, InvalidDataException;

    void deleteUser(Long userId);

    List<String> getRoleList();

}
