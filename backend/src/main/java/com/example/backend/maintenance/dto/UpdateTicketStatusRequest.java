package com.example.backend.maintenance.dto;

public record UpdateTicketStatusRequest(
        String status,
        String rejectionReason,
        String assignedTo) {
}
