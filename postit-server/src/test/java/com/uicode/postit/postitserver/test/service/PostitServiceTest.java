package com.uicode.postit.postitserver.test.service;

import java.util.ArrayList;
import java.util.List;

import org.assertj.core.api.Assertions;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.test.context.junit4.SpringRunner;

import com.uicode.postit.postitserver.dto.postit.PostitNoteDto;
import com.uicode.postit.postitserver.entity.postit.Board;
import com.uicode.postit.postitserver.entity.postit.PostitNote;
import com.uicode.postit.postitserver.service.IPostitNoteService;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = WebEnvironment.MOCK)
public class PostitServiceTest {

    @Autowired
    private IPostitNoteService postitNoteService;

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
                Assert.assertTrue("Sort: previous < actual", previous < note.getOrderNum());
            }
            if (note.getId().equals(changeDto.getId())) {
                Assert.assertEquals(note.getOrderNum(), changeDto.getOrderNum());
            }
            previous = note.getOrderNum();
        }
        return true;
    }

}
