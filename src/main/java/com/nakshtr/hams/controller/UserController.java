package com.nakshtr.hams.controller;

import com.nakshtr.hams.dto.UpdateUserRequest;
import com.nakshtr.hams.entity.User;
import com.nakshtr.hams.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(
            UserService userService
    ) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getAllUsers() {

        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getUserById(
            @PathVariable Long id
    ) {

        return userService.getUserById(id);
    }

    @PostMapping
    public User createUser(
            @Valid
            @RequestBody User user
    ) {

        return userService.createUser(user);
    }

    @PutMapping("/{id}")
    public User updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserRequest request
    ) {

        return userService.updateUser(
                id,
                request
        );
    }

    @DeleteMapping("/{id}")
    public String deleteUser(
            @PathVariable Long id
    ) {

        userService.deleteUser(id);

        return "User deleted successfully";
    }

    @GetMapping("/me")
    public Object me(
            Authentication authentication
    ) {

        return authentication;
    }
}