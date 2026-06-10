package com.nakshtr.hams.service;

import com.nakshtr.hams.entity.AuditLog;
import com.nakshtr.hams.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(
            AuditLogRepository auditLogRepository
    ) {
        this.auditLogRepository = auditLogRepository;
    }

    public void log(
            String action,
            String performedBy
    ) {

        AuditLog auditLog =
                AuditLog.builder()
                        .action(action)
                        .performedBy(performedBy)
                        .createdAt(LocalDateTime.now())
                        .build();

        auditLogRepository.save(
                auditLog
        );
    }

    public List<AuditLog> getAllLogs() {

        return auditLogRepository.findAll();
    }
}