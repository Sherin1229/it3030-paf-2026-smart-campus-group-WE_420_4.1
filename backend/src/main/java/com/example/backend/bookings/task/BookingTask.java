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

    public BookingTask(BookingRequestRepository bookingRequestRepository) {
        this.bookingRequestRepository = bookingRequestRepository;
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

        System.out.println("Running Auto-Expiry Task at " + now);

        // Find all APPROVED bookings for today that started more than 15 mins ago
        List<BookingRequest> pendingCheckIns = bookingRequestRepository.findAll().stream()
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
                System.out.println(" - Booking " + booking.getId() + " (BK-" + String.format("%04d", booking.getId()) + ") marked as EXPIRED");
            }
        }
    }
}
