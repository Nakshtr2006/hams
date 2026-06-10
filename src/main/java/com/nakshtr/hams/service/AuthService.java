package com.nakshtr.hams.service;

import com.nakshtr.hams.dto.SignupRequest;
import com.nakshtr.hams.entity.Gender;
import com.nakshtr.hams.entity.Role;
import com.nakshtr.hams.entity.User;
import com.nakshtr.hams.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public User login(
            String email,
            String password
    ) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid Email or Password"
                        )
                );

        boolean matches =
                passwordEncoder.matches(
                        password,
                        user.getPassword()
                );

        if (!matches) {

            throw new RuntimeException(
                    "Invalid Email or Password"
            );
        }

        return user;
    }

    public User signup(
            SignupRequest request
    ) {

        if (userRepository.findByEmail(
                request.getEmail()
        ).isPresent()) {

            throw new RuntimeException(
                    "Email already exists"
            );
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .phone(request.getPhone())
                .gender(
                        Gender.valueOf(
                                request.getGender()
                                        .toUpperCase()
                        )
                )
                .role(Role.CUSTOMER)
                .active(true)
                .build();

        return userRepository.save(user);
    }
}