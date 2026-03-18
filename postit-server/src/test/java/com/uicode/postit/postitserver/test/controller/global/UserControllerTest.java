package com.uicode.postit.postitserver.test.controller.global;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import java.util.Arrays;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.test.web.servlet.client.MockMvcWebTestClient;
import org.springframework.web.context.WebApplicationContext;

import com.uicode.postit.postitserver.dto.global.UserDto;
import com.uicode.postit.postitserver.dto.postit.BoardDto;
import com.uicode.postit.postitserver.test.config.TestContainersConfig;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Import(TestContainersConfig.class)
@ActiveProfiles("integration-test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class UserControllerTest {

    @Autowired
    private WebApplicationContext wac;

    private WebTestClient webTestClient;

    private static Long createdUserId;
    private static int initialUserCount;


    @BeforeEach
    void setUp() {
        webTestClient = MockMvcWebTestClient.bindToApplicationContext(this.wac)
                .apply(springSecurity())
                .defaultRequest(post("/").with(csrf()))
                .configureClient()
                .build();
    }

    @Test
    @WithAnonymousUser
    void createBoard_noUser_shouldBeForbidden() {
        BoardDto board = new BoardDto();
        board.setName("New Board");
        board.setOrderNum(2);

        webTestClient.post()
            .uri("/postit/boards")
            .bodyValue(board)
            .exchange()
            .expectStatus().isUnauthorized();
    }

    @Test
    @Order(1)
    @WithMockUser(roles = "USER_WRITE")
    void listUsersInitial() {
        webTestClient.get()
            .uri("/users")
            .exchange()
            .expectStatus().isOk()
            .expectBody(UserDto[].class)
            .value(list -> {
                Assertions.assertThat(list).isNotNull();
                for (UserDto user : list) {
                    Assertions.assertThat(user.getUsername()).isNotBlank();
                    Assertions.assertThat(user.getPassword()).isNull();
                }
                initialUserCount = list.length;
            });
    }

    @Test
    @Order(2)
    @WithMockUser(roles = "USER_WRITE")
    void createUser() {
        UserDto user = new UserDto();
        user.setUsername("username");
        user.setPassword("password");
        user.setEnabled(false);
        user.setRoleList(Arrays.asList("ROLE_BOARD_WRITE"));

        createdUserId = webTestClient.post()
            .uri("/users")
            .bodyValue(user)
            .exchange()
            .expectStatus().isOk()
            .expectBody(UserDto.class)
            .value(dto -> {
                Assertions.assertThat(dto.getId()).isNotNull();
                Assertions.assertThat(dto.getUsername()).isEqualTo("username");
                Assertions.assertThat(dto.getRoleList()).containsExactly("ROLE_BOARD_WRITE");
            })
            .returnResult()
            .getResponseBody()
            .getId();
    }

    @Test
    @Order(3)
    @WithMockUser(roles = "USER_WRITE")
    void updateUser() {
        UserDto update = new UserDto();
        update.setId(createdUserId);
        update.setUsername("username2");
        update.setPassword("password2");
        update.setRoleList(Arrays.asList("ROLE_BOARD_WRITE", "ROLE_USER_WRITE"));

        webTestClient.patch()
            .uri("/users/{id}", createdUserId)
            .bodyValue(update)
            .exchange()
            .expectStatus().isOk()
            .expectBody(UserDto.class)
            .value(dto -> {
                Assertions.assertThat(dto.getId()).isEqualTo(createdUserId);
                Assertions.assertThat(dto.getUsername()).isEqualTo("username2");
                Assertions.assertThat(dto.getRoleList()).containsExactlyInAnyOrder("ROLE_BOARD_WRITE", "ROLE_USER_WRITE");
            });
    }

    @Test
    @Order(4)
    @WithMockUser(roles = "USER_WRITE")
    void deleteUser() {
        webTestClient.delete()
            .uri("/users/{id}", createdUserId)
            .exchange()
            .expectStatus().isNoContent();

        webTestClient.get()
            .uri("/users")
            .exchange()
            .expectStatus().isOk()
            .expectBody(UserDto[].class)
            .value(list -> {
                Assertions.assertThat(list).hasSize(initialUserCount);
            });
    }

    @Test
    void getRoles() {
        webTestClient.get()
            .uri("/users/roles")
            .exchange()
            .expectStatus().isOk()
            .expectBody(String[].class)
            .value(roles -> {
                Assertions.assertThat(roles)
                    .isNotNull()
                    .containsExactly("ROLE_BOARD_WRITE", "ROLE_USER_WRITE");
            });
    }

}
