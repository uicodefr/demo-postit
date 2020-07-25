package com.uicode.postit.postitserver.test.controller.postit;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;

import com.uicode.postit.postitserver.dto.PageDto;
import com.uicode.postit.postitserver.dto.postit.AttachedFileDto;
import com.uicode.postit.postitserver.dto.postit.PostitNoteDto;
import com.uicode.postit.postitserver.util.AppTestRequestInterceptor;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@AutoConfigureTestDatabase
class AttachedFileControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @SuppressWarnings("unchecked")
    @Test
    void attachedFileCrud() {
        // CSRF Interceptor
        AppTestRequestInterceptor appTestRequestInterceptor = AppTestRequestInterceptor.addInterceptor(restTemplate);
        appTestRequestInterceptor.simpleGetForCsrf();

        // Get List
        PageDto<AttachedFileDto> attachedFilesPage = restTemplate.getForObject("/postit/attached-files",
                new PageDto<AttachedFileDto>().getClass());
        Assertions.assertThat(attachedFilesPage).isNotNull();
        Assertions.assertThat(attachedFilesPage.getTotalElements()).isNotNull().isGreaterThan(0);
        Assertions.assertThat(attachedFilesPage.getTotalPages()).isNotNull().isGreaterThan(0);
        Long totalAttachedFilesBefore = attachedFilesPage.getTotalElements();

        // Attach a new file
        LinkedMultiValueMap<String, Object> parameters = new LinkedMultiValueMap<String, Object>();
        parameters.add("file", new ClassPathResource("/image.jpg"));
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        HttpEntity<LinkedMultiValueMap<String, Object>> entity = new HttpEntity<LinkedMultiValueMap<String, Object>>(
                parameters, headers);
        ResponseEntity<AttachedFileDto> attachFileResponse = restTemplate
            .exchange("/postit/notes/{noteId}/attached-file", HttpMethod.PUT, entity, AttachedFileDto.class, 1);
        Assertions.assertThat(attachFileResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        Assertions.assertThat(attachFileResponse.getBody()).isNotNull();
        Assertions.assertThat(attachFileResponse.getBody().getId()).isNotNull();
        Assertions.assertThat(attachFileResponse.getBody().getFilename()).isEqualTo("image.jpg");
        Assertions.assertThat(attachFileResponse.getBody().getType()).isEqualTo("image/jpeg");
        Assertions.assertThat(attachFileResponse.getBody().getSize()).isEqualTo(431227);
        Long attachedFileId = attachFileResponse.getBody().getId();

        // Get it directly
        AttachedFileDto attachedFileDto = restTemplate.getForObject("/postit/attached-files/{id}",
                AttachedFileDto.class, attachedFileId);
        Assertions.assertThat(attachedFileDto).isNotNull();
        Assertions.assertThat(attachedFileDto.getId()).isNotNull();
        Assertions.assertThat(attachedFileDto.getFilename()).isEqualTo("image.jpg");
        Assertions.assertThat(attachedFileDto.getType()).isEqualTo("image/jpeg");
        Assertions.assertThat(attachedFileDto.getSize()).isEqualTo(431227);
        Assertions.assertThat(attachedFileDto.getPostitNoteId()).isEqualTo(1);

        // Get it from note
        PostitNoteDto postitNoteDto = restTemplate.getForObject("/postit/notes/{id}", PostitNoteDto.class, 1);
        Assertions.assertThat(postitNoteDto.getId()).isNotNull();
        Assertions.assertThat(postitNoteDto.getAttachedFile()).isNotNull();
        Assertions.assertThat(postitNoteDto.getAttachedFile().getId()).isNotNull();
        Assertions.assertThat(postitNoteDto.getAttachedFile().getFilename()).isEqualTo("image.jpg");
        Assertions.assertThat(postitNoteDto.getAttachedFile().getType()).isEqualTo("image/jpeg");
        Assertions.assertThat(postitNoteDto.getAttachedFile().getSize()).isEqualTo(431227);
        Assertions.assertThat(postitNoteDto.getAttachedFile().getPostitNoteId()).isEqualTo(1);

        // Download
        ResponseEntity<byte[]> attachedFileContentResponse = restTemplate
            .getForEntity("/postit/attached-files/{id}/content", byte[].class, attachedFileId);
        Assertions.assertThat(attachedFileContentResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        Assertions.assertThat(attachedFileContentResponse.getBody())
            .isNotNull()
            .hasSize(attachedFileDto.getSize().intValue());

        // Delete
        restTemplate.delete("/postit/attached-files/{id}", attachedFileId);

        // Final Check
        attachedFilesPage = restTemplate.getForObject("/postit/attached-files",
                new PageDto<AttachedFileDto>().getClass());
        Assertions.assertThat(attachedFilesPage).isNotNull();
        Assertions.assertThat(attachedFilesPage.getTotalElements()).isEqualTo(totalAttachedFilesBefore);

        postitNoteDto = restTemplate.getForObject("/postit/notes/{id}", PostitNoteDto.class, 1);
        Assertions.assertThat(postitNoteDto.getId()).isNotNull();
        Assertions.assertThat(postitNoteDto.getAttachedFile()).isNull();

        appTestRequestInterceptor.clear();
    }

}
