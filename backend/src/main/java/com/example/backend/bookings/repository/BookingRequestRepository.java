package com.example.backend.bookings.repository;

import com.example.backend.bookings.model.BookingRequest;
import java.time.LocalDate;
import java.time.LocalTime;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRequestRepository extends JpaRepository<BookingRequest, Long> {

    boolean existsByResourceIdAndDateAndStartTimeLessThanAndEndTimeGreaterThan(
            String resourceId,
            LocalDate date,
            LocalTime endTime,
            LocalTime startTime);

    java.util.List<BookingRequest> findByRequesterEmailOrderByCreatedAtDesc(String requesterEmail);

    java.util.List<BookingRequest> findByRequesterEmailAndResourceIdAndDateAndStatus(
            String email, String resourceId, LocalDate date, String status);
}
