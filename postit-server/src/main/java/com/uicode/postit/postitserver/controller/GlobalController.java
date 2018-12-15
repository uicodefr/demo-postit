package com.uicode.postit.postitserver.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.uicode.postit.postitserver.dto.IdEntityDto;
import com.uicode.postit.postitserver.dto.global.CountLikesDto;
import com.uicode.postit.postitserver.dto.global.GlobalStatusDto;
import com.uicode.postit.postitserver.service.IGlobalService;
import com.uicode.postit.postitserver.utils.exception.ForbiddenException;
import com.uicode.postit.postitserver.utils.exception.NotFoundException;

@RestController
@RequestMapping("/global")
public class GlobalController {

    @Autowired
    private IGlobalService globalService;

    @RequestMapping(value = "/status", method = RequestMethod.GET)
    public GlobalStatusDto getStatus() {
        return globalService.getStatus();
    }

    @RequestMapping(value = "/parameters/{name}", method = RequestMethod.GET)
    public String getParameterValue(@PathVariable("name") String parameterName)
            throws NotFoundException, ForbiddenException {
        return globalService.getParameterValueForClient(parameterName);
    }

    @RequestMapping(value = "/clearCache", method = RequestMethod.POST)
    public void clearCache() {
        globalService.clearCache();
    }

    @RequestMapping(value = "/likes/count", method = RequestMethod.GET)
    public CountLikesDto countLikes() {
        return globalService.countLikes();
    }

    @RequestMapping(value = "/likes", method = RequestMethod.POST)
    public IdEntityDto addLike(HttpServletRequest request) {
        String clientIp = null;
        if (request != null) {
            clientIp = request.getRemoteAddr();
        }
        return globalService.addLike(clientIp);
    }

}
