package com.example.backend.maintenance.dto;

public record MaintenanceTicketNoteResponse(
        Long id,
        String author,
        String content,
        String createdAt) {
}
