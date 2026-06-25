package com.nakshtr.hams.controller;

import com.nakshtr.hams.dto.LoginRequest;
import com.nakshtr.hams.dto.LoginResponse;
import com.nakshtr.hams.dto.SignupRequest;
import com.nakshtr.hams.entity.User;
import com.nakshtr.hams.service.AuthService;
import com.nakshtr.hams.service.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request
    ) {

        System.out.println(
                "Login request: "
                        + request.getEmail()
                        + " / "
                        + request.getPassword()
        );

        User user = authService.login(
                request.getEmail(),
                request.getPassword()
        );

        String token =
                jwtService.generateToken(
                        user.getEmail()
                );

        return ResponseEntity.ok(

                new LoginResponse(
                        token,
                        user.getEmail(),
                        user.getName(),
                        user.getRole().name()
                )
        );
    }

    @PostMapping("/signup")
    public ResponseEntity<User> signup(

            @Valid
            @RequestBody SignupRequest request
    ) {

        User user =
                authService.signup(request);

        return ResponseEntity.ok(user);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {

        return ResponseEntity.ok(

                Map.of(
                        "message",
                        "Logged out successfully"
                )
        );
    }
}