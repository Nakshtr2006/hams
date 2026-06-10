package com.nakshtr.hams.config;

import com.nakshtr.hams.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth

                        // Public
                        .requestMatchers(
                                "/auth/**",
                                "/login.html",
                                "/signup.html",
                                "/dashboard.html",
                                "/products.html",
                                "/users.html",
                                "/auditlogs.html",
                                "/dashboard/stats",
                                "/css/**",
                                "/js/**"
                        ).permitAll()

                        // Product View
                        .requestMatchers(
                                HttpMethod.GET,
                                "/products/**"
                        ).authenticated()

                        // Product Create / Update / Delete
                        .requestMatchers(
                                HttpMethod.POST,
                                "/products"
                        ).hasAnyRole(
                                "ROOT",
                                "ADMIN"
                        )

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/products/**"
                        ).hasAnyRole(
                                "ROOT",
                                "ADMIN"
                        )

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/products/**"
                        ).hasAnyRole(
                                "ROOT",
                                "ADMIN"
                        )

                        // Users View
                        .requestMatchers(
                                HttpMethod.GET,
                                "/users/**"
                        ).hasAnyRole(
                                "ROOT",
                                "ADMIN",
                                "MANAGER",
                                "EMPLOYEE"
                        )

                        // User Create
                        .requestMatchers(
                                HttpMethod.POST,
                                "/users"
                        ).hasRole("ROOT")

                        // User Update
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/users/**"
                        ).hasAnyRole(
                                "ROOT",
                                "ADMIN",
                                "MANAGER"
                        )

                        // User Delete
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/users/**"
                        ).hasRole("ROOT")

                        // Audit Logs
                        .requestMatchers(
                                "/audit-logs/**"
                        ).hasRole("ROOT")

                        .anyRequest()
                        .authenticated()
                )

                .httpBasic(
                        httpBasic ->
                                httpBasic.disable()
                );

        http.addFilterBefore(
                jwtFilter,
                UsernamePasswordAuthenticationFilter.class
        );

        return http.build();
    }
}