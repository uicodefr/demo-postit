package com.uicode.postit.postitserver.service.postit.impl;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.uicode.postit.postitserver.dao.postit.AttachedFileDao;
import com.uicode.postit.postitserver.dao.postit.PostitNoteDao;
import com.uicode.postit.postitserver.dto.PageDto;
import com.uicode.postit.postitserver.dto.global.FileToDownload;
import com.uicode.postit.postitserver.dto.postit.AttachedFileDto;
import com.uicode.postit.postitserver.entity.postit.AttachedFile;
import com.uicode.postit.postitserver.entity.postit.AttachedFileData;
import com.uicode.postit.postitserver.entity.postit.PostitNote;
import com.uicode.postit.postitserver.exception.TechnicalException;
import com.uicode.postit.postitserver.exception.functionnal.FunctionnalException;
import com.uicode.postit.postitserver.exception.functionnal.InvalidDataException;
import com.uicode.postit.postitserver.exception.functionnal.NotFoundException;
import com.uicode.postit.postitserver.mapper.postit.AttachedFileMapper;
import com.uicode.postit.postitserver.service.postit.AttachedFileService;
import com.uicode.postit.postitserver.util.CheckDataUtil;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class AttachedFileServiceImpl implements AttachedFileService {

    private final AttachedFileDao attachedFileDao;
    private final PostitNoteDao postitNoteDao;
    private final AttachedFileMapper attachedFileMapper;

    @Override
    public PageDto<AttachedFileDto> getAttachedFileList(Integer page, Integer size) throws InvalidDataException {
        CheckDataUtil.checkCondition(page >= 0, "page should be equal or greater than 0");
        CheckDataUtil.checkCondition(size >= 1 && size <= 100, "size should be between than 1 and 100");
        log.info("Get getAttachedFileList for the page {} and the size {}", page, size);

        Pageable pageById = PageRequest.of(page, size, Sort.by("id"));
        Page<AttachedFile> attachedFilesPage = attachedFileDao.findAll(pageById);

        return PageDto.of(attachedFilesPage, attachedFileMapper::toDto);
    }

    @Override
    public AttachedFileDto getAttachedFile(Long attachedFileId) throws NotFoundException {
        log.info("Get AttachedFile with the id : {}", attachedFileId);
        Optional<AttachedFile> attachedFileOpt = attachedFileDao.findById(attachedFileId);
        return attachedFileMapper
            .toDto(attachedFileOpt.orElseThrow(() -> new NotFoundException("AttachedFile")));
    }

    @Override
    public FileToDownload getAttachedFileContent(Long attachedFileId) throws NotFoundException, TechnicalException {
        AttachedFile attachedFile = attachedFileDao.findById(attachedFileId)
            .orElseThrow(() -> new NotFoundException("AttachedFile"));

        FileToDownload fileToDownload = new FileToDownload();
        fileToDownload.setFilename(attachedFile.getFilename());
        fileToDownload.setInputStream(new ByteArrayInputStream(attachedFile.getFiledata().getData()));
        fileToDownload.setSize(attachedFile.getSize());
        fileToDownload.setType(attachedFile.getType());
        return fileToDownload;
    }

    @Override
    public AttachedFileDto uploadAttachedFile(Long noteId, MultipartFile file)
            throws NotFoundException, FunctionnalException, TechnicalException, InvalidDataException {
        PostitNote postitNote = postitNoteDao.findById(noteId).orElseThrow(() -> new NotFoundException("PostitNote"));
        if (postitNote.getAttachedFile() != null) {
            throw new FunctionnalException("The note have already a file, delete it first");
        }

        byte[] filedata;
        try {
            CheckDataUtil.checkNotNull("file", file);
            filedata = file.getBytes();
        } catch (IOException exception) {
            throw new TechnicalException("Error getting bytes from file", exception);
        }

        log.info("Upload AttachedFile {} on the note : {}", file.getOriginalFilename(), noteId);
        AttachedFile attachedFile = new AttachedFile();
        attachedFile.setFilename(file.getOriginalFilename());
        attachedFile.setFiledata(new AttachedFileData(filedata, attachedFile));
        attachedFile.setSize(file.getSize());
        attachedFile.setType(file.getContentType());
        attachedFile = attachedFileDao.save(attachedFile);

        postitNote.setAttachedFile(attachedFile);

        return attachedFileMapper.toDto(attachedFile);
    }

    @Override
    public void deleteAttachedFile(Long attachedFileId) {
        Optional<AttachedFile> attachedFileOpt = attachedFileDao.findById(attachedFileId);
        if (!attachedFileOpt.isPresent()) {
            log.warn("AttachedFile not found for deletion, id = %s", attachedFileId);
            return;
        }

        // Remove the attached file from the note first
        attachedFileOpt.get().getPostitNote().setAttachedFile(null);
        attachedFileDao.delete(attachedFileOpt.get());

        log.info("Delete attachedFile with the id : {}", attachedFileId);
    }

}
