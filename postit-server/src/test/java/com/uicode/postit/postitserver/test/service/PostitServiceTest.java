package com.uicode.postit.postitserver.test.service;

import java.util.ArrayList;
import java.util.List;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;

import com.uicode.postit.postitserver.dto.postit.BoardDto;
import com.uicode.postit.postitserver.dto.postit.PostitNoteDto;
import com.uicode.postit.postitserver.entity.postit.Board;
import com.uicode.postit.postitserver.entity.postit.PostitNote;
import com.uicode.postit.postitserver.service.IGlobalService;
import com.uicode.postit.postitserver.service.IPostitNoteService;
import com.uicode.postit.postitserver.utils.exception.FunctionnalException;
import com.uicode.postit.postitserver.utils.exception.InvalidDataException;
import com.uicode.postit.postitserver.utils.exception.NotFoundException;
import com.uicode.postit.postitserver.utils.parameter.ParameterConst;

@SpringBootTest
@AutoConfigureTestDatabase
public class PostitServiceTest {

    @Autowired
    private IPostitNoteService postitNoteService;

    @Autowired
    private IGlobalService globalService;

    @Test
    public void reorderBoard() {
        Board board = buildBoard(6);
        PostitNote noteToChange = board.getNoteList().get(3);
        PostitNoteDto changeDto = new PostitNoteDto();
        changeDto.setId(noteToChange.getId());
        changeDto.setOrderNum(1);
        postitNoteService.reorderBoard(noteToChange, changeDto);
        Assertions.assertThat(checkNoteList(board.getNoteList(), changeDto)).isTrue();

        board = buildBoard(6);
        noteToChange = board.getNoteList().get(3);
        changeDto = new PostitNoteDto();
        changeDto.setId(noteToChange.getId());
        changeDto.setOrderNum(5);
        postitNoteService.reorderBoard(noteToChange, changeDto);
        Assertions.assertThat(checkNoteList(board.getNoteList(), changeDto)).isTrue();
    }

    private Board buildBoard(int number) {
        Board board = new Board();
        board.setNoteList(new ArrayList<>());

        for (int i = 1; i <= number; i++) {
            PostitNote note = new PostitNote();
            note.setId(Long.valueOf(i));
            note.setOrderNum(i);
            note.setBoard(board);
            board.getNoteList().add(note);
        }

        return board;
    }

    private boolean checkNoteList(List<PostitNote> noteList, PostitNoteDto changeDto) {
        noteList.sort((note1, note2) -> {
            return note1.getOrderNum().compareTo(note2.getOrderNum());
        });
        Integer previous = null;
        for (PostitNote note : noteList) {
            if (previous != null) {
                Assertions.assertThat(previous).isLessThan(note.getOrderNum());
            }
            if (note.getId().equals(changeDto.getId())) {
                Assertions.assertThat(note.getOrderNum()).isEqualTo(changeDto.getOrderNum());
            }
            previous = note.getOrderNum();
        }
        return true;
    }

    @Test
    public void saveNoteError() throws NotFoundException, InvalidDataException, FunctionnalException {
        PostitNoteDto noteDto = new PostitNoteDto();
        Assertions.assertThatThrownBy(() -> postitNoteService.saveNote(noteDto.getId(), noteDto))
                .isInstanceOf(InvalidDataException.class);

        noteDto.setId(-1l);
        Assertions.assertThatThrownBy(() -> postitNoteService.saveNote(noteDto.getId(), noteDto))
                .isInstanceOf(NotFoundException.class);

        noteDto.setId(null);
        noteDto.setBoardId(1l);
        Assertions.assertThatThrownBy(() -> postitNoteService.saveNote(noteDto.getId(), noteDto))
                .isInstanceOf(InvalidDataException.class);

        Long noteMax = Long.valueOf(globalService.getParameterValue(ParameterConst.NOTE_MAX)
                .orElseThrow(() -> new InvalidDataException("noteMax")));
        for (int i = 0; i < noteMax; i++) {
            noteDto.setName("note " + i);
            Assertions.assertThat(postitNoteService.saveNote(noteDto.getId(), noteDto)).isNotNull();
        }

        noteDto.setName("No more");
        Assertions.assertThatThrownBy(() -> postitNoteService.saveNote(noteDto.getId(), noteDto))
                .isInstanceOf(FunctionnalException.class);
    }

    @Test
    public void changeBoard() throws NotFoundException, FunctionnalException, InvalidDataException {
        BoardDto boardOneDto = new BoardDto();
        boardOneDto.setName("board1");
        boardOneDto = postitNoteService.saveBoard(null, boardOneDto);

        BoardDto boardTwoDto = new BoardDto();
        boardTwoDto.setName("board2");
        boardTwoDto = postitNoteService.saveBoard(null, boardTwoDto);

        // Create note on boardOne
        PostitNoteDto noteDto = new PostitNoteDto();
        noteDto.setBoardId(boardOneDto.getId());
        noteDto.setName("Note");
        noteDto = postitNoteService.saveNote(null, noteDto);

        List<PostitNoteDto> noteListOnBoard1 = postitNoteService.getNoteList(boardOneDto.getId());
        Assertions.assertThat(noteListOnBoard1).hasSize(1);
        Assertions.assertThat(noteListOnBoard1.get(0)).isNotNull();
        Assertions.assertThat(noteListOnBoard1.get(0).getId()).isEqualTo(noteDto.getId());

        // Move note on boardTwo
        noteDto.setBoardId(boardTwoDto.getId());
        noteDto = postitNoteService.saveNote(noteDto.getId(), noteDto);

        noteListOnBoard1 = postitNoteService.getNoteList(boardOneDto.getId());
        Assertions.assertThat(noteListOnBoard1).hasSize(0);

        List<PostitNoteDto> noteListOnBoard2 = postitNoteService.getNoteList(boardTwoDto.getId());
        Assertions.assertThat(noteListOnBoard2).hasSize(1);
        Assertions.assertThat(noteListOnBoard2.get(0)).isNotNull();
        Assertions.assertThat(noteListOnBoard2.get(0).getId()).isEqualTo(noteDto.getId());
    }

}
