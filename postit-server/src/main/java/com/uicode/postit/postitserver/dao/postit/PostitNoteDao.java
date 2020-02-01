package com.uicode.postit.postitserver.dao.postit;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.uicode.postit.postitserver.entity.postit.PostitNote;

public interface PostitNoteDao extends CrudRepository<PostitNote, Long> {

    long countByBoardId(Long boardId);

    @Query("SELECT coalesce(max(n.orderNum), 0) FROM PostitNote n WHERE n.board.id = :boardId")
    Integer getMaxOrderForByBoardId(@Param("boardId") Long boardId);

    Iterable<PostitNote> findByBoardIdOrderByOrderNum(Long boardId);

}
