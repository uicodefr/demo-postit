package com.uicode.postit.postitserver.dao.global;

import org.springframework.data.repository.CrudRepository;

import com.uicode.postit.postitserver.entity.global.Like;

public interface ILikeDao extends CrudRepository<Like, Long> {

}
