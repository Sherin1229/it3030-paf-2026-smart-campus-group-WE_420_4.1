package com.example.backend.bookings.dto;

public record CreateBookingRequest(
        String requesterEmail,
        String resourceId,
        String resourceName,
        String resourceType,
        String date,
        String startTime,
        String endTime,
        String purpose,
        Integer attendees) {
}
