package com.example.backend.dashboard.dto;

import com.example.backend.bookings.dto.BookingResponse;
import java.util.List;

public class AdminDashboardStats {
    private long pendingApprovals;
    private long activeResources;
    private long conflictFlags;
    private long approvedToday;
    private List<BookingResponse> approvalQueue;

    public AdminDashboardStats(
            long pendingApprovals,
            long activeResources,
            long conflictFlags,
            long approvedToday,
            List<BookingResponse> approvalQueue) {
        this.pendingApprovals = pendingApprovals;
        this.activeResources = activeResources;
        this.conflictFlags = conflictFlags;
        this.approvedToday = approvedToday;
        this.approvalQueue = approvalQueue;
    }

    public long getPendingApprovals() {
        return pendingApprovals;
    }

    public long getActiveResources() {
        return activeResources;
    }

    public long getConflictFlags() {
        return conflictFlags;
    }

    public long getApprovedToday() {
        return approvedToday;
    }

    public List<BookingResponse> getApprovalQueue() {
        return approvalQueue;
    }
}
