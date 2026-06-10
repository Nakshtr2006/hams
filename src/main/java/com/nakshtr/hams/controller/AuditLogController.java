package com.nakshtr.hams.controller;

import com.nakshtr.hams.entity.AuditLog;
import com.nakshtr.hams.service.AuditLogService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/audit-logs")
public class AuditLogController {

    private final AuditLogService auditLogService;

    public AuditLogController(
            AuditLogService auditLogService
    ) {
        this.auditLogService = auditLogService;
    }

    @GetMapping
    public List<AuditLog> getLogs() {

        return auditLogService.getAllLogs();
    }
}