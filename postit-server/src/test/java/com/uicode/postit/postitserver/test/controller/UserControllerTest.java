package com.uicode.postit.postitserver.test.controller;

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

import com.uicode.postit.postitserver.dto.postit.BoardDto;
import com.uicode.postit.postitserver.dto.user.UserDto;
import com.uicode.postit.postitserver.util.TestRestTemplateWithHeaders;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@AutoConfigureTestDatabase
public class UserControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    public void userCrud() {
        // Get List
        UserDto[] userList = restTemplate.getForObject("/users", UserDto[].class);
        Assertions.assertThat(userList).isNotNull();
        for (UserDto user : userList) {
            Assertions.assertThat(user.getUsername()).isNotBlank();
            Assertions.assertThat(user.getPassword()).isNull();
        }
        int userCount = userList.length;

        // Connect as superadmin
        TestRestTemplateWithHeaders restTemplateConnected = TestRestTemplateWithHeaders.login(restTemplate,
                "superadmin", "superadmin");

        // Insert
        UserDto user = new UserDto();
        user.setUsername("username");
        user.setPassword("password");
        user.setEnabled(false);
        user.setRoleList(Arrays.asList("ROLE_BOARD_WRITE"));

        UserDto createdUser = restTemplateConnected.postForObject("/users", user, UserDto.class);
        Assertions.assertThat(createdUser).isNotNull();
        Assertions.assertThat(createdUser.getId()).isNotNull();
        Assertions.assertThat(createdUser.getUsername()).isEqualTo(user.getUsername());
        Assertions.assertThat(createdUser.getRoleList()).isEqualTo(user.getRoleList());

        // Update
        createdUser.setUsername("username2");
        createdUser.setPassword("password2");
        createdUser.setRoleList(Arrays.asList("ROLE_BOARD_WRITE", "ROLE_USER_WRITE"));
        UserDto updatedUser = restTemplateConnected.patchForObject("/users/{id}", createdUser, UserDto.class,
                createdUser.getId());
        Assertions.assertThat(updatedUser).isNotNull();
        Assertions.assertThat(updatedUser.getId()).isEqualTo(createdUser.getId());
        Assertions.assertThat(updatedUser.getUsername()).isEqualTo(createdUser.getUsername());
        Assertions.assertThat(updatedUser.getRoleList()).isEqualTo(createdUser.getRoleList());

        // Delete
        restTemplateConnected.delete("/users/{id}", createdUser.getId());

        // Final Check
        userList = restTemplate.getForObject("/users", UserDto[].class);
        Assertions.assertThat(userList).isNotNull().hasSize(userCount);
    }

    @Test
    public void loginLogout() {
        // Connect as superadmin
        TestRestTemplateWithHeaders restTemplateConnected = TestRestTemplateWithHeaders.login(restTemplate,
                "superadmin", "superadmin");

        String username = "test";
        String password = "abcdefg";

        // Create a user for test
        UserDto user = new UserDto();
        user.setUsername(username);
        user.setPassword(password);
        user.setEnabled(true);
        user.setRoleList(Arrays.asList("ROLE_BOARD_WRITE"));
        UserDto createdUser = restTemplateConnected.postForObject("/users", user, UserDto.class);
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
        restTemplateConnected = TestRestTemplateWithHeaders.login(restTemplate, username, password);
        UserDto connectedUser = restTemplateConnected.getForObject("/users/me", UserDto.class);
        Assertions.assertThat(connectedUser).isNotNull();
        Assertions.assertThat(connectedUser.getId()).isNotNull();
        Assertions.assertThat(connectedUser.getUsername()).isEqualTo(username);

        // Test ROLE_BOARD_WRITE
        BoardDto board = new BoardDto();
        board.setName("New Board");
        BoardDto createdBoard = restTemplateConnected.postForObject("/postit/boards", board, BoardDto.class);
        Assertions.assertThat(createdBoard).isNotNull();
        Assertions.assertThat(createdBoard.getId()).isNotNull();

        // Test ROLE_USER_WRITE
        user.setUsername("otherusername");
        UserDto testUser = restTemplateConnected.postForObject("/users", user, UserDto.class);
        Assertions.assertThat(testUser.getId()).isNull();

        // Logout
        restTemplateConnected.getForObject("/logout", String.class);
        connectedUser = restTemplateConnected.getForObject("/users/me", UserDto.class);
        Assertions.assertThat(connectedUser).isNull();
    }

}
