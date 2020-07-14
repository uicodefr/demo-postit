package com.uicode.postit.postitserver.service.postit;

import java.util.List;

import com.uicode.postit.postitserver.dto.postit.BoardDto;
import com.uicode.postit.postitserver.exception.FunctionnalException;
import com.uicode.postit.postitserver.exception.NotFoundException;

public interface BoardService {

    List<BoardDto> getBoardList();

    BoardDto saveBoard(Long boardId, BoardDto boardDto) throws NotFoundException, FunctionnalException;

    void deleteBoard(Long boardId);

}
