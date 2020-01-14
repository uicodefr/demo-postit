package com.uicode.postit.postitserver.service;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import com.uicode.postit.postitserver.dto.postit.BoardDto;
import com.uicode.postit.postitserver.dto.postit.PostitNoteDto;
import com.uicode.postit.postitserver.entity.postit.PostitNote;
import com.uicode.postit.postitserver.exception.FunctionnalException;
import com.uicode.postit.postitserver.exception.InvalidDataException;
import com.uicode.postit.postitserver.exception.NotFoundException;


public interface IPostitNoteService {

    List<BoardDto> getBoardList();

    BoardDto saveBoard(Long boardId, BoardDto boardDto) throws NotFoundException, FunctionnalException;

    void deleteBoard(Long boardId);

    List<PostitNoteDto> getNoteList(Long boardId);

    PostitNoteDto getNote(Long noteId) throws NotFoundException;

    PostitNoteDto saveNote(Long noteId, PostitNoteDto noteDto)
            throws NotFoundException, InvalidDataException, FunctionnalException;

    void deleteNote(Long noteId);

    void reorderBoard(PostitNote noteToChange, PostitNoteDto noteChangeDto);

    void exportNotesToCsv(PrintWriter writer) throws IOException;

}
