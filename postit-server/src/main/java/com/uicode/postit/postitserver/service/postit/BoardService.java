package com.uicode.postit.postitserver.service.postit;

import java.util.List;

import com.uicode.postit.postitserver.dto.postit.BoardDto;
import com.uicode.postit.postitserver.exception.functionnal.FunctionnalException;
import com.uicode.postit.postitserver.exception.functionnal.NotFoundException;

public interface BoardService {

    List<BoardDto> getBoardList();

    BoardDto saveBoard(Long boardId, BoardDto boardDto) throws NotFoundException, FunctionnalException;

    void deleteBoard(Long boardId);

}
