package com.uicode.postit.postitserver.util;

import java.io.IOException;
import java.net.HttpCookie;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.apache.commons.collections.CollectionUtils;
import org.assertj.core.api.Assertions;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.util.LinkedMultiValueMap;

import com.uicode.postit.postitserver.dto.global.GlobalStatusDto;
import com.uicode.postit.postitserver.dto.global.UserDto;

public class AppTestRequestInterceptor implements ClientHttpRequestInterceptor {

    private static final String LOGIN_URL = "/login";
    private static final String USERNAME_PARAM = "username";
    private static final String PASSWORD_PARAM = "password";
    private static final String XSRF_COOKIE_NAME = "XSRF-TOKEN";
    private static final String XSRF_HEADER_NAME = "X-XSRF-TOKEN";
    private static final List<HttpMethod> METHOD_WITHOUT_CSRF = Arrays.asList(HttpMethod.GET, HttpMethod.OPTIONS,
            HttpMethod.HEAD);

    private final TestRestTemplate testRestTemplate;
    private final Map<String, HttpCookie> cookies = new HashMap<>();
    private String csrfValue = null;

    private AppTestRequestInterceptor(TestRestTemplate testRestTemplate) {
        this.testRestTemplate = testRestTemplate;
    }

    public static AppTestRequestInterceptor addInterceptor(TestRestTemplate testRestTemplate) {
        AppTestRequestInterceptor appTestRequestInterceptor = new AppTestRequestInterceptor(testRestTemplate);
        testRestTemplate.getRestTemplate().setInterceptors(Collections.singletonList(appTestRequestInterceptor));
        return appTestRequestInterceptor;
    }

    @Override
    public ClientHttpResponse intercept(HttpRequest request, byte[] body, ClientHttpRequestExecution execution)
            throws IOException {

        String cookiesString = convertCookiesToString(cookies.values());
        if (cookiesString != null) {
            request.getHeaders().add(HttpHeaders.COOKIE, cookiesString);
        }
        if (csrfValue != null && !METHOD_WITHOUT_CSRF.contains(request.getMethod())) {
            request.getHeaders().add(XSRF_HEADER_NAME, csrfValue);
        }

        ClientHttpResponse response = execution.execute(request, body);

        List<String> newCookies = response.getHeaders().get(HttpHeaders.SET_COOKIE);
        if (CollectionUtils.isNotEmpty(newCookies)) {
            // Add the new cookies to the list
            newCookies.stream()
                .map(HttpCookie::parse)
                .flatMap(List::stream)
                .filter(Objects::nonNull)
                .forEach(httpCookie -> {
                    cookies.put(httpCookie.getName(), httpCookie);
                });

            // Handle csrf Cookie
            cookies.values()
                .stream()
                .filter(httpCookie -> XSRF_COOKIE_NAME.equals(httpCookie.getName()))
                .findFirst()
                .ifPresent(csrfCookie -> csrfValue = csrfCookie.getValue());
        }

        return response;
    }

    private static String convertCookiesToString(Collection<HttpCookie> cookies) {
        if (CollectionUtils.isNotEmpty(cookies)) {
            StringBuilder cookieStringBuilder = new StringBuilder();
            for (HttpCookie cookie : cookies) {
                cookie.toString();
                cookieStringBuilder.append(cookie.getName()).append("=").append(cookie.getValue()).append(";");
            }
            return cookieStringBuilder.toString();
        }
        return null;
    }

    public void simpleGetForCsrf() {
        testRestTemplate.getForObject("/global/status", GlobalStatusDto.class);
    }

    public void login(String username, String password) {
        HttpHeaders loginHeaders = new HttpHeaders();
        loginHeaders.setContentType(MediaType.MULTIPART_FORM_DATA);

        LinkedMultiValueMap<String, String> loginForms = new LinkedMultiValueMap<>();
        loginForms.add(USERNAME_PARAM, username);
        loginForms.add(PASSWORD_PARAM, password);

        ResponseEntity<UserDto> responseLogin = testRestTemplate.postForEntity(LOGIN_URL,
                new HttpEntity<>(loginForms, loginHeaders), UserDto.class);
        Assertions.assertThat(responseLogin.getStatusCodeValue()).isEqualTo(200);
    }

    public void cleanCookies() {
        this.cookies.clear();
    }

    public void clear() {
        testRestTemplate.getRestTemplate().setInterceptors(Collections.emptyList());
    }

}
