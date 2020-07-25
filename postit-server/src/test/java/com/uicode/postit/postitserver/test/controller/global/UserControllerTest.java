package com.uicode.postit.postitserver.test.controller.global;

import java.util.Arrays;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;

import com.uicode.postit.postitserver.dto.global.UserDto;
import com.uicode.postit.postitserver.dto.postit.BoardDto;
import com.uicode.postit.postitserver.util.AppTestRequestInterceptor;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@AutoConfigureTestDatabase
class UserControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void userCrud() {
        // Get List
        UserDto[] userList = restTemplate.getForObject("/users", UserDto[].class);
        Assertions.assertThat(userList).isNotNull();
        for (UserDto user : userList) {
            Assertions.assertThat(user.getUsername()).isNotBlank();
            Assertions.assertThat(user.getPassword()).isNull();
        }
        int userCount = userList.length;

        // Connect as superadmin
        AppTestRequestInterceptor appTestRequestInterceptor = AppTestRequestInterceptor.addInterceptor(restTemplate);
        appTestRequestInterceptor.simpleGetForCsrf();
        appTestRequestInterceptor.login("superadmin", "superadmin");

        // Insert
        UserDto user = new UserDto();
        user.setUsername("username");
        user.setPassword("password");
        user.setEnabled(false);
        user.setRoleList(Arrays.asList("ROLE_BOARD_WRITE"));

        UserDto createdUser = restTemplate.postForObject("/users", user, UserDto.class);
        Assertions.assertThat(createdUser).isNotNull();
        Assertions.assertThat(createdUser.getId()).isNotNull();
        Assertions.assertThat(createdUser.getUsername()).isEqualTo(user.getUsername());
        Assertions.assertThat(createdUser.getRoleList()).isEqualTo(user.getRoleList());

        // Update
        createdUser.setUsername("username2");
        createdUser.setPassword("password2");
        createdUser.setRoleList(Arrays.asList("ROLE_BOARD_WRITE", "ROLE_USER_WRITE"));
        UserDto updatedUser = restTemplate.patchForObject("/users/{id}", createdUser, UserDto.class,
                createdUser.getId());
        Assertions.assertThat(updatedUser).isNotNull();
        Assertions.assertThat(updatedUser.getId()).isEqualTo(createdUser.getId());
        Assertions.assertThat(updatedUser.getUsername()).isEqualTo(createdUser.getUsername());
        Assertions.assertThat(updatedUser.getRoleList()).isEqualTo(createdUser.getRoleList());

        // Delete
        restTemplate.delete("/users/{id}", createdUser.getId());

        // Final Check
        userList = restTemplate.getForObject("/users", UserDto[].class);
        Assertions.assertThat(userList).isNotNull().hasSize(userCount);

        appTestRequestInterceptor.clear();
    }

    @Test
    void loginLogout() {
        // Connect as superadmin
        AppTestRequestInterceptor appTestRequestInterceptor = AppTestRequestInterceptor.addInterceptor(restTemplate);
        appTestRequestInterceptor.simpleGetForCsrf();
        appTestRequestInterceptor.login("superadmin", "superadmin");

        String username = "test";
        String password = "abcdefg";

        // Create a user for test
        UserDto user = new UserDto();
        user.setUsername(username);
        user.setPassword(password);
        user.setEnabled(true);
        user.setRoleList(Arrays.asList("ROLE_BOARD_WRITE"));
        UserDto createdUser = restTemplate.postForObject("/users", user, UserDto.class);
        Assertions.assertThat(createdUser).isNotNull();
        Assertions.assertThat(createdUser.getId()).isNotNull();

        // Test Connection with a bad password
        HttpHeaders loginHeaders = new HttpHeaders();
        loginHeaders.setContentType(MediaType.MULTIPART_FORM_DATA);
        LinkedMultiValueMap<String, String> loginForms = new LinkedMultiValueMap<>();
        loginForms.add("username", username);
        loginForms.add("password", "Abcdefg");
        ResponseEntity<UserDto> responseLogin = restTemplate.postForEntity("/login",
                new HttpEntity<>(loginForms, loginHeaders), UserDto.class);
        Assertions.assertThat(responseLogin.getStatusCodeValue()).isEqualTo(401);

        // Connect with the good password
        appTestRequestInterceptor.login(username, password);
        UserDto connectedUser = restTemplate.getForObject("/users/me", UserDto.class);
        Assertions.assertThat(connectedUser).isNotNull();
        Assertions.assertThat(connectedUser.getId()).isNotNull();
        Assertions.assertThat(connectedUser.getUsername()).isEqualTo(username);

        // Test ROLE_BOARD_WRITE
        BoardDto board = new BoardDto();
        board.setName("New Board");
        BoardDto createdBoard = restTemplate.postForObject("/postit/boards", board, BoardDto.class);
        Assertions.assertThat(createdBoard).isNotNull();
        Assertions.assertThat(createdBoard.getId()).isNotNull();

        // Test ROLE_USER_WRITE
        user.setUsername("otherusername");
        UserDto testUser = restTemplate.postForObject("/users", user, UserDto.class);
        Assertions.assertThat(testUser.getId()).isNull();

        // Logout
        restTemplate.postForObject("/logout", null, String.class);
        connectedUser = restTemplate.getForObject("/users/me", UserDto.class);
        Assertions.assertThat(connectedUser).isNull();

        appTestRequestInterceptor.clear();
    }

    @Test
    void getRoles() {
        String[] roles = restTemplate.getForObject("/users/roles", String[].class);
        Assertions.assertThat(roles).isNotNull().containsExactly("ROLE_BOARD_WRITE", "ROLE_USER_WRITE");
    }

}
