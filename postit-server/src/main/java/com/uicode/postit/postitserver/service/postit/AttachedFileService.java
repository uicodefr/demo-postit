package com.uicode.postit.postitserver.service.postit;

import org.springframework.web.multipart.MultipartFile;

import com.uicode.postit.postitserver.dto.PageDto;
import com.uicode.postit.postitserver.dto.global.FileToDownload;
import com.uicode.postit.postitserver.dto.postit.AttachedFileDto;
import com.uicode.postit.postitserver.exception.TechnicalException;
import com.uicode.postit.postitserver.exception.functionnal.FunctionnalException;
import com.uicode.postit.postitserver.exception.functionnal.InvalidDataException;
import com.uicode.postit.postitserver.exception.functionnal.NotFoundException;

public interface AttachedFileService {

    PageDto<AttachedFileDto> getAttachedFileList(Integer page, Integer size) throws InvalidDataException;

    AttachedFileDto getAttachedFile(Long attachedFileId) throws NotFoundException;

    FileToDownload getAttachedFileContent(Long attachedFileId) throws NotFoundException, TechnicalException;

    AttachedFileDto uploadAttachedFile(Long noteId, MultipartFile file)
            throws NotFoundException, FunctionnalException, TechnicalException, InvalidDataException;

    void deleteAttachedFile(Long attachedFileId);

}
