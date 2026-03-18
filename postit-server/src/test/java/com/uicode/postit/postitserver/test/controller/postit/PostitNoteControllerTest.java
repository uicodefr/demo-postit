package com.uicode.postit.postitserver.test.controller.postit;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.test.web.servlet.client.MockMvcWebTestClient;
import org.springframework.web.context.WebApplicationContext;

import com.uicode.postit.postitserver.dto.postit.PostitNoteDto;
import com.uicode.postit.postitserver.test.config.TestContainersConfig;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Import(TestContainersConfig.class)
@ActiveProfiles("integration-test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class PostitNoteControllerTest {

    @Autowired
    private WebApplicationContext wac;

    private WebTestClient webTestClient;

    private static PostitNoteDto sharedNote;
    private static int initialNoteListLength;

    @BeforeEach
    void setUp() {
        webTestClient = MockMvcWebTestClient.bindToApplicationContext(this.wac).build();
    }

    @Test
    @Order(1)
    void createNote() {
        PostitNoteDto noteDto = new PostitNoteDto();
        noteDto.setName("Name");
        noteDto.setText("Text");
        noteDto.setBoardId(1l);
        noteDto.setColor("white");
        noteDto.setOrderNum(1);

        // Create
        sharedNote = webTestClient.post()
            .uri("/postit/notes")
            .bodyValue(noteDto)
            .exchange()
            .expectStatus().isOk()
            .expectBody(PostitNoteDto.class)
            .value(dto -> {
                Assertions.assertThat(dto).isNotNull();
                Assertions.assertThat(dto.getId()).isNotNull();
                Assertions.assertThat(dto.getName()).isEqualTo(noteDto.getName());
                Assertions.assertThat(dto.getText()).isEqualTo(noteDto.getText());
                Assertions.assertThat(dto.getBoardId()).isEqualTo(noteDto.getBoardId());
                Assertions.assertThat(dto.getColor()).isEqualTo(noteDto.getColor());
            })
            .returnResult()
            .getResponseBody();
    }

    @Test
    @Order(2)
    void getNote() {
        // Get
        webTestClient.get()
            .uri("/postit/notes/{id}", sharedNote.getId())
            .exchange()
            .expectStatus().isOk()
            .expectBody(PostitNoteDto.class)
            .value(dto -> {
                Assertions.assertThat(dto).isNotNull();
                Assertions.assertThat(dto.getId()).isEqualTo(sharedNote.getId());
                Assertions.assertThat(dto.getName()).isEqualTo(sharedNote.getName());
                Assertions.assertThat(dto.getText()).isEqualTo(sharedNote.getText());
                Assertions.assertThat(dto.getBoardId()).isEqualTo(sharedNote.getBoardId());
                Assertions.assertThat(dto.getColor()).isEqualTo(sharedNote.getColor());
                Assertions.assertThat(dto.getOrderNum()).isEqualTo(sharedNote.getOrderNum());
            });
    }

    @Test
    @Order(3)
    void partialUpdateNote() {
        // Partial Update
        PostitNoteDto partialUpdate = new PostitNoteDto();
        partialUpdate.setId(sharedNote.getId());
        partialUpdate.setName("Partial Update");
        webTestClient.patch()
            .uri("/postit/notes/{id}", sharedNote.getId())
            .bodyValue(partialUpdate)
            .exchange()
            .expectStatus().isOk()
            .expectBody(PostitNoteDto.class)
            .value(dto -> {
                Assertions.assertThat(dto).isNotNull();
                Assertions.assertThat(dto.getId()).isEqualTo(sharedNote.getId());
                Assertions.assertThat(dto.getName()).isEqualTo("Partial Update");
                Assertions.assertThat(dto.getText()).isEqualTo(sharedNote.getText());
                Assertions.assertThat(dto.getColor()).isEqualTo(sharedNote.getColor());
                Assertions.assertThat(dto.getOrderNum()).isEqualTo(sharedNote.getOrderNum());
            });
    }

    @Test
    @Order(4)
    void completeUpdateNote() {
        // Complete Update
        PostitNoteDto completeUpdate = new PostitNoteDto();
        completeUpdate.setId(sharedNote.getId());
        completeUpdate.setName("Complete Update");
        completeUpdate.setText("Text 2");
        completeUpdate.setColor("orange");
        completeUpdate.setOrderNum(2);

        sharedNote = webTestClient.patch()
            .uri("/postit/notes/{id}", completeUpdate.getId())
            .bodyValue(completeUpdate)
            .exchange()
            .expectStatus().isOk()
            .expectBody(PostitNoteDto.class)
            .value(dto -> {
                Assertions.assertThat(dto).isNotNull();
                Assertions.assertThat(dto.getId()).isEqualTo(completeUpdate.getId());
                Assertions.assertThat(dto.getName()).isEqualTo(completeUpdate.getName());
                Assertions.assertThat(dto.getText()).isEqualTo(completeUpdate.getText());
                Assertions.assertThat(dto.getColor()).isEqualTo(completeUpdate.getColor());
                Assertions.assertThat(dto.getOrderNum()).isNotNull();
            })
            .returnResult()
            .getResponseBody();
    }

    @Test
    @Order(5)
    void getListAndPrepareDelete() {
        // Get List
        initialNoteListLength = webTestClient.get()
            .uri("/postit/notes?boardId={boardId}", sharedNote.getBoardId())
            .exchange()
            .expectStatus().isOk()
            .expectBody(PostitNoteDto[].class)
            .value(noteList -> {
                Assertions.assertThat(noteList).isNotNull().isNotEmpty().anyMatch(sharedNote::equals);
            })
            .returnResult()
            .getResponseBody().length;
    }

    @Test
    @Order(6)
    void deleteNote() {
        // Delete
        webTestClient.delete()
            .uri("/postit/notes/{id}", sharedNote.getId())
            .exchange()
            .expectStatus().isNoContent();

        // Final Check
        webTestClient.get()
            .uri("/postit/notes?boardId={boardId}", sharedNote.getBoardId())
            .exchange()
            .expectStatus().isOk()
            .expectBody(PostitNoteDto[].class)
            .value(noteList -> {
                Assertions.assertThat(noteList).isNotNull().hasSize(initialNoteListLength - 1);
            });
    }

    @Test
    void exportNotes() {
        webTestClient.get()
            .uri("/postit/notes:export")
            .exchange()
            .expectStatus().isOk()
            .expectBody(String.class)
            .value(testCsv -> {
                Assertions.assertThat(testCsv).contains("\"board id\",\"board name\",\"note id\",\"note name\",\"note text\",\"note color\",\"note order\",\"attached file\"");
                Assertions.assertThat(testCsv).contains("\"1\",\"Io\",\"1\",\"First Note\",\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\",\"yellow\",");
            });
    }

}
