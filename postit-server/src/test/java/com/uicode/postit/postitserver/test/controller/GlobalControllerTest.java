package com.uicode.postit.postitserver.test.controller;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.simp.stomp.StompFrameHandler;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import org.springframework.web.socket.sockjs.client.SockJsClient;
import org.springframework.web.socket.sockjs.client.Transport;
import org.springframework.web.socket.sockjs.client.WebSocketTransport;

import com.google.common.primitives.Ints;
import com.uicode.postit.postitserver.dao.global.ILikeDao;
import com.uicode.postit.postitserver.dto.IdEntityDto;
import com.uicode.postit.postitserver.dto.global.CountLikesDto;
import com.uicode.postit.postitserver.dto.global.ErrorDto;
import com.uicode.postit.postitserver.dto.global.GlobalStatusDto;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@AutoConfigureTestDatabase
public class GlobalControllerTest {

    @Value("${local.server.port}")
    private int port;

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
        restTemplate.getForObject("/global:clearCache", String.class);
    }

    @Test
    public void countLikes() {
        CountLikesDto countLikesDto = restTemplate.getForObject("/global/likes:count", CountLikesDto.class);
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

    @Test
    public void likeWebSocket() throws InterruptedException, ExecutionException, TimeoutException {
        List<Transport> transports = new ArrayList<>();
        transports.add(new WebSocketTransport(new StandardWebSocketClient()));
        WebSocketStompClient stompClient = new WebSocketStompClient(new SockJsClient(transports));
        stompClient.setMessageConverter(new MappingJackson2MessageConverter());

        String wsUrl = "ws://localhost:" + port + "/websocket";
        StompSession stompSession = stompClient.connect(wsUrl, new StompSessionHandlerAdapter() {
        }).get(1, TimeUnit.SECONDS);

        final CompletableFuture<CountLikesDto> countLikesFuture = new CompletableFuture<>();
        stompSession.subscribe("/listen/likes:count", new StompFrameHandler() {
            @Override
            public void handleFrame(StompHeaders headers, Object payload) {
                countLikesFuture.complete((CountLikesDto) payload);
            }

            @Override
            public Type getPayloadType(StompHeaders headers) {
                return CountLikesDto.class;
            }
        });

        final CompletableFuture<IdEntityDto> addLikeFuture = new CompletableFuture<>();
        stompSession.subscribe("/listen/likes", new StompFrameHandler() {
            @Override
            public void handleFrame(StompHeaders headers, Object payload) {
                addLikeFuture.complete((IdEntityDto) payload);
            }

            @Override
            public Type getPayloadType(StompHeaders headers) {
                return IdEntityDto.class;
            }
        });

        stompSession.send("/send/likes", "");

        CountLikesDto countLikesDto = countLikesFuture.get(5, TimeUnit.SECONDS);
        Assertions.assertThat(countLikesDto).isNotNull();
        Assertions.assertThat(countLikesDto.getCount()).isNotNull();

        IdEntityDto idEntityDto = addLikeFuture.get(5, TimeUnit.SECONDS);
        Assertions.assertThat(idEntityDto).isNotNull();
        Assertions.assertThat(idEntityDto.getId()).isNotNull();
    }

}
