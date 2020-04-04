package com.uicode.postit.postitserver.service;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.annotation.Nullable;

import com.uicode.postit.postitserver.dto.postit.BoardDto;
import com.uicode.postit.postitserver.dto.postit.PostitNoteDto;
import com.uicode.postit.postitserver.entity.postit.Board;
import com.uicode.postit.postitserver.entity.postit.PostitNote;
import com.uicode.postit.postitserver.exception.FunctionnalException;
import com.uicode.postit.postitserver.exception.InvalidDataException;
import com.uicode.postit.postitserver.exception.NotFoundException;


public interface PostitNoteService {

    List<BoardDto> getBoardList();

    BoardDto saveBoard(Long boardId, BoardDto boardDto) throws NotFoundException, FunctionnalException;

    void deleteBoard(Long boardId);

    List<PostitNoteDto> getNoteList(Long boardId);

    PostitNoteDto getNote(Long noteId) throws NotFoundException;

    PostitNoteDto saveNote(Long noteId, PostitNoteDto noteDto)
            throws NotFoundException, InvalidDataException, FunctionnalException;

    void deleteNote(Long noteId);

    void reorderBoard(Board board, PostitNote noteToChange, @Nullable Integer newNoteOrderNum);

    void exportNotesToCsv(PrintWriter writer) throws IOException;

}
