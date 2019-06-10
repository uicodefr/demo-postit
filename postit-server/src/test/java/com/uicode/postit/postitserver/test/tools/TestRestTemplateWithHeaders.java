package com.uicode.postit.postitserver.test.tools;

import org.assertj.core.api.Assertions;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestClientException;

import com.uicode.postit.postitserver.dto.user.UserDto;

public class TestRestTemplateWithHeaders {

    private static final String LOGIN_URL = "/login";
    private static final String USERNAME_PARAM = "username";
    private static final String PASSWORD_PARAM = "password";

    private TestRestTemplate testRestTemplate;

    private HttpHeaders headers;

    public TestRestTemplateWithHeaders(TestRestTemplate testRestTemplate, HttpHeaders headers) {
        this.testRestTemplate = testRestTemplate;
        this.headers = headers;
    }

    public <T> T getForObject(String url, Class<T> responseType, Object... urlVariables) {
        return testRestTemplate
                .exchange(url, HttpMethod.GET, new HttpEntity<>(null, headers), responseType, urlVariables).getBody();
    }

    public <T> T postForObject(String url, Object request, Class<T> responseType, Object... urlVariables)
            throws RestClientException {
        return testRestTemplate
                .exchange(url, HttpMethod.POST, new HttpEntity<>(request, headers), responseType, urlVariables)
                .getBody();
    }

    public <T> T patchForObject(String url, Object request, Class<T> responseType, Object... urlVariables)
            throws RestClientException {
        return testRestTemplate
                .exchange(url, HttpMethod.PATCH, new HttpEntity<>(request, headers), responseType, urlVariables)
                .getBody();
    }

    public void delete(String url, Object... urlVariables) throws RestClientException {
        testRestTemplate.exchange(url, HttpMethod.DELETE, new HttpEntity<>(null, headers), String.class, urlVariables);
    }

    public static TestRestTemplateWithHeaders login(TestRestTemplate restTemplate, String username, String password) {
        HttpHeaders loginHeaders = new HttpHeaders();
        loginHeaders.setContentType(MediaType.MULTIPART_FORM_DATA);

        LinkedMultiValueMap<String, String> loginForms = new LinkedMultiValueMap<>();
        loginForms.add(USERNAME_PARAM, username);
        loginForms.add(PASSWORD_PARAM, password);

        ResponseEntity<UserDto> responseLogin = restTemplate.postForEntity(LOGIN_URL,
                new HttpEntity<>(loginForms, loginHeaders), UserDto.class);
        Assertions.assertThat(responseLogin.getStatusCodeValue()).isEqualTo(200);
        String sessionCookie = responseLogin.getHeaders().getFirst(HttpHeaders.SET_COOKIE);
        Assertions.assertThat(sessionCookie).isNotNull();

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.COOKIE, sessionCookie);
        return new TestRestTemplateWithHeaders(restTemplate, headers);
    }

}
