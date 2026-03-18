package com.uicode.postit.postitserver.service.global.impl;

import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.uicode.postit.postitserver.dao.global.ParameterDao;
import com.uicode.postit.postitserver.dto.global.GlobalStatusDto;
import com.uicode.postit.postitserver.entity.global.Parameter;
import com.uicode.postit.postitserver.exception.functionnal.ForbiddenException;
import com.uicode.postit.postitserver.exception.functionnal.NotFoundException;
import com.uicode.postit.postitserver.service.global.GlobalService;
import com.uicode.postit.postitserver.util.parameter.ParameterConst;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class GlobalServiceImpl implements GlobalService {

    private static final Date UPDATE = new Date();

    private final CacheManager cacheManager;
    private final ParameterDao parameterDao;


    @Value("${info.app.version:}")
    private String infoAppVersion;

    @Override
    public GlobalStatusDto getStatus() {
        GlobalStatusDto status = new GlobalStatusDto();
        status.setUpDate(UPDATE);
        status.setCurrentDate(new Date());
        status.setVersion(infoAppVersion);

        // We don't use the method getParameterValue to avoid using cache
        // (we test the database access)
        Optional<Parameter> parameterStatusOpt = parameterDao.findById(ParameterConst.GENERAL_STATUS);
        parameterStatusOpt.map(Parameter::getValue).ifPresent(status::setStatus);

        log.info("Global Status asked");
        return status;
    }

    @Override
    public void clearCache() {
        for (String name : cacheManager.getCacheNames()) {
            cacheManager.getCache(name).clear();
        }
        log.warn("Cache cleared");
    }

    @Override
    @Cacheable("parameter")
    public Optional<String> getParameterValue(String parameterName) {
        Optional<Parameter> parameter = parameterDao.findById(parameterName);
        log.info("Get ParameterValue for : {}", parameterName);
        return parameter.map(Parameter::getValue);
    }

    @Override
    @Cacheable("parameter_forclient")
    public String getParameterValueForClient(String parameterName) throws NotFoundException, ForbiddenException {
        Optional<Parameter> parameterOpt = parameterDao.findById(parameterName);
        Parameter parameter = parameterOpt.orElseThrow(() -> new NotFoundException("Parameter"));
        if (Boolean.FALSE.equals(parameter.getClientView())) {
            throw new ForbiddenException("parameter.getClientView == false");
        }
        return parameter.getValue();
    }

}
