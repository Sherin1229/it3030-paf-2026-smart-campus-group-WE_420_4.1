package com.example.backend.notifications.dto;

public record NotificationResponse(
        String notificationId,
        String sourceType,
        Long sourceId,
        String title,
        String message,
        String severity,
        String createdAt,
        String route) {
}
