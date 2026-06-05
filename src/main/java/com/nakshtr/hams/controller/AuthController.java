package com.nakshtr.hams.controller;

import com.nakshtr.hams.dto.LoginRequest;
import com.nakshtr.hams.service.AuthService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public Map<String, String> login(
            @RequestBody LoginRequest request
    ) {

        String token = authService.login(
                request.getEmail(),
                request.getPassword()
        );

        return Map.of(
                "token",
                token
        );
    }
}