package com.uicode.postit.postitserver.dao.global;

import java.util.Optional;

import org.springframework.data.domain.Sort;
import org.springframework.data.repository.CrudRepository;

import com.uicode.postit.postitserver.entity.global.UserAuthority;

public interface UserAuthorityDao extends CrudRepository<UserAuthority, Long> {

    Iterable<UserAuthority> findAll(Sort sort);

    Optional<UserAuthority> findByAuthority(String authority);

}
