package com.uicode.postit.postitserver.test.controller.postit;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

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

import com.uicode.postit.postitserver.dto.postit.BoardDto;
import com.uicode.postit.postitserver.test.config.TestContainersConfig;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Import(TestContainersConfig.class)
@ActiveProfiles("integration-test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class BoardControllerTest {

    @Autowired
    private WebApplicationContext wac;

    private WebTestClient webTestClient;

    private static Long createdBoardId;
    private static int initialBoardCount;


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
    void listBoardsInitial() {
        webTestClient.get()
            .uri("/postit/boards")
            .exchange()
            .expectStatus().isOk()
            .expectBody(BoardDto[].class)
            .value(list -> {
                Assertions.assertThat(list).isNotNull();
                initialBoardCount = list.length;
            });
    }


    @Test
    @Order(2)
    @WithMockUser(roles = "BOARD_WRITE")
    void createBoard() {
        BoardDto board = new BoardDto();
        board.setName("New Board");
        board.setOrderNum(2);

        createdBoardId = webTestClient.post()
            .uri("/postit/boards")
            .bodyValue(board)
            .exchange()
            .expectStatus().isOk()
            .expectBody(BoardDto.class)
            .value(dto -> {
                Assertions.assertThat(dto.getId()).isNotNull();
                Assertions.assertThat(dto.getName()).isEqualTo("New Board");
                Assertions.assertThat(dto.getOrderNum()).isEqualTo(2);
            })
            .returnResult()
            .getResponseBody()
            .getId();
    }

    @Test
    @Order(3)
    @WithMockUser(roles = "BOARD_WRITE")
    void updateBoard() {
        BoardDto update = new BoardDto();
        update.setId(createdBoardId);
        update.setName("Update Board");
        update.setOrderNum(3);

        webTestClient.patch()
            .uri("/postit/boards/{id}", createdBoardId)
            .bodyValue(update)
            .exchange()
            .expectStatus().isOk()
            .expectBody(BoardDto.class)
            .value(dto -> {
                Assertions.assertThat(dto.getId()).isEqualTo(createdBoardId);
                Assertions.assertThat(dto.getName()).isEqualTo("Update Board");
                Assertions.assertThat(dto.getOrderNum()).isEqualTo(3);
            });
    }

    @Test
    @Order(4)
    @WithMockUser(roles = "BOARD_WRITE")
    void deleteBoard() {
        webTestClient.delete()
            .uri("/postit/boards/{id}", createdBoardId)
            .exchange()
            .expectStatus().isNoContent();

        webTestClient.get()
            .uri("/postit/boards")
            .exchange()
            .expectStatus().isOk()
            .expectBody(BoardDto[].class)
            .value(list -> {
                Assertions.assertThat(list).hasSize(initialBoardCount);
            });
    }

}
