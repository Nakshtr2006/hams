package com.nakshtr.hams.service;

import com.nakshtr.hams.dto.UpdateUserRequest;
import com.nakshtr.hams.entity.User;
import com.nakshtr.hams.exception.EmailAlreadyExistsException;
import com.nakshtr.hams.exception.UserNotFoundException;
import com.nakshtr.hams.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {

        return userRepository.findAll();
    }

    public User createUser(
            User user
    ) {

        if (
                userRepository.findByEmail(
                        user.getEmail()
                ).isPresent()
        ) {

            throw new EmailAlreadyExistsException(
                    user.getEmail()
            );
        }

        user.setCreatedAt(
                LocalDateTime.now()
        );

        user.setPassword(
                passwordEncoder.encode(
                        user.getPassword()
                )
        );

        return userRepository.save(
                user
        );
    }

    public User getUserById(
            Long id
    ) {

        return userRepository.findById(id)
                .orElseThrow(
                        () ->
                                new UserNotFoundException(id)
                );
    }

    public User updateUser(
            Long id,
            UpdateUserRequest request
    ) {

        User existingUser =
                userRepository.findById(id)
                        .orElseThrow(
                                () ->
                                        new UserNotFoundException(id)
                        );

        existingUser.setName(
                request.getName()
        );

        existingUser.setPhone(
                request.getPhone()
        );

        existingUser.setGender(
                request.getGender()
        );

        existingUser.setRole(
                request.getRole()
        );

        existingUser.setActive(
                request.isActive()
        );

        return userRepository.save(
                existingUser
        );
    }

    public void deleteUser(
            Long id
    ) {

        if (
                !userRepository.existsById(id)
        ) {

            throw new UserNotFoundException(
                    id
            );
        }

        userRepository.deleteById(id);
    }
}