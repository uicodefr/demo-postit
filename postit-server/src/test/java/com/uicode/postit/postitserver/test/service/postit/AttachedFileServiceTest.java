package com.uicode.postit.postitserver.test.service.postit;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;

import com.uicode.postit.postitserver.exception.functionnal.FunctionnalException;
import com.uicode.postit.postitserver.exception.functionnal.InvalidDataException;
import com.uicode.postit.postitserver.exception.functionnal.NotFoundException;
import com.uicode.postit.postitserver.service.postit.AttachedFileService;

@SpringBootTest
@AutoConfigureTestDatabase
class AttachedFileServiceTest {

    @Autowired
    private AttachedFileService attachedFileService;

    @Test
    void getListWithInvalidData() {
        Assertions.assertThatCode(() -> attachedFileService.getAttachedFileList(-1, 10))
            .isInstanceOf(InvalidDataException.class)
            .hasMessageContaining("page");

        Assertions.assertThatCode(() -> attachedFileService.getAttachedFileList(1, 0))
            .isInstanceOf(InvalidDataException.class)
            .hasMessageContaining("size");

        Assertions.assertThatCode(() -> attachedFileService.getAttachedFileList(1, 200))
            .isInstanceOf(InvalidDataException.class)
            .hasMessageContaining("size");
    }

    @Test
    void uploadFileError() {
        Assertions.assertThatCode(() -> attachedFileService.uploadAttachedFile(1234l, null))
            .isInstanceOf(NotFoundException.class)
            .hasMessageContaining("PostitNote");

        Assertions.assertThatCode(() -> attachedFileService.uploadAttachedFile(2l, null))
            .isInstanceOf(FunctionnalException.class)
            .hasMessageContaining("delete it");
    }

    @Test
    void getNotFound() {
        Assertions.assertThatCode(() -> attachedFileService.getAttachedFile(1234l))
            .isInstanceOf(NotFoundException.class)
            .hasMessageContaining("AttachedFile");

        Assertions.assertThatCode(() -> attachedFileService.getAttachedFileContent(1234l))
            .isInstanceOf(NotFoundException.class)
            .hasMessageContaining("AttachedFile");
    }

    @Test
    void deleteAttachedFileNotFound() {
        Assertions.assertThatCode(() -> attachedFileService.deleteAttachedFile(1234l)).doesNotThrowAnyException();
    }

}
