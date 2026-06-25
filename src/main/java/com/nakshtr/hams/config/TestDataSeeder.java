package com.nakshtr.hams.config;

import com.nakshtr.hams.entity.Gender;
import com.nakshtr.hams.entity.Role;
import com.nakshtr.hams.entity.User;
import com.nakshtr.hams.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Profile("test")
public class TestDataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public TestDataSeeder(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        System.out.println(">>> TestDataSeeder is running...");

        createUser(
                "Root User",
                "root@hams.com",
                "Root@123",
                "9999999991",
                Gender.MALE,
                Role.ROOT
        );

        createUser(
                "Admin User",
                "admin@hams.com",
                "Admin@123",
                "9999999992",
                Gender.MALE,
                Role.ADMIN
        );

        createUser(
                "Manager User",
                "manager@hams.com",
                "Manager@123",
                "9999999993",
                Gender.MALE,
                Role.MANAGER
        );

        createUser(
                "Employee User",
                "employee@hams.com",
                "Employee@123",
                "9999999994",
                Gender.MALE,
                Role.EMPLOYEE
        );

        createUser(
                "Customer User",
                "customer@hams.com",
                "Customer@123",
                "9999999995",
                Gender.MALE,
                Role.CUSTOMER
        );

        System.out.println("Users in database: " + userRepository.count());

        userRepository.findAll().forEach(user ->
                System.out.println(
                        user.getEmail() + " -> " + user.getRole()
                )
        );

    }

    private void createUser(
            String name,
            String email,
            String password,
            String phone,
            Gender gender,
            Role role
    ) {

        if (userRepository.findByEmail(email).isPresent()) {
            return;
        }

        User user = User.builder()
                .name(name)
                .email(email)
                .password(passwordEncoder.encode(password))
                .phone(phone)
                .gender(gender)
                .role(role)
                .active(true)
                .build();

        userRepository.save(user);
    }
}