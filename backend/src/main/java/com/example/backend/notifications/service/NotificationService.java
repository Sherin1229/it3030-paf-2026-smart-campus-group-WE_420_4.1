package com.example.backend.notifications.service;

import com.example.backend.bookings.model.BookingRequest;
import com.example.backend.bookings.repository.BookingRequestRepository;
import com.example.backend.maintenance.model.MaintenanceTicket;
import com.example.backend.maintenance.repository.MaintenanceTicketRepository;
import com.example.backend.notifications.dto.NotificationResponse;
import com.example.backend.notifications.model.NotificationState;
import com.example.backend.notifications.repository.NotificationStateRepository;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class NotificationService {

    private final BookingRequestRepository bookingRequestRepository;
    private final MaintenanceTicketRepository maintenanceTicketRepository;
    private final NotificationStateRepository notificationStateRepository;

    public NotificationService(
            BookingRequestRepository bookingRequestRepository,
            MaintenanceTicketRepository maintenanceTicketRepository,
            NotificationStateRepository notificationStateRepository) {
        this.bookingRequestRepository = bookingRequestRepository;
        this.maintenanceTicketRepository = maintenanceTicketRepository;
        this.notificationStateRepository = notificationStateRepository;
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotifications(String email, String role) {
        String normalizedRole = normalize(role).toUpperCase(Locale.ROOT);
        String normalizedEmail = normalize(email).toLowerCase(Locale.ROOT);
        boolean adminView = "ADMIN".equals(normalizedRole);
        String recipientEmail = normalizedEmail.isBlank() ? (adminView ? "admin@campushub.edu" : "") : normalizedEmail;

        List<NotificationEnvelope> notifications = new ArrayList<>();
        Map<String, NotificationState> states = loadStates(recipientEmail);

        List<BookingRequest> bookings = adminView
                ? bookingRequestRepository.findAllByOrderByCreatedAtDesc()
                : bookingRequestRepository.findByRequesterEmailOrderByCreatedAtDesc(normalizedEmail);

        for (BookingRequest booking : bookings) {
            LocalDateTime createdAt = booking.getCreatedAt();
            NotificationState state = states.get(stateKey("BOOKING", booking.getId()));
            if (state != null && state.isDeleted()) {
                continue;
            }
            String bookingCode = "BK-" + String.format("%04d", booking.getId());
            String title = adminView
                    ? "New booking request"
                    : "Booking request submitted";
            String message = adminView
                    ? bookingCode + " from " + booking.getRequesterEmail() + " for " + booking.getResourceName()
                    : bookingCode + " for " + booking.getResourceName() + " is currently " + booking.getStatus();

            notifications.add(new NotificationEnvelope(
                    new NotificationResponse(
                        buildNotificationId("BOOKING", booking.getId()),
                            "BOOKING",
                            booking.getId(),
                            title,
                            message,
                            "PENDING".equalsIgnoreCase(booking.getStatus()) ? "MEDIUM" : "LOW",
                            createdAt != null ? createdAt.toString() : null,
                        adminView ? "/dashboard/admin/bookings" : "/dashboard/user/bookings/my",
                                state != null && state.isRead()),
                    createdAt));
        }

        List<MaintenanceTicket> tickets = adminView
                ? maintenanceTicketRepository.findAllByOrderByCreatedAtDesc()
                : maintenanceTicketRepository.findByContactEmailOrderByCreatedAtDesc(normalizedEmail);

        for (MaintenanceTicket ticket : tickets) {
            LocalDateTime eventTime = ticket.getUpdatedAt() != null ? ticket.getUpdatedAt() : ticket.getCreatedAt();
            NotificationState state = states.get(stateKey("MAINTENANCE", ticket.getId()));
            if (state != null && state.isDeleted()) {
                continue;
            }
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
                            buildNotificationId("MAINTENANCE", ticket.getId()),
                            "MAINTENANCE",
                            ticket.getId(),
                            title,
                            message,
                            toSeverity(ticket.getPriority()),
                            eventTime != null ? eventTime.toString() : null,
                            adminView ? "/dashboard/admin/maintenance" : "/dashboard/user/maintenance",
                                state != null && state.isRead()),
                    eventTime));
        }

        return notifications.stream()
                .sorted(Comparator.comparing(NotificationEnvelope::createdAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(NotificationEnvelope::payload)
                .toList();
    }

    public NotificationResponse markAsRead(String notificationId, String email, String role) {
        String normalizedEmail = normalize(email).toLowerCase(Locale.ROOT);
        NotificationKey key = parseNotificationId(notificationId);
        NotificationState state = findOrCreateState(normalizedEmail, key);
        state.markRead();
        notificationStateRepository.save(state);
        return getNotification(notificationId, email, role);
    }

    public void deleteNotification(String notificationId, String email, String role) {
        String normalizedEmail = normalize(email).toLowerCase(Locale.ROOT);
        NotificationKey key = parseNotificationId(notificationId);
        NotificationState state = findOrCreateState(normalizedEmail, key);
        state.markDeleted();
        notificationStateRepository.save(state);
    }

    @Transactional(readOnly = true)
    public NotificationResponse getNotification(String notificationId, String email, String role) {
        List<NotificationResponse> notifications = getNotifications(email, role);
        return notifications.stream()
                .filter(notification -> notification.notificationId().equals(notificationId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found."));
    }

    private Map<String, NotificationState> loadStates(String recipientEmail) {
        Map<String, NotificationState> states = new HashMap<>();
        if (recipientEmail == null || recipientEmail.isBlank()) {
            return states;
        }

        notificationStateRepository.findAll().stream()
                .filter(state -> recipientEmail.equalsIgnoreCase(state.getRecipientEmail()))
                .forEach(state -> states.put(stateKey(state.getSourceType(), state.getSourceId()), state));

        return states;
    }

    private NotificationState findOrCreateState(String recipientEmail, NotificationKey key) {
        if (recipientEmail == null || recipientEmail.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Recipient email is required.");
        }

        return notificationStateRepository
                .findByRecipientEmailAndSourceTypeAndSourceId(recipientEmail, key.sourceType(), key.sourceId())
                .orElseGet(() -> new NotificationState(recipientEmail, key.sourceType(), key.sourceId()));
    }

    private NotificationKey parseNotificationId(String notificationId) {
        if (notificationId == null || !notificationId.contains("-")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid notification id.");
        }

        String[] parts = notificationId.split("-", 2);
        String sourceType = normalize(parts[0]).toUpperCase(Locale.ROOT);
        try {
            Long sourceId = Long.valueOf(parts[1]);
            return new NotificationKey(sourceType, sourceId);
        } catch (NumberFormatException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid notification id.");
        }
    }

    private String buildNotificationId(String sourceType, Long sourceId) {
        return sourceType.toUpperCase(Locale.ROOT) + "-" + sourceId;
    }

    private String stateKey(String sourceType, Long sourceId) {
        return sourceType.toUpperCase(Locale.ROOT) + "-" + sourceId;
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

    private record NotificationKey(String sourceType, Long sourceId) {
    }

    private record NotificationEnvelope(NotificationResponse payload, LocalDateTime createdAt) {
    }
}
