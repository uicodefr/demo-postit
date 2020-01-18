package com.uicode.postit.postitserver.service.impl;

import java.util.Date;
import java.util.Optional;

import javax.transaction.Transactional;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.uicode.postit.postitserver.dao.global.ILikeDao;
import com.uicode.postit.postitserver.dao.global.IParameterDao;
import com.uicode.postit.postitserver.dto.IdEntityDto;
import com.uicode.postit.postitserver.dto.global.CountLikesDto;
import com.uicode.postit.postitserver.dto.global.GlobalStatusDto;
import com.uicode.postit.postitserver.entity.global.Like;
import com.uicode.postit.postitserver.entity.global.Parameter;
import com.uicode.postit.postitserver.exception.ForbiddenException;
import com.uicode.postit.postitserver.exception.NotFoundException;
import com.uicode.postit.postitserver.service.IGlobalService;
import com.uicode.postit.postitserver.util.parameter.ParameterConst;
import com.uicode.postit.postitserver.util.parameter.ParameterUtil;

@Service
@Transactional
public class GlobalServiceImpl implements IGlobalService {

    private static final Logger LOGGER = LogManager.getLogger(GlobalServiceImpl.class);

    private static final String VERSION = "0.4.6-SNAPSHOT";
    private static final Date UPDATE = new Date();
    private static final String WS_LIKE_PATH = "/listen/likes:count";

    @Autowired
    private CacheManager cacheManager;

    @Autowired
    private IParameterDao parameterDao;

    @Autowired
    private ILikeDao likeDao;

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Override
    public GlobalStatusDto getStatus() {
        GlobalStatusDto status = new GlobalStatusDto();
        status.setUpDate(UPDATE);
        status.setCurrentDate(new Date());
        status.setVersion(VERSION);

        // We don't use the method getParameterValue to avoid using cache
        // (we test the database access)
        Optional<Parameter> parameterStatusOpt = parameterDao.findById(ParameterConst.GENERAL_STATUS);
        parameterStatusOpt.map(Parameter::getValue).ifPresent(status::setStatus);

        return status;
    }

    @Override
    public void clearCache() {
        for (String name : cacheManager.getCacheNames()) {
            cacheManager.getCache(name).clear();
        }
        LOGGER.warn("Cache cleared");
    }

    @Override
    @Cacheable("parameter")
    public Optional<String> getParameterValue(String parameterName) {
        Optional<Parameter> parameter = parameterDao.findById(parameterName);
        return parameter.map(Parameter::getValue);
    }

    @Override
    @Cacheable("parameter_forclient")
    public String getParameterValueForClient(String parameterName) throws NotFoundException, ForbiddenException {
        Optional<Parameter> parameterOpt = parameterDao.findById(parameterName);
        Parameter parameter = parameterOpt.orElseThrow(() -> new NotFoundException("Parameter"));
        if (!parameter.getClientView()) {
            throw new ForbiddenException("parameter.getClientView == false");
        }
        return parameter.getValue();
    }

    @Override
    public CountLikesDto countLikes() {
        CountLikesDto countLikesDto = new CountLikesDto();
        countLikesDto.setCount(likeDao.count());
        return countLikesDto;
    }

    @Override
    public IdEntityDto addLike(String clientIp) {
        IdEntityDto result = new IdEntityDto();

        Optional<String> maxLikeParameter = getParameterValue(ParameterConst.LIKE_MAX);
        Long maxLike = ParameterUtil.getLong(maxLikeParameter, 0l);

        if (countLikes().getCount() > maxLike) {
            return result;
        }

        Like like = new Like();
        like.setClientIp(clientIp);
        like.setInsertDate(new Date());
        like = likeDao.save(like);

        result.setId(like.getId());

        // Send Result to WebSocket
        simpMessagingTemplate.convertAndSend(WS_LIKE_PATH, countLikes());

        return result;
    }

}
