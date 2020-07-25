package com.uicode.postit.postitserver.test.service.postit;

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
import com.uicode.postit.postitserver.exception.functionnal.FunctionnalException;
import com.uicode.postit.postitserver.exception.functionnal.InvalidDataException;
import com.uicode.postit.postitserver.exception.functionnal.NotFoundException;
import com.uicode.postit.postitserver.service.global.GlobalService;
import com.uicode.postit.postitserver.service.postit.BoardService;
import com.uicode.postit.postitserver.service.postit.PostitNoteService;
import com.uicode.postit.postitserver.util.parameter.ParameterConst;

@SpringBootTest
@AutoConfigureTestDatabase
class PostitNoteServiceTest {

    @Autowired
    private PostitNoteService postitNoteService;

    @Autowired
    private BoardService boardService;

    @Autowired
    private GlobalService globalService;

    @Test
    void getNoteNotFound() {
        Assertions.assertThatThrownBy(() -> postitNoteService.getNote(42l))
            .isInstanceOf(NotFoundException.class)
            .hasMessageContaining("Note");
    }

    @Test
    void fillOrderInCreation() throws NotFoundException, InvalidDataException, FunctionnalException {
        BoardDto newBoardDto = new BoardDto();
        newBoardDto.setName("test fillOrderInCreation");
        newBoardDto = boardService.saveBoard(null, newBoardDto);
        Assertions.assertThat(newBoardDto).isNotNull();
        Assertions.assertThat(newBoardDto.getId()).isNotNull();

        PostitNoteDto newNoteDto = new PostitNoteDto();
        newNoteDto.setBoardId(newBoardDto.getId());
        newNoteDto.setName("new note without order");

        for (int i = 1; i < 3; i++) {
            PostitNoteDto noteCreatedDto = postitNoteService.saveNote(null, newNoteDto);
            Assertions.assertThat(noteCreatedDto).isNotNull();
            Assertions.assertThat(noteCreatedDto.getId()).isNotNull();
            Assertions.assertThat(noteCreatedDto.getName()).isEqualTo(newNoteDto.getName());
            Assertions.assertThat(noteCreatedDto.getBoardId()).isEqualTo(newNoteDto.getBoardId());
            Assertions.assertThat(noteCreatedDto.getOrderNum()).isEqualTo(i);
        }
    }

    @Test
    void reorderBoard() {
        Board board = buildBoard(6);
        PostitNote noteToChange = board.getNoteList().get(3);
        postitNoteService.reorderBoard(board, noteToChange, -1);
        Assertions.assertThat(checkNoteList(board.getNoteList(), noteToChange, 1)).isTrue();

        board = buildBoard(6);
        noteToChange = board.getNoteList().get(3);
        postitNoteService.reorderBoard(board, noteToChange, 5);
        Assertions.assertThat(checkNoteList(board.getNoteList(), noteToChange, 5)).isTrue();
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

    private boolean checkNoteList(List<PostitNote> noteList, PostitNote noteToChange, Integer newOrderNum) {
        noteList.sort((note1, note2) -> {
            return note1.getOrderNum().compareTo(note2.getOrderNum());
        });
        Integer previous = null;
        for (PostitNote note : noteList) {
            if (previous != null) {
                Assertions.assertThat(previous).isLessThan(note.getOrderNum());
            }
            if (note.getId().equals(noteToChange.getId())) {
                Assertions.assertThat(note.getOrderNum()).isEqualTo(newOrderNum);
            }
            previous = note.getOrderNum();
        }
        return true;
    }

    @Test
    void saveNoteError() throws NotFoundException, InvalidDataException, FunctionnalException {
        PostitNoteDto noteDto = new PostitNoteDto();
        Assertions.assertThatThrownBy(() -> postitNoteService.saveNote(noteDto.getId(), noteDto))
            .isInstanceOf(InvalidDataException.class)
            .hasMessageContaining("boardId");

        noteDto.setId(-1l);
        Assertions.assertThatThrownBy(() -> postitNoteService.saveNote(noteDto.getId(), noteDto))
            .isInstanceOf(NotFoundException.class);

        noteDto.setId(null);
        noteDto.setBoardId(15l);
        Assertions.assertThatThrownBy(() -> postitNoteService.saveNote(noteDto.getId(), noteDto))
            .isInstanceOf(InvalidDataException.class)
            .hasMessageContaining("name");

        noteDto.setName("First note");
        Assertions.assertThatThrownBy(() -> postitNoteService.saveNote(noteDto.getId(), noteDto))
            .isInstanceOf(InvalidDataException.class)
            .hasMessageContaining("BoardId");

        noteDto.setBoardId(1l);
        Long noteMax = Long.valueOf(globalService.getParameterValue(ParameterConst.NOTE_MAX)
            .orElseThrow(() -> new InvalidDataException("noteMax")));
        for (int i = 2; i <= noteMax; i++) {
            noteDto.setName("note " + i);
            Assertions.assertThat(postitNoteService.saveNote(noteDto.getId(), noteDto)).isNotNull();
        }

        noteDto.setName("No more");
        Assertions.assertThatThrownBy(() -> postitNoteService.saveNote(noteDto.getId(), noteDto))
            .isInstanceOf(FunctionnalException.class);
    }

    @Test
    void moveInTheSameBoard() throws NotFoundException, FunctionnalException, InvalidDataException {
        // Create 3 notes in one board
        BoardDto boardDto = new BoardDto();
        boardDto.setName("board moveInTheSameBoard");
        boardDto = boardService.saveBoard(null, boardDto);

        PostitNoteDto noteDto = new PostitNoteDto();
        noteDto.setBoardId(boardDto.getId());
        noteDto.setName("Note moveInTheSameBoard");
        PostitNoteDto firstNoteDto = postitNoteService.saveNote(null, noteDto);
        PostitNoteDto secondNoteDto = postitNoteService.saveNote(null, noteDto);
        PostitNoteDto thirdNoteDto = postitNoteService.saveNote(null, noteDto);

        secondNoteDto.setOrderNum(1);
        postitNoteService.saveNote(secondNoteDto.getId(), secondNoteDto);

        List<PostitNoteDto> noteList = postitNoteService.getNoteList(boardDto.getId());
        Assertions.assertThat(noteList).hasSize(3);
        Assertions.assertThat(noteList.get(0).getOrderNum()).isEqualTo(1);
        Assertions.assertThat(noteList.get(0).getId()).isEqualTo(secondNoteDto.getId());
        Assertions.assertThat(noteList.get(1).getOrderNum()).isEqualTo(2);
        Assertions.assertThat(noteList.get(1).getId()).isEqualTo(firstNoteDto.getId());
        Assertions.assertThat(noteList.get(2).getOrderNum()).isEqualTo(3);
        Assertions.assertThat(noteList.get(2).getId()).isEqualTo(thirdNoteDto.getId());
    }

    @Test
    void changeBoardWithOrder() throws NotFoundException, FunctionnalException, InvalidDataException {
        // Create 3 notes on boardOne
        BoardDto boardOneDto = new BoardDto();
        boardOneDto.setName("board1");
        boardOneDto = boardService.saveBoard(null, boardOneDto);

        PostitNoteDto noteDto = new PostitNoteDto();
        noteDto.setBoardId(boardOneDto.getId());
        noteDto.setName("Note board1");
        postitNoteService.saveNote(null, noteDto);
        postitNoteService.saveNote(null, noteDto);
        postitNoteService.saveNote(null, noteDto);

        List<PostitNoteDto> noteListOnBoard1 = postitNoteService.getNoteList(boardOneDto.getId());
        Assertions.assertThat(noteListOnBoard1).hasSize(3);

        // Create 3 notes on boardTwo
        BoardDto boardTwoDto = new BoardDto();
        boardTwoDto.setName("board2");
        boardTwoDto = boardService.saveBoard(null, boardTwoDto);

        noteDto.setBoardId(boardTwoDto.getId());
        noteDto.setName("Note board2");
        postitNoteService.saveNote(null, noteDto);
        postitNoteService.saveNote(null, noteDto);
        postitNoteService.saveNote(null, noteDto);

        List<PostitNoteDto> noteListOnBoard2 = postitNoteService.getNoteList(boardTwoDto.getId());
        Assertions.assertThat(noteListOnBoard2).hasSize(3);

        // Move first note in boardOne to boardTwo
        PostitNoteDto noteToMoveDto = new PostitNoteDto();
        noteToMoveDto.setId(noteListOnBoard1.get(0).getId());
        noteToMoveDto.setBoardId(boardTwoDto.getId());
        noteToMoveDto.setOrderNum(2);

        PostitNoteDto noteMovedDto = postitNoteService.saveNote(noteToMoveDto.getId(), noteToMoveDto);
        Assertions.assertThat(noteMovedDto.getBoardId()).isEqualTo(boardTwoDto.getId());
        Assertions.assertThat(noteMovedDto.getOrderNum()).isEqualTo(2);

        // Final checks
        noteListOnBoard1 = postitNoteService.getNoteList(boardOneDto.getId());
        Assertions.assertThat(noteListOnBoard1).hasSize(2);
        for (int i = 0; i < 2; i++) {
            Assertions.assertThat(noteListOnBoard1.get(i).getOrderNum()).isEqualTo(i + 1);
        }

        noteListOnBoard2 = postitNoteService.getNoteList(boardTwoDto.getId());
        Assertions.assertThat(noteListOnBoard2).hasSize(4);
        for (int i = 0; i < 4; i++) {
            Assertions.assertThat(noteListOnBoard2.get(i).getOrderNum()).isEqualTo(i + 1);
        }
    }

}
