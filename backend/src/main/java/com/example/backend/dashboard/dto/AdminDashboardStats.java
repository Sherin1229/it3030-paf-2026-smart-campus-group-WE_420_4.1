package com.example.backend.dashboard.dto;

import com.example.backend.bookings.dto.BookingResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardStats {
    private long pendingApprovals;
    private long activeResources;
    private long conflictFlags;
    private long approvedToday;
    private List<BookingResponse> approvalQueue;
}
