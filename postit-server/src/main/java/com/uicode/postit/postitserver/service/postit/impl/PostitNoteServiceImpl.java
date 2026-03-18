package com.uicode.postit.postitserver.service.postit.impl;

import java.io.IOException;
import java.io.PrintWriter;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.google.common.collect.Streams;
import com.opencsv.CSVWriter;
import com.uicode.postit.postitserver.dao.postit.BoardDao;
import com.uicode.postit.postitserver.dao.postit.PostitNoteDao;
import com.uicode.postit.postitserver.dto.postit.PostitNoteDto;
import com.uicode.postit.postitserver.entity.postit.Board;
import com.uicode.postit.postitserver.entity.postit.PostitNote;
import com.uicode.postit.postitserver.exception.functionnal.FunctionnalException;
import com.uicode.postit.postitserver.exception.functionnal.InvalidDataException;
import com.uicode.postit.postitserver.exception.functionnal.NotFoundException;
import com.uicode.postit.postitserver.mapper.postit.PostitNoteMapper;
import com.uicode.postit.postitserver.service.global.GlobalService;
import com.uicode.postit.postitserver.service.postit.PostitNoteService;
import com.uicode.postit.postitserver.util.CheckDataUtil;
import com.uicode.postit.postitserver.util.parameter.ParameterConst;
import com.uicode.postit.postitserver.util.parameter.ParameterUtil;

import jakarta.annotation.Nullable;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class PostitNoteServiceImpl implements PostitNoteService {

    private static final String[] EXPORT_HEADERS = { "board id", "board name", "note id", "note name", "note text",
            "note color", "note order", "attached file" };

    private final BoardDao boardDao;
    private final PostitNoteDao postitNoteDao;
    private final GlobalService globalService;
    private final PostitNoteMapper postitNoteMapper;


    @Override
    public List<PostitNoteDto> getNoteList(Long boardId) {
        log.info("Get NoteList for the board : {}", boardId);
        Iterable<PostitNote> noteIterable = postitNoteDao.findByBoardIdOrderByOrderNum(boardId);
        return Streams.stream(noteIterable).map(postitNoteMapper::toDto).toList();
    }

    @Override
    public PostitNoteDto getNote(Long noteId) throws NotFoundException {
        log.info("Get Note with the id : {}", noteId);
        Optional<PostitNote> noteOpt = postitNoteDao.findById(noteId);
        return postitNoteMapper.toDto(noteOpt.orElseThrow(() -> new NotFoundException("Note")));
    }

    @Override
    public PostitNoteDto saveNote(Long noteId, PostitNoteDto noteDto)
            throws NotFoundException, InvalidDataException, FunctionnalException {
        PostitNote note = null;
        boolean reorderBoard = false;
        Board formerBoard = null;

        if (noteId == null) {
            // Creation
            CheckDataUtil.checkNotNull("boardId", noteDto.getBoardId());
            CheckDataUtil.checkNotNull("name", noteDto.getName());
            Optional<String> maxNoteParameter = globalService.getParameterValue(ParameterConst.NOTE_MAX);
            Long maxNote = ParameterUtil.getLong(maxNoteParameter, 0l);
            if (postitNoteDao.countByBoardId(noteDto.getBoardId()) > maxNote) {
                throw new FunctionnalException("Max Postit Note achieved, creation is blocked");
            }

            note = new PostitNote();
            note.setOrderNum(postitNoteDao.getMaxOrderForByBoardId(noteDto.getBoardId()) + 1);
            log.info("Create note");

        } else {
            // Update
            Optional<PostitNote> noteOpt = postitNoteDao.findById(noteId);
            note = noteOpt.orElseThrow(() -> new NotFoundException("PostitNote"));
            if (noteDto.getOrderNum() != null) {
                reorderBoard = true;
            }
            log.info("Update note with the id : {}", noteId);
        }

        if (noteDto.getBoardId() != null) {
            formerBoard = note.getBoard();
            Optional<Board> boardOpt = boardDao.findById(noteDto.getBoardId());
            note.setBoard(boardOpt.orElseThrow(() -> new InvalidDataException("BoardId")));
        }
        if (reorderBoard) {
            reorderBoard(note.getBoard(), note, noteDto.getOrderNum());
            if (formerBoard != null && !note.getBoard().equals(formerBoard)) {
                reorderBoard(formerBoard, note, null);
            }
        }

        postitNoteMapper.updateEntity(noteDto, note);

        return postitNoteMapper.toDto(postitNoteDao.save(note));
    }

    @Override
    public void reorderBoard(Board board, PostitNote noteToChange, @Nullable Integer newNoteOrderNum) {
        if (newNoteOrderNum != null) {
            if (newNoteOrderNum < 1) {
                newNoteOrderNum = 1;
            } else if (newNoteOrderNum > board.getNoteList().size()) {
                newNoteOrderNum = board.getNoteList().size() + 1;
            }
            noteToChange.setOrderNum(newNoteOrderNum);
        }

        Integer iterateOrderNum = 1;
        for (PostitNote noteOfBoard : board.getNoteList()) {
            if (!noteOfBoard.equals(noteToChange)) {
                if (iterateOrderNum.equals(newNoteOrderNum)) {
                    iterateOrderNum++;
                }
                noteOfBoard.setOrderNum(iterateOrderNum++);
            }
        }
    }

    @Override
    public void deleteNote(Long noteId) {
        Optional<PostitNote> noteOpt = postitNoteDao.findById(noteId);
        if (!noteOpt.isPresent()) {
            log.warn("Note not found for deletion, id = %s", noteId);
            return;
        }

        // Delete cascade delete also the attachedFile
        postitNoteDao.delete(noteOpt.get());
        log.info("Delete note with the id : {}", noteId);
    }

    @Override
    public void exportNotesToCsv(PrintWriter writer) throws IOException {
        CSVWriter csvWriter = new CSVWriter(writer);

        csvWriter.writeNext(EXPORT_HEADERS);

        for (Board board : boardDao.findAll((Sort.by("id").ascending()))) {
            for (PostitNoteDto noteDto : getNoteList(board.getId())) {
                List<String> contentLineList = new ArrayList<>();
                contentLineList.add(board.getId().toString());
                contentLineList.add(board.getName());
                contentLineList.add(noteDto.getId().toString());
                contentLineList.add(noteDto.getName());
                contentLineList.add(noteDto.getText());
                contentLineList.add(noteDto.getColor());
                contentLineList.add(noteDto.getOrderNum().toString());

                if (noteDto.getAttachedFile() == null) {
                    contentLineList.add(null);
                } else {
                    NumberFormat numberFormat = NumberFormat.getNumberInstance(Locale.US);
                    numberFormat.setRoundingMode(RoundingMode.UP);
                    numberFormat.setMaximumFractionDigits(2);
                    String sizeInKo = numberFormat.format(noteDto.getAttachedFile().getSize() / 1000.0);
                    contentLineList.add(String.format("%s (%s ko)", noteDto.getAttachedFile().getFilename(), sizeInKo));
                }

                csvWriter.writeNext(contentLineList.toArray(new String[contentLineList.size()]));
            }
        }

        csvWriter.close();
        log.info("Export notes to csv");
    }

}
