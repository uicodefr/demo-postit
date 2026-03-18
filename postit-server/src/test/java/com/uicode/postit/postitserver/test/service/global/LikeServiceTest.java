package com.uicode.postit.postitserver.test.service.global;

import java.util.Optional;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import com.uicode.postit.postitserver.dto.IdEntityDto;
import com.uicode.postit.postitserver.dto.global.CountLikesDto;
import com.uicode.postit.postitserver.service.global.GlobalService;
import com.uicode.postit.postitserver.service.global.LikeService;
import com.uicode.postit.postitserver.util.parameter.ParameterConst;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
@ActiveProfiles("service-test")
class LikeServiceTest {

    @MockitoBean
    private GlobalService globalService;

    @Autowired
    private LikeService likeService;

    @Test
    void addMaxLike() {
        CountLikesDto countLikesDto = likeService.countLikes();

        Mockito.when(globalService.getParameterValue(ParameterConst.LIKE_MAX))
            .thenReturn(Optional.of(countLikesDto.getCount().toString()));

        IdEntityDto likeDto = likeService.addLike("testAddMaxLike");
        Assertions.assertThat(likeDto.getId()).isNotNull();
        likeDto = likeService.addLike("testAddMaxLike");
        Assertions.assertThat(likeDto.getId()).isNull();
    }

}
