package com.uicode.postit.postitserver.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.uicode.postit.postitserver.dto.postit.BoardDto;
import com.uicode.postit.postitserver.dto.postit.PostitNoteDto;
import com.uicode.postit.postitserver.service.IPostitNoteService;
import com.uicode.postit.postitserver.utils.exception.FunctionnalException;
import com.uicode.postit.postitserver.utils.exception.InvalidDataException;
import com.uicode.postit.postitserver.utils.exception.NotFoundException;


@RestController
@RequestMapping("/postit")
public class PostitController {

    @Autowired
    private IPostitNoteService postitNoteService;

    // Boards

    @RequestMapping(value = "/boards", method = RequestMethod.GET)
    public List<BoardDto> getBoardList() {
        return postitNoteService.getBoardList();
    }

    @RequestMapping(value = "/boards", method = RequestMethod.POST)
    public BoardDto createBoard(@RequestBody BoardDto boardDto) throws NotFoundException, FunctionnalException {
        return postitNoteService.saveBoard(null, boardDto);
    }

    @RequestMapping(value = "/boards/{id}", method = RequestMethod.PATCH)
    public BoardDto updateBoard(@PathVariable(name = "id") Long boardId, @RequestBody BoardDto boardDto)
            throws NotFoundException, FunctionnalException {
        return postitNoteService.saveBoard(boardId, boardDto);
    }

    @RequestMapping(value = "/boards/{id}", method = RequestMethod.DELETE)
    public void deleteBoard(@PathVariable("id") Long boardId) {
        postitNoteService.deleteBoard(boardId);
    }

    // Notes

    @RequestMapping(value = "/notes", method = RequestMethod.GET)
    public List<PostitNoteDto> getNoteList(@RequestParam("boardId") Long boardId) {
        return postitNoteService.getNoteList(boardId);
    }

    @RequestMapping(value = "/notes/{id}", method = RequestMethod.GET)
    public PostitNoteDto getNote(@PathVariable("id") Long noteId) throws NotFoundException {
        return postitNoteService.getNote(noteId);
    }

    @RequestMapping(value = "/notes", method = RequestMethod.POST)
    public PostitNoteDto createNote(@RequestBody PostitNoteDto noteDto)
            throws NotFoundException, InvalidDataException, FunctionnalException {
        return postitNoteService.saveNote(null, noteDto);
    }

    @RequestMapping(value = "/notes/{id}", method = RequestMethod.PATCH)
    public PostitNoteDto updateNote(@PathVariable(name = "id") Long noteId,
            @RequestBody PostitNoteDto noteDto)
            throws NotFoundException, InvalidDataException, FunctionnalException {
        return postitNoteService.saveNote(noteId, noteDto);
    }

    @RequestMapping(value = "/notes/{id}", method = RequestMethod.DELETE)
    public void deleteNote(@PathVariable("id") Long noteId) {
        postitNoteService.deleteNote(noteId);
    }

}
