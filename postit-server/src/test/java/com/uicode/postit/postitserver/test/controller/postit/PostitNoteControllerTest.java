package com.uicode.postit.postitserver.test.controller.postit;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;

import com.uicode.postit.postitserver.dto.postit.PostitNoteDto;
import com.uicode.postit.postitserver.util.AppTestRequestInterceptor;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@AutoConfigureTestDatabase
class PostitNoteControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void noteCrud() {
        // CSRF Interceptor
        AppTestRequestInterceptor appTestRequestInterceptor = AppTestRequestInterceptor.addInterceptor(restTemplate);
        appTestRequestInterceptor.simpleGetForCsrf();

        PostitNoteDto noteDto = new PostitNoteDto();
        noteDto.setName("Name");
        noteDto.setText("Text");
        noteDto.setBoardId(1l);
        noteDto.setColor("white");
        noteDto.setOrderNum(1);

        PostitNoteDto createdNote = restTemplate.postForObject("/postit/notes", noteDto, PostitNoteDto.class);
        Assertions.assertThat(createdNote).isNotNull();
        Assertions.assertThat(createdNote.getId()).isNotNull();
        Assertions.assertThat(createdNote.getName()).isEqualTo(noteDto.getName());
        Assertions.assertThat(createdNote.getText()).isEqualTo(noteDto.getText());
        Assertions.assertThat(createdNote.getBoardId()).isEqualTo(noteDto.getBoardId());
        Assertions.assertThat(createdNote.getColor()).isEqualTo(noteDto.getColor());

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
                completeUpdate.getId());
        Assertions.assertThat(updatedNote).isNotNull();
        Assertions.assertThat(updatedNote.getId()).isEqualTo(completeUpdate.getId());
        Assertions.assertThat(updatedNote.getName()).isEqualTo(completeUpdate.getName());
        Assertions.assertThat(updatedNote.getText()).isEqualTo(completeUpdate.getText());
        Assertions.assertThat(updatedNote.getColor()).isEqualTo(completeUpdate.getColor());
        Assertions.assertThat(updatedNote.getOrderNum()).isNotNull();

        // Get List
        PostitNoteDto[] noteList = restTemplate.getForObject("/postit/notes?boardId={boardId}", PostitNoteDto[].class,
                updatedNote.getBoardId());
        Assertions.assertThat(noteList).isNotNull().isNotEmpty().anyMatch(updatedNote::equals);
        int noteListLength = noteList.length;

        // Delete
        restTemplate.delete("/postit/notes/" + updatedNote.getId());

        // Final Check
        noteList = restTemplate.getForObject("/postit/notes?boardId={boardId}", PostitNoteDto[].class,
                updatedNote.getBoardId());
        Assertions.assertThat(noteList).isNotNull().isNotEmpty().hasSize(noteListLength - 1);

        appTestRequestInterceptor.clear();
    }

    @Test
    void exportNotes() {
        String expectedCsv = "\"board id\",\"board name\",\"note id\",\"note name\",\"note text\",\"note color\",\"note order\",\"attached file\"\n";
        expectedCsv += "\"1\",\"Test Board\",\"1\",\"Test Note 1\",\"Test Content 1\",\"yellow\",\"1\",\n";
        expectedCsv += "\"1\",\"Test Board\",\"2\",\"Test Note 2\",\"Test Content 2\",\"blue\",\"2\",\"test.txt (0.01 ko)\"\n";

        String testCsv = restTemplate.getForObject("/postit/notes:export", String.class);
        Assertions.assertThat(testCsv).isEqualTo(expectedCsv);
    }

}
