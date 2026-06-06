package com.nakshtr.hams.security;

import com.nakshtr.hams.entity.User;
import com.nakshtr.hams.repository.UserRepository;
import com.nakshtr.hams.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtFilter(
            JwtService jwtService,
            UserRepository userRepository
    ) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null &&
                header.startsWith("Bearer ")) {

            String token = header.substring(7);

            if (!jwtService.isTokenValid(token)) {

                response.setStatus(
                        HttpServletResponse.SC_UNAUTHORIZED
                );

                return;
            }

            String email =
                    jwtService.extractEmail(token);

            User user = userRepository
                    .findByEmail(email)
                    .orElse(null);

            if (user != null) {

                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                user.getEmail(),
                                null,
                                List.of(
                                        new SimpleGrantedAuthority(
                                                "ROLE_" + user.getRole()
                                        )
                                )
                        );

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(auth);
            }
        }

        filterChain.doFilter(request, response);
    }
}