package com.uicode.postit.postitserver.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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

    @GetMapping("/boards")
    public List<BoardDto> getBoardList() {
        return postitNoteService.getBoardList();
    }

    @PostMapping("/boards")
    public BoardDto createBoard(@RequestBody BoardDto boardDto) throws NotFoundException, FunctionnalException {
        return postitNoteService.saveBoard(null, boardDto);
    }

    @PatchMapping("/boards/{id}")
    public BoardDto updateBoard(@PathVariable(name = "id") Long boardId, @RequestBody BoardDto boardDto)
            throws NotFoundException, FunctionnalException {
        return postitNoteService.saveBoard(boardId, boardDto);
    }

    @DeleteMapping("/boards/{id}")
    public void deleteBoard(@PathVariable("id") Long boardId) {
        postitNoteService.deleteBoard(boardId);
    }

    // Notes

    @GetMapping("/notes")
    public List<PostitNoteDto> getNoteList(@RequestParam("boardId") Long boardId) {
        return postitNoteService.getNoteList(boardId);
    }

    @GetMapping("/notes/{id}")
    public PostitNoteDto getNote(@PathVariable("id") Long noteId) throws NotFoundException {
        return postitNoteService.getNote(noteId);
    }

    @PostMapping("/notes")
    public PostitNoteDto createNote(@RequestBody PostitNoteDto noteDto)
            throws NotFoundException, InvalidDataException, FunctionnalException {
        return postitNoteService.saveNote(null, noteDto);
    }

    @PatchMapping("/notes/{id}")
    public PostitNoteDto updateNote(@PathVariable(name = "id") Long noteId,
            @RequestBody PostitNoteDto noteDto)
            throws NotFoundException, InvalidDataException, FunctionnalException {
        return postitNoteService.saveNote(noteId, noteDto);
    }

    @DeleteMapping("/notes/{id}")
    public void deleteNote(@PathVariable("id") Long noteId) {
        postitNoteService.deleteNote(noteId);
    }

}
