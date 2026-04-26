package com.example.backend.dashboard.controller;

import com.example.backend.bookings.dto.BookingResponse;
import com.example.backend.bookings.repository.BookingRequestRepository;
import com.example.backend.bookings.service.BookingService;
import com.example.backend.dashboard.dto.AdminDashboardStats;
import com.example.backend.model.ResourceStatus;
import com.example.backend.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://10.50.20.47:5173", "http://10.199.20.47:5173", "http://172.28.27.15:5173", "http://172.20.10.10:5173"})
public class DashboardController {

    private final BookingRequestRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final BookingService bookingService;

    @GetMapping("/admin/stats")
    public AdminDashboardStats getAdminStats() {
        System.out.println("DEBUG: Dashboard stats requested at " + java.time.LocalDateTime.now());
        long pending = bookingRepository.countByStatus("PENDING");
        long activeRes = resourceRepository.countByStatus(ResourceStatus.ACTIVE);
        long approvedToday = bookingRepository.countByStatusAndDate("APPROVED", LocalDate.now());
        
        // Fetch top 5 pending bookings for the queue preview
        List<BookingResponse> queue = bookingRepository.findTop5ByStatusOrderByCreatedAtDesc("PENDING")
                .stream()
                .map(bookingService::toResponse)
                .collect(Collectors.toList());

        return AdminDashboardStats.builder()
                .pendingApprovals(pending)
                .activeResources(activeRes)
                .conflictFlags(0) // Placeholder for now
                .approvedToday(approvedToday)
                .approvalQueue(queue)
                .build();
    }
}
