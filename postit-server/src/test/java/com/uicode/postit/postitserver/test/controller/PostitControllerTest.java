package com.uicode.postit.postitserver.test.controller;

import org.assertj.core.api.Assertions;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.test.context.junit4.SpringRunner;

import com.uicode.postit.postitserver.dto.postit.BoardDto;
import com.uicode.postit.postitserver.dto.postit.PostitNoteDto;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
public class PostitControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    public void boardCrud() {
        // Get List
        BoardDto[] boardList = restTemplate.getForObject("/postit/boards", BoardDto[].class);
        Assertions.assertThat(boardList).isNotNull();
        int boardCount = boardList.length;

        // Insert
        BoardDto boardDto = new BoardDto();
        boardDto.setName("New Board");

        BoardDto createdBoard = restTemplate.postForObject("/postit/boards", boardDto, BoardDto.class);
        Assertions.assertThat(createdBoard).isNotNull();
        Assertions.assertThat(createdBoard.getId()).isNotNull();
        Assertions.assertThat(createdBoard.getName()).isEqualTo(boardDto.getName());

        // Update
        createdBoard.setName("Update Board");
        BoardDto updatedBoard = restTemplate.patchForObject("/postit/boards/{id}", createdBoard, BoardDto.class,
                createdBoard.getId());
        Assertions.assertThat(updatedBoard).isNotNull();
        Assertions.assertThat(updatedBoard.getId()).isEqualTo(createdBoard.getId());
        Assertions.assertThat(updatedBoard.getName()).isEqualTo(createdBoard.getName());

        // Delete
        restTemplate.delete("/postit/boards/{id}", createdBoard.getId());

        // Final Check
        boardList = restTemplate.getForObject("/postit/boards", BoardDto[].class);
        Assertions.assertThat(boardList).isNotNull().hasSize(boardCount);
    }

    @Test
    public void noteCrud() {
        // Insert
        BoardDto boardDto = new BoardDto();
        boardDto.setName("New Board");
        BoardDto createdBoard = restTemplate.postForObject("/postit/boards", boardDto, BoardDto.class);
        Assertions.assertThat(createdBoard).isNotNull();
        Assertions.assertThat(createdBoard.getId()).isNotNull();

        PostitNoteDto noteDto = new PostitNoteDto();
        noteDto.setName("Name");
        noteDto.setText("Text");
        noteDto.setBoardId(createdBoard.getId());
        noteDto.setColor("white");
        noteDto.setOrderNum(1);

        PostitNoteDto createdNote = restTemplate.postForObject("/postit/notes", noteDto, PostitNoteDto.class);
        Assertions.assertThat(createdNote).isNotNull();
        Assertions.assertThat(createdNote.getId()).isNotNull();
        Assertions.assertThat(createdNote.getName()).isEqualTo(noteDto.getName());
        Assertions.assertThat(createdNote.getText()).isEqualTo(noteDto.getText());
        Assertions.assertThat(createdNote.getBoardId()).isEqualTo(noteDto.getBoardId());
        Assertions.assertThat(createdNote.getColor()).isEqualTo(noteDto.getColor());
        Assertions.assertThat(createdNote.getOrderNum()).isEqualTo(noteDto.getOrderNum());

        // Get
        PostitNoteDto getNote = restTemplate.getForObject("/postit/notes/{id}", PostitNoteDto.class,
                createdNote.getId());
        Assertions.assertThat(getNote).isNotNull();
        Assertions.assertThat(getNote.getId()).isEqualTo(createdNote.getId());
        Assertions.assertThat(getNote.getName()).isEqualTo(createdNote.getName());
        Assertions.assertThat(getNote.getText()).isEqualTo(createdNote.getText());
        Assertions.assertThat(getNote.getBoardId()).isEqualTo(createdNote.getBoardId());
        Assertions.assertThat(getNote.getColor()).isEqualTo(createdNote.getColor());
        Assertions.assertThat(getNote.getOrderNum()).isEqualTo(createdNote.getOrderNum());

        // Partial Update
        PostitNoteDto partialUpdate = new PostitNoteDto();
        partialUpdate.setId(createdNote.getId());
        partialUpdate.setName("Partial Update");
        PostitNoteDto updatedNote = restTemplate.patchForObject("/postit/notes/{id}", partialUpdate,
                PostitNoteDto.class, partialUpdate.getId());
        Assertions.assertThat(updatedNote).isNotNull();
        Assertions.assertThat(updatedNote.getId()).isEqualTo(createdNote.getId());
        Assertions.assertThat(updatedNote.getName()).isEqualTo(partialUpdate.getName());
        Assertions.assertThat(updatedNote.getText()).isEqualTo(createdNote.getText());
        Assertions.assertThat(updatedNote.getColor()).isEqualTo(createdNote.getColor());
        Assertions.assertThat(updatedNote.getOrderNum()).isEqualTo(createdNote.getOrderNum());

        // Complete Update
        PostitNoteDto completeUpdate = new PostitNoteDto();
        completeUpdate.setId(createdNote.getId());
        completeUpdate.setName("Complete Update");
        completeUpdate.setText("Text 2");
        completeUpdate.setColor("orange");
        completeUpdate.setOrderNum(2);
        updatedNote = restTemplate.patchForObject("/postit/notes/{id}", completeUpdate, PostitNoteDto.class,
                partialUpdate.getId());
        Assertions.assertThat(updatedNote).isNotNull();
        Assertions.assertThat(updatedNote.getId()).isEqualTo(completeUpdate.getId());
        Assertions.assertThat(updatedNote.getName()).isEqualTo(completeUpdate.getName());
        Assertions.assertThat(updatedNote.getText()).isEqualTo(completeUpdate.getText());
        Assertions.assertThat(updatedNote.getColor()).isEqualTo(completeUpdate.getColor());
        Assertions.assertThat(updatedNote.getOrderNum()).isNotNull();

        // Get List
        PostitNoteDto[] noteList = restTemplate.getForObject("/postit/notes?boardId={boardId}", PostitNoteDto[].class,
                updatedNote.getBoardId());
        Assertions.assertThat(noteList).isNotNull().isNotEmpty();
        Assertions.assertThat(noteList[0].getId()).isEqualTo(updatedNote.getId());

        // Delete
        restTemplate.delete("/postit/notes/" + updatedNote.getId());

        // Final Check
        noteList = restTemplate.getForObject("/postit/notes?boardId={boardId}", PostitNoteDto[].class,
                updatedNote.getBoardId());
        Assertions.assertThat(noteList).isNotNull().isEmpty();
    }

}
