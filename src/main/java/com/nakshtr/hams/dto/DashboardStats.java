package com.nakshtr.hams.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DashboardStats {

    private long totalUsers;
    private long totalProducts;
    private long totalAuditLogs;
}