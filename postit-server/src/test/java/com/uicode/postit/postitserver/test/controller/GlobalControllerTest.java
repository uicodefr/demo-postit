package com.uicode.postit.postitserver.test.controller;

import org.assertj.core.api.Assertions;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.test.context.junit4.SpringRunner;

import com.google.common.primitives.Ints;
import com.uicode.postit.postitserver.dao.global.ILikeDao;
import com.uicode.postit.postitserver.dto.IdEntityDto;
import com.uicode.postit.postitserver.dto.global.CountLikesDto;
import com.uicode.postit.postitserver.dto.global.ErrorDto;
import com.uicode.postit.postitserver.dto.global.GlobalStatusDto;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
public class GlobalControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private ILikeDao likeDao;

    @Test
    public void getStatus() {
        GlobalStatusDto statusDto = restTemplate.getForObject("/global/status", GlobalStatusDto.class);
        Assertions.assertThat(statusDto).isNotNull();
        Assertions.assertThat(statusDto.getStatus()).isEqualTo(Boolean.TRUE.toString());
        Assertions.assertThat(statusDto.getUpDate()).isNotNull();
        Assertions.assertThat(statusDto.getCurrentDate()).isNotNull();
        Assertions.assertThat(statusDto.getVersion()).isNotEmpty();
    }

    @Test
    public void getParameterValue() {
        String noteMax = restTemplate.getForObject("/global/parameters/note.max", String.class);
        Assertions.assertThat(Ints.tryParse(noteMax)).isNotNull();

        ErrorDto error = restTemplate.getForObject("/global/parameters/like.max", ErrorDto.class);
        Assertions.assertThat(error).isNotNull();
        Assertions.assertThat(error.getStatus()).isEqualTo("403");

        error = restTemplate.getForObject("/global/parameters/toto", ErrorDto.class);
        Assertions.assertThat(error).isNotNull();
        Assertions.assertThat(error.getStatus()).isEqualTo("404");
    }

    @Test
    public void clearCache() {
        restTemplate.getForObject("/global/clearCache", String.class);
    }

    @Test
    public void countLikes() {
        CountLikesDto countLikesDto = restTemplate.getForObject("/global/likes/count", CountLikesDto.class);
        Assertions.assertThat(countLikesDto).isNotNull();
        Assertions.assertThat(countLikesDto.getCount()).isNotNull();
    }

    @Test
    public void addLike() {
        IdEntityDto idEntityDto = restTemplate.postForObject("/global/likes", "", IdEntityDto.class);
        Assertions.assertThat(idEntityDto).isNotNull();
        Assertions.assertThat(idEntityDto.getId()).isNotNull();
        likeDao.deleteById(idEntityDto.getId());
    }

}
