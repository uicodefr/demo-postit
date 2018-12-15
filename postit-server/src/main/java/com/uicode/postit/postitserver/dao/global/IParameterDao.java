package com.uicode.postit.postitserver.dao.global;

import org.springframework.data.repository.CrudRepository;

import com.uicode.postit.postitserver.entity.global.Parameter;

public interface IParameterDao extends CrudRepository<Parameter, String> {

}
