package com.uicode.postit.postitserver.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
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

    @GetMapping("/status")
    public GlobalStatusDto getStatus() {
        return globalService.getStatus();
    }

    @GetMapping("/parameters/{name}")
    public String getParameterValue(@PathVariable("name") String parameterName)
            throws NotFoundException, ForbiddenException {
        return globalService.getParameterValueForClient(parameterName);
    }

    @PostMapping(":clearCache")
    public void clearCache() {
        globalService.clearCache();
    }

    @GetMapping("/likes:count")
    public CountLikesDto countLikes() {
        return globalService.countLikes();
    }

    @PostMapping("/likes")
    public IdEntityDto addLike(HttpServletRequest request) {
        String clientIp = null;
        if (request != null) {
            clientIp = request.getRemoteAddr();
        }
        return globalService.addLike(clientIp);
    }

    @MessageMapping("/likes")
    @SendTo("/listen/likes")
    public IdEntityDto wsAddLike() {
        return globalService.addLike("websocket");
    }

}
