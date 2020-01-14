package com.uicode.postit.postitserver.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uicode.postit.postitserver.dto.user.UserDto;
import com.uicode.postit.postitserver.exception.FunctionnalException;
import com.uicode.postit.postitserver.exception.NotFoundException;
import com.uicode.postit.postitserver.service.IUserService;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private IUserService userService;
    
    @GetMapping("/me")
    public UserDto getCurrentUser() {
        return userService.getCurrentUser();
    }

    @GetMapping()
    public List<UserDto> getUserList() {
        return userService.getUserList();
    }

    @PostMapping()
    @Secured("ROLE_USER_WRITE")
    public UserDto createUser(@RequestBody UserDto userDto) throws NotFoundException, FunctionnalException {
        return userService.saveUser(null, userDto);
    }

    @PatchMapping("/{id}")
    @Secured("ROLE_USER_WRITE")
    public UserDto updateUser(@PathVariable("id") Long userId, @RequestBody UserDto userDto) throws NotFoundException, FunctionnalException {
        return userService.saveUser(userId, userDto);
    }

    @DeleteMapping("/{id}")
    @Secured("ROLE_USER_WRITE")
    public void deleteUser(@PathVariable("id") Long userId) {
        userService.deleteUser(userId);
    }

    @GetMapping("/roles")
    public List<String> getRoleList() {
        return userService.getRoleList();
    }

}
