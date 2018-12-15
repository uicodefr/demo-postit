package com.uicode.postit.postitserver.dao.postit;

import org.springframework.data.domain.Sort;
import org.springframework.data.repository.CrudRepository;

import com.uicode.postit.postitserver.entity.postit.Board;

public interface IBoardDao extends CrudRepository<Board, Long> {

    Iterable<Board> findAll(Sort sort);

}
