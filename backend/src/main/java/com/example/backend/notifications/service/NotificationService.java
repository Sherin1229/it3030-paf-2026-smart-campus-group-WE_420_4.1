package com.example.backend.notifications.service;

import com.example.backend.bookings.model.BookingRequest;
import com.example.backend.bookings.repository.BookingRequestRepository;
import com.example.backend.maintenance.model.MaintenanceTicket;
import com.example.backend.maintenance.repository.MaintenanceTicketRepository;
import com.example.backend.notifications.dto.NotificationResponse;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final BookingRequestRepository bookingRequestRepository;
    private final MaintenanceTicketRepository maintenanceTicketRepository;

    public NotificationService(
            BookingRequestRepository bookingRequestRepository,
            MaintenanceTicketRepository maintenanceTicketRepository) {
        this.bookingRequestRepository = bookingRequestRepository;
        this.maintenanceTicketRepository = maintenanceTicketRepository;
    }

    public List<NotificationResponse> getNotifications(String email, String role) {
        String normalizedRole = normalize(role).toUpperCase(Locale.ROOT);
        String normalizedEmail = normalize(email).toLowerCase(Locale.ROOT);
        boolean adminView = "ADMIN".equals(normalizedRole);

        List<NotificationEnvelope> notifications = new ArrayList<>();

        List<BookingRequest> bookings = adminView
                ? bookingRequestRepository.findAllByOrderByCreatedAtDesc()
                : bookingRequestRepository.findByRequesterEmailOrderByCreatedAtDesc(normalizedEmail);

        for (BookingRequest booking : bookings) {
            LocalDateTime createdAt = booking.getCreatedAt();
            String bookingCode = "BK-" + String.format("%04d", booking.getId());
            String title = adminView
                    ? "New booking request"
                    : "Booking request submitted";
            String message = adminView
                    ? bookingCode + " from " + booking.getRequesterEmail() + " for " + booking.getResourceName()
                    : bookingCode + " for " + booking.getResourceName() + " is currently " + booking.getStatus();

            notifications.add(new NotificationEnvelope(
                    new NotificationResponse(
                            "BOOKING-" + booking.getId(),
                            "BOOKING",
                            booking.getId(),
                            title,
                            message,
                            "PENDING".equalsIgnoreCase(booking.getStatus()) ? "MEDIUM" : "LOW",
                            createdAt != null ? createdAt.toString() : null,
                            adminView ? "/dashboard/admin/bookings" : "/dashboard/user/bookings/my"),
                    createdAt));
        }

        List<MaintenanceTicket> tickets = adminView
                ? maintenanceTicketRepository.findAllByOrderByCreatedAtDesc()
                : maintenanceTicketRepository.findByContactEmailOrderByCreatedAtDesc(normalizedEmail);

        for (MaintenanceTicket ticket : tickets) {
            LocalDateTime eventTime = ticket.getUpdatedAt() != null ? ticket.getUpdatedAt() : ticket.getCreatedAt();
            String title;
            String message;

            if (adminView) {
                title = "Maintenance ticket update";
                message = "Ticket #" + ticket.getId() + " by " + ticket.getContactEmail() + " is " + ticket.getStatus();
            } else {
                title = "Maintenance ticket status";
                message = "Ticket #" + ticket.getId() + " for " + ticket.getResourceName() + " is " + ticket.getStatus();
            }

            notifications.add(new NotificationEnvelope(
                    new NotificationResponse(
                            "MAINTENANCE-" + ticket.getId(),
                            "MAINTENANCE",
                            ticket.getId(),
                            title,
                            message,
                            toSeverity(ticket.getPriority()),
                            eventTime != null ? eventTime.toString() : null,
                            adminView ? "/dashboard/admin/maintenance" : "/dashboard/user/maintenance"),
                    eventTime));
        }

        return notifications.stream()
                .sorted(Comparator.comparing(NotificationEnvelope::createdAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(NotificationEnvelope::payload)
                .toList();
    }

    private String toSeverity(String priority) {
        String normalized = normalize(priority).toUpperCase(Locale.ROOT);
        return switch (normalized) {
            case "HIGH", "CRITICAL" -> "HIGH";
            case "MEDIUM" -> "MEDIUM";
            default -> "LOW";
        };
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }

    private record NotificationEnvelope(NotificationResponse payload, LocalDateTime createdAt) {
    }
}
