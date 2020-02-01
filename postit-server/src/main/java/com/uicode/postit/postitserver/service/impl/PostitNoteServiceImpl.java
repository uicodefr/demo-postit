package com.uicode.postit.postitserver.service.impl;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.google.common.collect.Streams;
import com.opencsv.CSVWriter;
import com.uicode.postit.postitserver.dao.postit.BoardDao;
import com.uicode.postit.postitserver.dao.postit.PostitNoteDao;
import com.uicode.postit.postitserver.dto.postit.BoardDto;
import com.uicode.postit.postitserver.dto.postit.PostitNoteDto;
import com.uicode.postit.postitserver.entity.postit.Board;
import com.uicode.postit.postitserver.entity.postit.PostitNote;
import com.uicode.postit.postitserver.exception.FunctionnalException;
import com.uicode.postit.postitserver.exception.InvalidDataException;
import com.uicode.postit.postitserver.exception.NotFoundException;
import com.uicode.postit.postitserver.mapper.postit.BoardMapper;
import com.uicode.postit.postitserver.mapper.postit.PostitNoteMapper;
import com.uicode.postit.postitserver.service.GlobalService;
import com.uicode.postit.postitserver.service.PostitNoteService;
import com.uicode.postit.postitserver.util.CheckDataUtil;
import com.uicode.postit.postitserver.util.parameter.ParameterConst;
import com.uicode.postit.postitserver.util.parameter.ParameterUtil;

@Service
@Transactional
public class PostitNoteServiceImpl implements PostitNoteService {

    private static final Logger LOGGER = LogManager.getLogger(PostitNoteServiceImpl.class);

    private static final String[] EXPORT_HEADERS = { "board id", "board name", "note id", "note name", "note text",
            "note color", "note order" };

    @Autowired
    private BoardDao boardDao;

    @Autowired
    private PostitNoteDao postitNoteDao;

    @Autowired
    private GlobalService globalService;

    @Override
    public List<BoardDto> getBoardList() {
        Iterable<Board> boardIterable = boardDao.findAll(Sort.by("id").ascending());
        return Streams.stream(boardIterable).map(BoardMapper.INSTANCE::toDto).collect(Collectors.toList());
    }

    @Override
    public BoardDto saveBoard(Long boardId, BoardDto boardDto) throws NotFoundException, FunctionnalException {
        Board board = null;

        if (boardId == null) {
            // Creation
            Optional<String> maxBoardParameter = globalService.getParameterValue(ParameterConst.BOARD_MAX);
            Long maxBoard = ParameterUtil.getLong(maxBoardParameter, 0l);
            if (boardDao.count() > maxBoard) {
                throw new FunctionnalException("Max Board achieved : creation is blocked");
            }

            board = new Board();

        } else {
            // Update
            Optional<Board> boardOpt = boardDao.findById(boardId);
            board = boardOpt.orElseThrow(() -> new NotFoundException("Board"));
        }

        board.setName(boardDto.getName());

        return BoardMapper.INSTANCE.toDto(boardDao.save(board));
    }

    @Override
    public void deleteBoard(Long boardId) {
        Optional<Board> boardOpt = boardDao.findById(boardId);
        if (!boardOpt.isPresent()) {
            LOGGER.warn("Board not found for deletion, id = %s", boardId);
            return;
        }

        Board board = boardOpt.get();
        board.getNoteList().forEach(postitNoteDao::delete);
        boardDao.delete(board);
    }

    @Override
    public List<PostitNoteDto> getNoteList(Long boardId) {
        Iterable<PostitNote> noteIterable = postitNoteDao.findByBoardIdOrderByOrderNum(boardId);
        return Streams.stream(noteIterable).map(PostitNoteMapper.INSTANCE::toDto).collect(Collectors.toList());
    }

    @Override
    public PostitNoteDto getNote(Long noteId) throws NotFoundException {
        Optional<PostitNote> noteOpt = postitNoteDao.findById(noteId);
        return PostitNoteMapper.INSTANCE.toDto(noteOpt.orElseThrow(() -> new NotFoundException("Note")));
    }

    @Override
    public PostitNoteDto saveNote(Long noteId, PostitNoteDto noteDto)
            throws NotFoundException, InvalidDataException, FunctionnalException {
        PostitNote note = null;

        if (noteId == null) {
            // Creation
            CheckDataUtil.checkNotNull("boardId", noteDto.getBoardId());
            CheckDataUtil.checkNotNull("name", noteDto.getName());
            Optional<String> maxNoteParameter = globalService.getParameterValue(ParameterConst.NOTE_MAX);
            Long maxNote = ParameterUtil.getLong(maxNoteParameter, 0l);
            if (postitNoteDao.countByBoardId(noteDto.getBoardId()) > maxNote) {
                throw new FunctionnalException("Max Postit Note achieved : creation is blocked");
            }

            note = new PostitNote();
            note.setOrderNum(postitNoteDao.getMaxOrderForByBoardId(noteDto.getBoardId()) + 1);

        } else {
            // Update
            Optional<PostitNote> noteOpt = postitNoteDao.findById(noteId);
            note = noteOpt.orElseThrow(() -> new NotFoundException("PostitNote"));
            if (noteDto.getOrderNum() != null) {
                reorderBoard(note, noteDto);
            }
        }

        if (noteDto.getBoardId() != null) {
            Optional<Board> boardOpt = boardDao.findById(noteDto.getBoardId());
            note.setBoard(boardOpt.orElseThrow(() -> new InvalidDataException("BoardId")));
        }
        PostitNoteMapper.INSTANCE.updateEntity(noteDto, note);

        return PostitNoteMapper.INSTANCE.toDto(postitNoteDao.save(note));
    }

    @Override
    public void reorderBoard(PostitNote noteToChange, PostitNoteDto noteChangeDto) {
        if (noteChangeDto.getOrderNum() < 1) {
            noteChangeDto.setOrderNum(1);
        } else if (noteChangeDto.getOrderNum() > noteToChange.getBoard().getNoteList().size()) {
            noteChangeDto.setOrderNum(noteToChange.getBoard().getNoteList().size());
        }

        Integer orderNum = 1;
        for (PostitNote noteOfBoard : noteToChange.getBoard().getNoteList()) {
            if (noteOfBoard.getId().equals(noteToChange.getId())) {
                noteToChange.setOrderNum(noteChangeDto.getOrderNum());
            } else {
                if (noteChangeDto.getOrderNum().equals(orderNum)) {
                    orderNum++;
                }
                noteOfBoard.setOrderNum(orderNum++);
            }
        }
    }

    @Override
    public void deleteNote(Long noteId) {
        postitNoteDao.deleteById(noteId);
    }

    @Override
    public void exportNotesToCsv(PrintWriter writer) throws IOException {
        CSVWriter csvWriter = new CSVWriter(writer);

        csvWriter.writeNext(EXPORT_HEADERS);

        for (BoardDto board : getBoardList()) {
            for (PostitNoteDto note : getNoteList(board.getId())) {
                List<String> contentLineList = new ArrayList<>();
                contentLineList.add(board.getId().toString());
                contentLineList.add(board.getName());
                contentLineList.add(note.getId().toString());
                contentLineList.add(note.getName());
                contentLineList.add(note.getText());
                contentLineList.add(note.getColor());
                contentLineList.add(note.getOrderNum().toString());
                
                csvWriter.writeNext(contentLineList.toArray(new String[contentLineList.size()]));
            }
        }

        csvWriter.close();
    }

}
