package com.example.backend.bookings.repository;

import com.example.backend.bookings.model.BookingRequest;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRequestRepository extends JpaRepository<BookingRequest, Long> {

    List<BookingRequest> findAllByOrderByCreatedAtDesc();

    List<BookingRequest> findByRequesterEmailOrderByCreatedAtDesc(String requesterEmail);

    boolean existsByResourceIdAndDateAndStartTimeLessThanAndEndTimeGreaterThan(
            String resourceId,
            LocalDate date,
            LocalTime endTime,
            LocalTime startTime);

    List<BookingRequest> findByRequesterEmailAndResourceIdAndDateAndStatus(
            String email, String resourceId, LocalDate date, String status);

    long countByStatus(String status);

    long countByStatusAndDate(String status, LocalDate date);

    List<BookingRequest> findTop5ByStatusOrderByCreatedAtDesc(String status);
}
