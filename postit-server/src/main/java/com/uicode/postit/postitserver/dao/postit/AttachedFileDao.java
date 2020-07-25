package com.uicode.postit.postitserver.dao.postit;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;

import com.uicode.postit.postitserver.entity.postit.AttachedFile;

public interface AttachedFileDao extends CrudRepository<AttachedFile, Long> {

    Page<AttachedFile> findAll(Pageable pageable);

}
