package com.uicode.postit.postitserver.dao.global;

import java.util.Optional;

import org.springframework.data.domain.Sort;
import org.springframework.data.repository.CrudRepository;

import com.uicode.postit.postitserver.entity.global.User;

public interface UserDao extends CrudRepository<User, Long> {

    Iterable<User> findAll(Sort sort);

    Optional<User> findByUsername(String username);

}
