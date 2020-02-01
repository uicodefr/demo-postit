package com.uicode.postit.postitserver.dao.global;

import org.springframework.data.repository.CrudRepository;

import com.uicode.postit.postitserver.entity.global.Parameter;

public interface ParameterDao extends CrudRepository<Parameter, String> {

}
