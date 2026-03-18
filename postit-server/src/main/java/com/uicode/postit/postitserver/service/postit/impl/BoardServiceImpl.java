package com.uicode.postit.postitserver.service.postit.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.google.common.collect.Streams;
import com.uicode.postit.postitserver.dao.postit.BoardDao;
import com.uicode.postit.postitserver.dao.postit.PostitNoteDao;
import com.uicode.postit.postitserver.dto.postit.BoardDto;
import com.uicode.postit.postitserver.entity.postit.Board;
import com.uicode.postit.postitserver.exception.functionnal.FunctionnalException;
import com.uicode.postit.postitserver.exception.functionnal.NotFoundException;
import com.uicode.postit.postitserver.mapper.postit.BoardMapper;
import com.uicode.postit.postitserver.service.global.GlobalService;
import com.uicode.postit.postitserver.service.postit.BoardService;
import com.uicode.postit.postitserver.util.parameter.ParameterConst;
import com.uicode.postit.postitserver.util.parameter.ParameterUtil;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class BoardServiceImpl implements BoardService {

    private final BoardDao boardDao;
    private final PostitNoteDao postitNoteDao;
    private final GlobalService globalService;
    private final BoardMapper boardMapper;

    @Override
    public List<BoardDto> getBoardList() {
        Iterable<Board> boardIterable = boardDao.findAll(Sort.by("orderNum", "id").ascending());
        return Streams.stream(boardIterable).map(boardMapper::toDto).toList();
    }

    @Override
    public BoardDto saveBoard(Long boardId, BoardDto boardDto) throws NotFoundException, FunctionnalException {
        Board board = null;

        if (boardId == null) {
            // Creation
            Optional<String> maxBoardParameter = globalService.getParameterValue(ParameterConst.BOARD_MAX);
            Long maxBoard = ParameterUtil.getLong(maxBoardParameter, 0l);
            if (boardDao.count() > maxBoard) {
                throw new FunctionnalException("Max Board achieved, creation is blocked");
            }

            board = new Board();
            log.info("Create board");

        } else {
            // Update
            Optional<Board> boardOpt = boardDao.findById(boardId);
            board = boardOpt.orElseThrow(() -> new NotFoundException("Board"));
            log.info("Update board with the id : {}", boardId);
        }

        board.setName(boardDto.getName());
        board.setOrderNum(boardDto.getOrderNum());

        return boardMapper.toDto(boardDao.save(board));
    }

    @Override
    public void deleteBoard(Long boardId) {
        Optional<Board> boardOpt = boardDao.findById(boardId);
        if (!boardOpt.isPresent()) {
            log.warn("Board not found for deletion, id = %s", boardId);
            return;
        }

        Board board = boardOpt.get();
        board.getNoteList().forEach(postitNoteDao::delete);
        boardDao.delete(board);
        log.info("Delete board with the id : {}", boardId);
    }

}
