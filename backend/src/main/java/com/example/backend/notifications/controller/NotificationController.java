package com.example.backend.notifications.controller;

import com.example.backend.notifications.dto.NotificationResponse;
import com.example.backend.notifications.service.NotificationService;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
}
