package com.example.backend.bookings.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "booking_requests")
public class BookingRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String requesterEmail;

    @Column(nullable = false)
    private String resourceId;

    @Column(nullable = false)
    private String resourceName;

    @Column(nullable = false)
    private String resourceType;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column(nullable = false, length = 1000)
    private String purpose;

    @Column
    private Integer attendees;

    @Column(nullable = false)
    private String status;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    protected BookingRequest() {
    }

    public BookingRequest(
            String requesterEmail,
            String resourceId,
            String resourceName,
            String resourceType,
            LocalDate date,
            LocalTime startTime,
            LocalTime endTime,
            String purpose,
            Integer attendees,
            String status) {
        this.requesterEmail = requesterEmail;
        this.resourceId = resourceId;
        this.resourceName = resourceName;
        this.resourceType = resourceType;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.purpose = purpose;
        this.attendees = attendees;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public String getRequesterEmail() {
        return requesterEmail;
    }

    public String getResourceId() {
        return resourceId;
    }

    public String getResourceName() {
        return resourceName;
    }

    public String getResourceType() {
        return resourceType;
    }

    public LocalDate getDate() {
        return date;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public String getPurpose() {
        return purpose;
    }

    public Integer getAttendees() {
        return attendees;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
