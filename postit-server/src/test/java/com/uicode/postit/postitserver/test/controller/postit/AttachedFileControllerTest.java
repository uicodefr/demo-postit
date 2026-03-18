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
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.test.web.servlet.client.MockMvcWebTestClient;
import org.springframework.web.context.WebApplicationContext;

import com.uicode.postit.postitserver.dto.PageDto;
import com.uicode.postit.postitserver.dto.postit.AttachedFileDto;
import com.uicode.postit.postitserver.dto.postit.PostitNoteDto;
import com.uicode.postit.postitserver.test.config.TestContainersConfig;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Import(TestContainersConfig.class)
@ActiveProfiles("integration-test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class AttachedFileControllerTest {

    @Autowired
    private WebApplicationContext wac;

    private WebTestClient webTestClient;

    @BeforeEach
    void setUp() {
        webTestClient = MockMvcWebTestClient.bindToApplicationContext(this.wac)
            .configureClient()
            .codecs(config -> config
                    .defaultCodecs().maxInMemorySize(5 * 1024 * 1024))
            .build();
    }

    private static Long attachedFileId;
    private static Long totalAttachedFilesBefore;

    @Test
    @Order(1)
    void listFilesBefore() {
        webTestClient.get()
            .uri("/postit/attached-files")
            .exchange()
            .expectStatus().isOk()
            .expectBody(PageDto.class)
            .value(page -> {
                Assertions.assertThat(page).isNotNull();
                totalAttachedFilesBefore = page.getTotalElements();
            });
    }

    @Test
    @Order(2)
    void attachFile() {
        MultipartBodyBuilder builder = new MultipartBodyBuilder();
        builder.part("file", new ClassPathResource("/image.jpg"));

        attachedFileId = webTestClient.put()
            .uri("/postit/notes/{noteId}/attached-file", 1)
            .bodyValue(builder.build())
            .exchange()
            .expectStatus().isOk()
            .expectBody(AttachedFileDto.class)
            .value(dto -> {
                Assertions.assertThat(dto.getFilename()).isEqualTo("image.jpg");
                Assertions.assertThat(dto.getType()).isEqualTo("image/jpeg");
                Assertions.assertThat(dto.getSize()).isEqualTo(431227);
            })
            .returnResult()
            .getResponseBody()
            .getId();
    }

    @Test
    @Order(3)
    void getAttachedFileDirectly() {
        webTestClient.get()
            .uri("/postit/attached-files/{id}", attachedFileId)
            .exchange()
            .expectStatus().isOk()
            .expectBody(AttachedFileDto.class)
            .value(dto -> {
                Assertions.assertThat(dto.getId()).isEqualTo(attachedFileId);
                Assertions.assertThat(dto.getPostitNoteId()).isEqualTo(1);
            });
    }

    @Test
    @Order(4)
    void getAttachedFileFromNote() {
        webTestClient.get()
            .uri("/postit/notes/{id}", 1)
            .exchange()
            .expectStatus().isOk()
            .expectBody(PostitNoteDto.class)
            .value(dto -> {
                Assertions.assertThat(dto.getAttachedFile()).isNotNull();
                Assertions.assertThat(dto.getAttachedFile().getId()).isEqualTo(attachedFileId);
            });
    }

    @Test
    @Order(5)
    void downloadFile() {
        webTestClient.get()
            .uri("/postit/attached-files/{id}/content", attachedFileId)
            .exchange()
            .expectStatus().isOk()
            .expectBody(byte[].class)
            .value(content -> {
                Assertions.assertThat(content).isNotNull().hasSize(431227);
            });
    }

    @Test
    @Order(6)
    void deleteAttachedFile() {
        webTestClient.delete()
            .uri("/postit/attached-files/{id}", attachedFileId)
            .exchange()
            .expectStatus().isNoContent();
    }

    @Test
    @Order(7)
    void finalCheckAfterDeletion() {
        webTestClient.get()
            .uri("/postit/attached-files")
            .exchange()
            .expectStatus().isOk()
            .expectBody(PageDto.class)
            .value(page -> {
                Assertions.assertThat(page.getTotalElements()).isEqualTo(totalAttachedFilesBefore);
            });

        webTestClient.get()
            .uri("/postit/notes/{id}", 1)
            .exchange()
            .expectStatus().isOk()
            .expectBody(PostitNoteDto.class)
            .value(dto -> {
                Assertions.assertThat(dto.getAttachedFile()).isNull();
            });

        webTestClient.get()
            .uri("/postit/attached-files/{id}/content", attachedFileId)
            .exchange()
            .expectStatus().isNotFound();
    }

}
