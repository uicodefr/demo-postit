package com.uicode.postit.postitserver.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;

import com.uicode.postit.postitserver.config.security.CsrfCookieFilter;
import com.uicode.postit.postitserver.config.security.RestAuthenticationEntryPoint;
import com.uicode.postit.postitserver.config.security.RestAuthenticationFailureHandler;
import com.uicode.postit.postitserver.config.security.RestAuthenticationSuccessHandler;
import com.uicode.postit.postitserver.service.global.UserService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true)
@RequiredArgsConstructor
public class WebSecurityConfig {

    public enum Role {
        ROLE_BOARD_WRITE, ROLE_USER_WRITE;
    }

    private static final String LOGIN_URL = "/login";
    private static final String LOGOUT_URL = "/logout";

    private final UserService userService;
    private final RestAuthenticationEntryPoint authenticationEntryPoint;
    private final RestAuthenticationSuccessHandler successHandler;
    private final RestAuthenticationFailureHandler failureHandler;

    @Bean
    DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userService);
        authProvider.setPasswordEncoder(new BCryptPasswordEncoder());
        return authProvider;
    }

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) {
        http.csrf(csrf ->
            csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler())
            )
            .addFilterBefore(new CsrfCookieFilter(), UsernamePasswordAuthenticationFilter.class)
            .formLogin(form -> form
                    .loginPage(LOGIN_URL)
                    .successHandler(successHandler)
                    .failureHandler(failureHandler))
            .logout(logout -> logout
                    .logoutUrl(LOGOUT_URL)
                    .logoutSuccessHandler(
                            (request, response, authentication) -> response.setStatus(HttpServletResponse.SC_OK)))
            .exceptionHandling(ex -> ex
                    .authenticationEntryPoint(authenticationEntryPoint));
                /* Now all is authorize, except controller who use @Secured
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/global/status").permitAll()
                        .anyRequest().authenticated());*/

        return http.build();
    }

}
