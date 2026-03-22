package com.uicode.postit.postitserver.test.config.user;

import java.util.Arrays;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithSecurityContextFactory;

import com.uicode.postit.postitserver.entity.global.User;
import com.uicode.postit.postitserver.entity.global.UserAuthority;

public class WithMockCustomUserSecurityContextFactory implements WithSecurityContextFactory<WithMockCustomUser> {

    @Override
    public SecurityContext createSecurityContext(WithMockCustomUser annotation) {
        SecurityContext context = SecurityContextHolder.createEmptyContext();

        User principal = new User();
        principal.setUsername(annotation.username());
        principal.setId(annotation.id());
        principal.setAuthorityList(Arrays.stream(annotation.roles()).map(role -> {
            UserAuthority userAuthority = new UserAuthority();
            userAuthority.setAuthority(role);
            return userAuthority;
        }).toList());

        Authentication auth = new UsernamePasswordAuthenticationToken(principal, "password",
            Arrays.stream(annotation.roles()).map(SimpleGrantedAuthority::new).toList()
        );

        context.setAuthentication(auth);
        return context;
    }

}
