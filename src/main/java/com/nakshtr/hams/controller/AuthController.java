package com.nakshtr.hams.controller;

import com.nakshtr.hams.dto.LoginRequest;
import com.nakshtr.hams.dto.LoginResponse;
import com.nakshtr.hams.dto.SignupRequest;
import com.nakshtr.hams.entity.User;
import com.nakshtr.hams.service.AuthService;
import com.nakshtr.hams.service.JwtService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    public AuthController(
            AuthService authService,
            JwtService jwtService
    ) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest request
    ) {

        User user =
                authService.login(
                        request.getEmail(),
                        request.getPassword()
                );

        String token =
                jwtService.generateToken(
                        user.getEmail()
                );

        return new LoginResponse(
                token,
                user.getEmail(),
                user.getName(),
                user.getRole().name()
        );
    }

    @PostMapping("/signup")
    public User signup(
            @jakarta.validation.Valid
            @RequestBody SignupRequest request
    ) {

        return authService.signup(
                request
        );
    }
}