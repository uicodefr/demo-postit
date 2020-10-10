package com.uicode.postit.postitserver.test.controller.postit;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;

import com.uicode.postit.postitserver.dto.postit.BoardDto;
import com.uicode.postit.postitserver.util.AppTestRequestInterceptor;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@AutoConfigureTestDatabase
class BoardControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void boardCrud() {
        // Get List
        BoardDto[] boardList = restTemplate.getForObject("/postit/boards", BoardDto[].class);
        Assertions.assertThat(boardList).isNotNull();
        int boardCount = boardList.length;

        // Connect as admin
        AppTestRequestInterceptor appTestRequestInterceptor = AppTestRequestInterceptor.addInterceptor(restTemplate);
        appTestRequestInterceptor.simpleGetForCsrf();
        appTestRequestInterceptor.login("admin", "admin");

        // Insert
        BoardDto board = new BoardDto();
        board.setName("New Board");
        board.setOrderNum(2);

        BoardDto createdBoard = restTemplate.postForObject("/postit/boards", board, BoardDto.class);
        Assertions.assertThat(createdBoard).isNotNull();
        Assertions.assertThat(createdBoard.getId()).isNotNull();
        Assertions.assertThat(createdBoard.getName()).isEqualTo(board.getName());
        Assertions.assertThat(createdBoard.getOrderNum()).isEqualTo(board.getOrderNum());

        // Update
        createdBoard.setName("Update Board");
        createdBoard.setOrderNum(3);
        BoardDto updatedBoard = restTemplate.patchForObject("/postit/boards/{id}", createdBoard, BoardDto.class,
                createdBoard.getId());
        Assertions.assertThat(updatedBoard).isNotNull();
        Assertions.assertThat(updatedBoard.getId()).isEqualTo(createdBoard.getId());
        Assertions.assertThat(updatedBoard.getName()).isEqualTo(createdBoard.getName());
        Assertions.assertThat(updatedBoard.getOrderNum()).isEqualTo(createdBoard.getOrderNum());

        // Delete
        restTemplate.delete("/postit/boards/{id}", createdBoard.getId());

        // Final Check
        boardList = restTemplate.getForObject("/postit/boards", BoardDto[].class);
        Assertions.assertThat(boardList).isNotNull().hasSize(boardCount);

        appTestRequestInterceptor.clear();
    }

}
