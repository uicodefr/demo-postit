package com.uicode.postit.postitserver.dao.user;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.uicode.postit.postitserver.entity.user.UserAuthority;

public interface IUserAuthorityDao extends CrudRepository<UserAuthority, Long> {

    Optional<UserAuthority> findByAuthority(String authority);

}
