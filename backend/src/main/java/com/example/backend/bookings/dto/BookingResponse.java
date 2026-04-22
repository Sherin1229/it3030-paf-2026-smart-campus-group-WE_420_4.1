package com.example.backend.bookings.dto;

public record BookingResponse(
        Long id,
        String bookingCode,
        String requesterEmail,
        String resourceId,
        String resourceName,
        String resourceType,
        String date,
        String startTime,
        String endTime,
        String purpose,
        Integer attendees,
        String status,
        String createdAt) {
}
