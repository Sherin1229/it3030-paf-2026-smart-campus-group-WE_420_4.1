package com.example.backend.notifications.controller;

import com.example.backend.notifications.dto.NotificationResponse;
import com.example.backend.notifications.service.NotificationService;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public List<NotificationResponse> allNotifications(
            @RequestParam(required = false) String email,
            @RequestParam(required = false, defaultValue = "USER") String role) {
        return notificationService.getNotifications(email, role);
    }

    @PutMapping("/{notificationId}/read")
    public NotificationResponse markAsRead(
            @PathVariable String notificationId,
            @RequestParam(required = false) String email,
            @RequestParam(required = false, defaultValue = "USER") String role) {
        return notificationService.markAsRead(notificationId, email, role);
    }

    @DeleteMapping("/{notificationId}")
    public void deleteNotification(
            @PathVariable String notificationId,
            @RequestParam(required = false) String email,
            @RequestParam(required = false, defaultValue = "USER") String role) {
        notificationService.deleteNotification(notificationId, email, role);
    }
}
