package com.example.backend.maintenance.dto;

import java.util.List;

public record MaintenanceTicketResponse(
        Long ticketId,
        String resourceName,
        String resourceLocation,
        String category,
        String description,
        String priority,
        String status,
        String rejectionReason,
        String assignedTo,
        String contactName,
        String contactEmail,
        String contactPhone,
        List<String> imageUrls,
        List<MaintenanceTicketNoteResponse> notes,
        String createdAt,
        String updatedAt) {
}
