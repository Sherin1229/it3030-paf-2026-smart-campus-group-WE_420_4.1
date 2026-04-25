package com.example.backend.bookings.task;

import com.example.backend.bookings.model.BookingRequest;
import com.example.backend.bookings.repository.BookingRequestRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
public class BookingTask {

    private final BookingRequestRepository bookingRequestRepository;
    private final com.example.backend.repository.ResourceRepository resourceRepository;

    public BookingTask(BookingRequestRepository bookingRequestRepository, com.example.backend.repository.ResourceRepository resourceRepository) {
        this.bookingRequestRepository = bookingRequestRepository;
        this.resourceRepository = resourceRepository;
    }

    /**
     * Runs every 5 minutes to check for no-shows.
     * If a booking is APPROVED but the student hasn't checked in 
     * within 15 minutes of the start time, mark as EXPIRED.
     */
    @Scheduled(fixedRate = 300000) // 5 minutes
    public void expireMissedBookings() {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        LocalTime fifteenMinsAgo = now.minusMinutes(15);

        System.out.println("Running Auto-Expiry & Status Task at " + now);

        List<BookingRequest> allBookings = bookingRequestRepository.findAll();

        // 1. Find all APPROVED bookings for today that started more than 15 mins ago
        List<BookingRequest> pendingCheckIns = allBookings.stream()
                .filter(b -> "APPROVED".equals(b.getStatus()))
                .filter(b -> b.getDate().isEqual(today) || b.getDate().isBefore(today))
                .filter(b -> {
                    // If it's today, check if start time was > 15 mins ago
                    if (b.getDate().isEqual(today)) {
                        return b.getStartTime().isBefore(fifteenMinsAgo);
                    }
                    // If it's a past date, it's definitely expired
                    return true;
                })
                .toList();

        if (!pendingCheckIns.isEmpty()) {
            System.out.println("Found " + pendingCheckIns.size() + " expired bookings. Updating status...");
            for (BookingRequest booking : pendingCheckIns) {
                booking.setStatus("EXPIRED");
                bookingRequestRepository.save(booking);
                System.out.println(" - Booking BK-" + String.format("%04d", booking.getId()) + " marked as EXPIRED");
            }
        }

        // 2. Mark finished CHECKED_IN bookings as COMPLETED
        List<BookingRequest> finishedBookings = allBookings.stream()
                .filter(b -> "CHECKED_IN".equals(b.getStatus()))
                .filter(b -> b.getDate().isBefore(today) || (b.getDate().isEqual(today) && b.getEndTime().isBefore(now)))
                .toList();

        if (!finishedBookings.isEmpty()) {
            System.out.println("Found " + finishedBookings.size() + " finished bookings. Marking as COMPLETED...");
            for (BookingRequest booking : finishedBookings) {
                booking.setStatus("COMPLETED");
                bookingRequestRepository.save(booking);
                System.out.println(" - Booking BK-" + String.format("%04d", booking.getId()) + " marked as COMPLETED");
            }
        }

        // 3. Update Resource Status (OCCUPIED vs ACTIVE)
        updateResourceStatuses(today, now);
    }

    private void updateResourceStatuses(LocalDate today, LocalTime now) {
        List<com.example.backend.model.Resource> resources = resourceRepository.findAll();
        List<BookingRequest> activeCheckedInBookings = bookingRequestRepository.findAll().stream()
                .filter(b -> "CHECKED_IN".equals(b.getStatus()))
                .filter(b -> b.getDate().isEqual(today) && !now.isBefore(b.getStartTime()) && !now.isAfter(b.getEndTime()))
                .toList();

        for (com.example.backend.model.Resource resource : resources) {
            // Skip resources that are OUT_OF_SERVICE
            if (resource.getStatus() == com.example.backend.model.ResourceStatus.OUT_OF_SERVICE) {
                continue;
            }

            boolean isOccupied = activeCheckedInBookings.stream()
                    .anyMatch(b -> b.getResourceId().equals(resource.getId().toString()));

            com.example.backend.model.ResourceStatus targetStatus = isOccupied 
                    ? com.example.backend.model.ResourceStatus.OCCUPIED 
                    : com.example.backend.model.ResourceStatus.ACTIVE;

            if (resource.getStatus() != targetStatus) {
                resource.setStatus(targetStatus);
                resourceRepository.save(resource);
                System.out.println(" - Resource " + resource.getName() + " (" + resource.getCode() + ") status updated to " + targetStatus);
            }
        }
    }
}
