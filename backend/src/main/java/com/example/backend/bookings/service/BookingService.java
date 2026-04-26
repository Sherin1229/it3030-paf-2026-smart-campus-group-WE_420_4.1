package com.example.backend.bookings.service;

import com.example.backend.bookings.dto.BookingResponse;
import com.example.backend.bookings.dto.CreateBookingRequest;
import com.example.backend.bookings.model.BookingRequest;
import com.example.backend.bookings.repository.BookingRequestRepository;
import com.example.backend.repository.ResourceRepository;
import com.example.backend.model.Resource;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.Locale;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class BookingService {

    private final BookingRequestRepository bookingRequestRepository;
    private final ResourceRepository resourceRepository;

    public BookingService(BookingRequestRepository bookingRequestRepository, ResourceRepository resourceRepository) {
        this.bookingRequestRepository = bookingRequestRepository;
        this.resourceRepository = resourceRepository;
    }

    public void checkIn(String email, String resourceCode) {
        System.out.println("Check-in attempt: email=" + email + ", resourceCode=" + resourceCode);
        
        Resource resource;
        if (resourceCode.startsWith("RES-")) {
            try {
                Long id = Long.parseLong(resourceCode.substring(4));
                resource = resourceRepository.findById(id)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource not found by ID."));
            } catch (Exception e) {
                resource = resourceRepository.findByCode(resourceCode)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid resource QR code."));
            }
        } else {
            resource = resourceRepository.findByCode(resourceCode)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid resource QR code."));
        }

        System.out.println("Found resource: " + resource.getName() + " (ID: " + resource.getId() + ")");

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        
        System.out.println("Current time: " + today + " " + now);

        List<BookingRequest> bookings = bookingRequestRepository
                .findByRequesterEmailAndResourceIdAndDateAndStatus(
                        email.toLowerCase(Locale.ROOT),
                        resource.getId().toString(),
                        today,
                        "APPROVED"
                );
        
        System.out.println("Found " + bookings.size() + " approved bookings for today.");
        for (BookingRequest b : bookings) {
            System.out.println(" - Booking: " + b.getStartTime() + " to " + b.getEndTime());
        }

        // Find an approved booking for this user/resource today that is within +/- 5 mins of startTime
        Optional<BookingRequest> activeBooking = bookings.stream()
                .filter(b -> {
                    LocalTime checkInStart = b.getStartTime().minusMinutes(5);
                    LocalTime checkInEnd = b.getStartTime().plusMinutes(5);
                    boolean inWindow = !now.isBefore(checkInStart) && !now.isAfter(checkInEnd);
                    System.out.println("Checking booking " + b.getStartTime() + ": now=" + now + ", window=[" + checkInStart + ", " + checkInEnd + "], match=" + inWindow);
                    return inWindow;
                })
                .findFirst();

        if (activeBooking.isEmpty()) {
            System.out.println("No booking found within the +/- 5 minute start time window.");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
                "Check-in is only allowed within 5 minutes of your booking start time (" + now + ").");
        }

        BookingRequest booking = activeBooking.get();
        System.out.println("Check-in successful for booking ID: " + booking.getId());
        booking.setStatus("CHECKED_IN");
        bookingRequestRepository.save(booking);

        // Update resource status immediately
        resource.setStatus(com.example.backend.model.ResourceStatus.OCCUPIED);
        resourceRepository.save(resource);
    }

    public List<BookingResponse> getUserBookings(String email) {
        return bookingRequestRepository.findByRequesterEmailOrderByCreatedAtDesc(email.toLowerCase(Locale.ROOT))
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse verifyBooking(String code) {
        try {
            Long id = Long.parseLong(code.replace("BK-", ""));
            return bookingRequestRepository.findById(id)
                    .map(this::toResponse)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking pass invalid."));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid pass format.");
        }
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRequestRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse updateBookingStatus(Long id, String status) {
        BookingRequest booking = bookingRequestRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found."));
        booking.setStatus(status.toUpperCase(Locale.ROOT));
        return toResponse(bookingRequestRepository.save(booking));
    }

    public BookingResponse createBooking(CreateBookingRequest request) {
        String requesterEmail = safeTrim(request.getRequesterEmail()).toLowerCase(Locale.ROOT);
        String resourceId = safeTrim(request.getResourceId());
        String resourceName = safeTrim(request.getResourceName());
        String resourceType = safeTrim(request.getResourceType());
        String purpose = safeTrim(request.getPurpose());

        if (requesterEmail.isBlank() || resourceId.isBlank() || resourceName.isBlank() || resourceType.isBlank()
                || purpose.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Requester, resource and purpose are required.");
        }

        // Check if resource is OUT_OF_SERVICE
        try {
            Long rId = Long.parseLong(resourceId);
            resourceRepository.findById(rId).ifPresent(r -> {
                if (r.getStatus() == com.example.backend.model.ResourceStatus.OUT_OF_SERVICE) {
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Resource is currently out of service and cannot be booked.");
                }
            });
        } catch (NumberFormatException e) {
            // Ignore if ID is not a number
        }

        LocalDate date;
        LocalTime startTime;
        LocalTime endTime;
        try {
            date = LocalDate.parse(safeTrim(request.getDate()));
            startTime = LocalTime.parse(safeTrim(request.getStartTime()));
            endTime = LocalTime.parse(safeTrim(request.getEndTime()));
        } catch (DateTimeParseException ex) {
            System.err.println("Booking creation failed: Invalid date/time format - " + ex.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid date or time format.");
        }

        if (!startTime.isBefore(endTime)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Start time must be earlier than end time.");
        }

        if (date.atTime(startTime).isBefore(LocalDateTime.now().minusMinutes(5))) {
            System.err.println("Booking creation failed: Past time requested - " + date + " " + startTime);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Bookings must be created for a future time.");
        }

        boolean overlaps = bookingRequestRepository.existsByResourceIdAndDateAndStartTimeLessThanAndEndTimeGreaterThan(
                resourceId,
                date,
                endTime,
                startTime);

        if (overlaps) {
            System.err.println("Booking creation failed: Slot overlap for resource " + resourceId + " on " + date);
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Selected time slot is not available for this resource.");
        }

        Integer attendees = request.getAttendees();
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

    public BookingResponse toResponse(BookingRequest booking) {
        String bookingCode = "BK-" + String.format("%04d", booking.getId());
        
        String resourceCode = "";
        try {
            resourceCode = resourceRepository.findById(Long.parseLong(booking.getResourceId()))
                    .map(Resource::getCode)
                    .orElse("");
        } catch (Exception e) {
            // Log or handle error if needed
        }

        return new BookingResponse(
                booking.getId(),
                bookingCode,
                booking.getRequesterEmail(),
                booking.getResourceId(),
                booking.getResourceName(),
                booking.getResourceType(),
                resourceCode,
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
