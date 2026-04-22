package com.example.backend.bookings.service;

import com.example.backend.bookings.dto.BookingResponse;
import com.example.backend.bookings.dto.CreateBookingRequest;
import com.example.backend.bookings.model.BookingRequest;
import com.example.backend.bookings.repository.BookingRequestRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class BookingService {

    private final BookingRequestRepository bookingRequestRepository;

    public BookingService(BookingRequestRepository bookingRequestRepository) {
        this.bookingRequestRepository = bookingRequestRepository;
    }

    public BookingResponse createBooking(CreateBookingRequest request) {
        String requesterEmail = safeTrim(request.requesterEmail()).toLowerCase(Locale.ROOT);
        String resourceId = safeTrim(request.resourceId());
        String resourceName = safeTrim(request.resourceName());
        String resourceType = safeTrim(request.resourceType());
        String purpose = safeTrim(request.purpose());

        if (requesterEmail.isBlank() || resourceId.isBlank() || resourceName.isBlank() || resourceType.isBlank()
                || purpose.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Requester, resource and purpose are required.");
        }

        LocalDate date;
        LocalTime startTime;
        LocalTime endTime;
        try {
            date = LocalDate.parse(safeTrim(request.date()));
            startTime = LocalTime.parse(safeTrim(request.startTime()));
            endTime = LocalTime.parse(safeTrim(request.endTime()));
        } catch (DateTimeParseException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid date or time format.");
        }

        if (!startTime.isBefore(endTime)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Start time must be earlier than end time.");
        }

        if (date.atTime(startTime).isBefore(LocalDateTime.now().plusHours(24))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Bookings must be created at least 24 hours in advance.");
        }

        boolean overlaps = bookingRequestRepository.existsByResourceIdAndDateAndStartTimeLessThanAndEndTimeGreaterThan(
                resourceId,
                date,
                endTime,
                startTime);

        if (overlaps) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Selected time slot is not available for this resource.");
        }

        Integer attendees = request.attendees();
        if (attendees != null && attendees < 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Attendees must be at least 1.");
        }

        BookingRequest booking = new BookingRequest(
                requesterEmail,
                resourceId,
                resourceName,
                resourceType,
                date,
                startTime,
                endTime,
                purpose,
                attendees,
                "PENDING");

        BookingRequest saved = bookingRequestRepository.save(booking);
        return toResponse(saved);
    }

    private BookingResponse toResponse(BookingRequest booking) {
        String bookingCode = "BK-" + String.format("%04d", booking.getId());
        return new BookingResponse(
                booking.getId(),
                bookingCode,
                booking.getRequesterEmail(),
                booking.getResourceId(),
                booking.getResourceName(),
                booking.getResourceType(),
                booking.getDate().toString(),
                booking.getStartTime().toString(),
                booking.getEndTime().toString(),
                booking.getPurpose(),
                booking.getAttendees(),
                booking.getStatus(),
                booking.getCreatedAt() != null ? booking.getCreatedAt().toString() : null);
    }

    private String safeTrim(String value) {
        return value == null ? "" : value.trim();
    }
}
