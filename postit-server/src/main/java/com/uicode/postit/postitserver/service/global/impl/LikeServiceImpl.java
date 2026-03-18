package com.uicode.postit.postitserver.service.global.impl;

import java.util.Date;
import java.util.Optional;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.uicode.postit.postitserver.dao.global.LikeDao;
import com.uicode.postit.postitserver.dto.IdEntityDto;
import com.uicode.postit.postitserver.dto.global.CountLikesDto;
import com.uicode.postit.postitserver.entity.global.Like;
import com.uicode.postit.postitserver.service.global.GlobalService;
import com.uicode.postit.postitserver.service.global.LikeService;
import com.uicode.postit.postitserver.util.parameter.ParameterConst;
import com.uicode.postit.postitserver.util.parameter.ParameterUtil;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class LikeServiceImpl implements LikeService {

    private static final String WS_LIKE_PATH = "/listen/likes:count";

    private final GlobalService globalService;
    private final LikeDao likeDao;
    private final SimpMessagingTemplate simpMessagingTemplate;


    @Override
    public CountLikesDto countLikes() {
        CountLikesDto countLikesDto = new CountLikesDto();
        countLikesDto.setCount(likeDao.count());
        log.info("CountLikes return the value : {}", countLikesDto.getCount());
        return countLikesDto;
    }

    @Override
    public IdEntityDto addLike(String clientIp) {
        IdEntityDto result = new IdEntityDto();

        Optional<String> maxLikeParameter = globalService.getParameterValue(ParameterConst.LIKE_MAX);
        Long maxLike = ParameterUtil.getLong(maxLikeParameter, 0l);

        if (countLikes().getCount() > maxLike) {
            log.warn("AddLike : the maximum of likes is reached");
            return result;
        }

        Like like = new Like();
        like.setClientIp(clientIp);
        like.setInsertDate(new Date());
        like = likeDao.save(like);

        result.setId(like.getId());

        // Send Result to WebSocket
        simpMessagingTemplate.convertAndSend(WS_LIKE_PATH, countLikes());
        log.info("AddLike successful");
        return result;
    }

}
