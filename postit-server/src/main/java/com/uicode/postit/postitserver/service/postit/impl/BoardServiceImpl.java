package com.uicode.postit.postitserver.service.postit.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
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

@Service
@Transactional
public class BoardServiceImpl implements BoardService {

    private static final Logger LOGGER = LogManager.getLogger(BoardServiceImpl.class);

    @Autowired
    private BoardDao boardDao;

    @Autowired
    private PostitNoteDao postitNoteDao;

    @Autowired
    private GlobalService globalService;

    @Override
    public List<BoardDto> getBoardList() {
        Iterable<Board> boardIterable = boardDao.findAll(Sort.by("orderNum", "id").ascending());
        return Streams.stream(boardIterable).map(BoardMapper.INSTANCE::toDto).collect(Collectors.toList());
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
            LOGGER.info("Create board");

        } else {
            // Update
            Optional<Board> boardOpt = boardDao.findById(boardId);
            board = boardOpt.orElseThrow(() -> new NotFoundException("Board"));
            LOGGER.info("Update board with the id : {}", boardId);
        }

        board.setName(boardDto.getName());
        board.setOrderNum(boardDto.getOrderNum());

        return BoardMapper.INSTANCE.toDto(boardDao.save(board));
    }

    @Override
    public void deleteBoard(Long boardId) {
        Optional<Board> boardOpt = boardDao.findById(boardId);
        if (!boardOpt.isPresent()) {
            LOGGER.warn("Board not found for deletion, id = %s", boardId);
            return;
        }

        Board board = boardOpt.get();
        board.getNoteList().forEach(postitNoteDao::delete);
        boardDao.delete(board);
        LOGGER.info("Delete board with the id : {}", boardId);
    }

}
