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
}
