package com.nakshtr.hams.controller;

import com.nakshtr.hams.dto.DashboardStats;
import com.nakshtr.hams.repository.AuditLogRepository;
import com.nakshtr.hams.repository.ProductRepository;
import com.nakshtr.hams.repository.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DashboardController {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final AuditLogRepository auditLogRepository;

    public DashboardController(
            UserRepository userRepository,
            ProductRepository productRepository,
            AuditLogRepository auditLogRepository
    ) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @GetMapping("/dashboard/stats")
    public DashboardStats getStats() {

        return new DashboardStats(
                userRepository.count(),
                productRepository.count(),
                auditLogRepository.count()
        );
    }
}