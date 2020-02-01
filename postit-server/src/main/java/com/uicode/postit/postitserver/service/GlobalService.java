package com.uicode.postit.postitserver.service;

import java.util.Optional;

import com.uicode.postit.postitserver.dto.IdEntityDto;
import com.uicode.postit.postitserver.dto.global.CountLikesDto;
import com.uicode.postit.postitserver.dto.global.GlobalStatusDto;
import com.uicode.postit.postitserver.exception.ForbiddenException;
import com.uicode.postit.postitserver.exception.NotFoundException;

public interface GlobalService {

    GlobalStatusDto getStatus();

    void clearCache();

    Optional<String> getParameterValue(String parameterName);

    String getParameterValueForClient(String parameterName) throws NotFoundException, ForbiddenException;

    CountLikesDto countLikes();

    IdEntityDto addLike(String clientIp);

}
