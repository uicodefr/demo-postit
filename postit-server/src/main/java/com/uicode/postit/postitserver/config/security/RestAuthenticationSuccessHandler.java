package com.uicode.postit.postitserver.config.security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.uicode.postit.postitserver.entity.user.User;
import com.uicode.postit.postitserver.mapper.user.UserMapper;

@Component
public class RestAuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private static final String APPLICATION_JSON = "application/json";

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
        clearAuthenticationAttributes(request);

        response.setContentType(APPLICATION_JSON);
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.writeValue(response.getOutputStream(),
                UserMapper.INSTANCE.toDto((User) authentication.getPrincipal()));
    }

}
