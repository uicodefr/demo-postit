package com.uicode.postit.postitserver.test.controller.global;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.messaging.converter.JacksonJsonMessageConverter;
import org.springframework.messaging.simp.stomp.StompFrameHandler;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.test.web.servlet.client.MockMvcWebTestClient;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import org.springframework.web.socket.sockjs.client.SockJsClient;
import org.springframework.web.socket.sockjs.client.Transport;
import org.springframework.web.socket.sockjs.client.WebSocketTransport;

import com.uicode.postit.postitserver.dao.global.LikeDao;
import com.uicode.postit.postitserver.dto.IdEntityDto;
import com.uicode.postit.postitserver.dto.global.CountLikesDto;
import com.uicode.postit.postitserver.test.config.TestContainersConfig;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Import(TestContainersConfig.class)
@ActiveProfiles("integration-test")
class GlobalControllerTest {

    @Autowired
    private WebApplicationContext wac;

    private WebTestClient webTestClient;


    @Value("${local.server.port}")
    private int port;


    @Autowired
    private LikeDao likeDao;


    @BeforeEach
    void setUp() {
        webTestClient = MockMvcWebTestClient.bindToApplicationContext(this.wac).build();
    }

    @Test
    void getStatus() {
        webTestClient.get().uri("/global/status")
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.status").isEqualTo("true")
            .jsonPath("$.upDate").exists()
            .jsonPath("$.currentDate").exists()
            .jsonPath("$.version").isNotEmpty();
    }

    @Test
    void getParameterValue() {
        webTestClient.get()
            .uri("/global/parameters/note.max")
            .exchange()
            .expectStatus().isOk()
            .expectBody(String.class)
            .value(noteMax -> { assertThat(noteMax).matches("\\d+"); });

        webTestClient.get()
            .uri("/global/parameters/like.max")
            .exchange()
            .expectStatus().isForbidden()
            .expectBody()
            .jsonPath("$.status").isEqualTo(403);

        webTestClient.get()
            .uri("/global/parameters/toto")
            .exchange()
            .expectStatus().isNotFound()
            .expectBody()
            .jsonPath("$.status").isEqualTo(404);
    }

    @Test
    void clearCache() {
        webTestClient.post()
            .uri("/global/:clearCache")
            .exchange()
            .expectStatus().isOk();
    }

    @Test
    void countLikes() {
        webTestClient.get()
            .uri("/global/likes:count")
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.count").isNumber();
    }

    @Test
    void addLike() {
        IdEntityDto idEntityDto = webTestClient.post()
                .uri("/global/likes")
                .bodyValue("")
                .exchange()
                .expectStatus().isOk()
                .expectBody(IdEntityDto.class)
                .value(dto -> {
                    Assertions.assertThat(dto).isNotNull();
                    Assertions.assertThat(dto.getId()).isNotNull();
                })
                .returnResult()
                .getResponseBody();

        likeDao.deleteById(idEntityDto.getId());
    }

    @Test
    void likeWebSocket() throws InterruptedException, ExecutionException, TimeoutException {
        List<Transport> transports = new ArrayList<>();
        transports.add(new WebSocketTransport(new StandardWebSocketClient()));
        WebSocketStompClient stompClient = new WebSocketStompClient(new SockJsClient(transports));
        stompClient.setMessageConverter(new JacksonJsonMessageConverter());

        String wsUrl = "ws://localhost:" + port + "/websocket";
        StompSession stompSession = stompClient.connectAsync(wsUrl, new StompSessionHandlerAdapter() {
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
