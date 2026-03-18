package com.uicode.postit.postitserver.service.global;

import com.uicode.postit.postitserver.dto.IdEntityDto;
import com.uicode.postit.postitserver.dto.global.CountLikesDto;

public interface LikeService {

    CountLikesDto countLikes();

    IdEntityDto addLike(String clientIp);

}
