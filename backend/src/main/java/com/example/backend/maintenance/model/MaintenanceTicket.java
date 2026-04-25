package com.example.backend.maintenance.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "maintenance_tickets")
public class MaintenanceTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String resourceName;

    @Column(nullable = false)
    private String resourceLocation;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false, length = 2000)
    private String description;

    @Column(nullable = false)
    private String priority;

    @Column(nullable = false)
    private String status;

    @Column(length = 1000)
    private String rejectionReason;

    @Column
    private String assignedTo;

    @Column(nullable = false)
    private String contactName;

    @Column(nullable = false)
    private String contactEmail;

    @Column(nullable = false)
    private String contactPhone;

    @Column(name = "image_url_1", columnDefinition = "LONGTEXT")
    private String imageUrl1;

    @Column(name = "image_url_2", columnDefinition = "LONGTEXT")
    private String imageUrl2;

    @Column(name = "image_url_3", columnDefinition = "LONGTEXT")
    private String imageUrl3;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<MaintenanceTicketNote> notes = new ArrayList<>();

    protected MaintenanceTicket() {
    }

    public MaintenanceTicket(
            String resourceName,
            String resourceLocation,
            String category,
            String description,
            String priority,
            String contactName,
            String contactEmail,
            String contactPhone,
            String status,
            String imageUrl1,
            String imageUrl2,
            String imageUrl3) {
        this.resourceName = resourceName;
        this.resourceLocation = resourceLocation;
        this.category = category;
        this.description = description;
        this.priority = priority;
        this.contactName = contactName;
        this.contactEmail = contactEmail;
        this.contactPhone = contactPhone;
        this.status = status;
        this.imageUrl1 = imageUrl1;
        this.imageUrl2 = imageUrl2;
        this.imageUrl3 = imageUrl3;
    }

    public Long getId() {
        return id;
    }

    public String getResourceName() {
        return resourceName;
    }

    public String getResourceLocation() {
        return resourceLocation;
    }

    public String getCategory() {
        return category;
    }

    public String getDescription() {
        return description;
    }

    public String getPriority() {
        return priority;
    }

    public String getStatus() {
        return status;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public String getAssignedTo() {
        return assignedTo;
    }

    public String getContactName() {
        return contactName;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public String getImageUrl1() {
        return imageUrl1;
    }

    public String getImageUrl2() {
        return imageUrl2;
    }

    public String getImageUrl3() {
        return imageUrl3;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public List<MaintenanceTicketNote> getNotes() {
        return notes;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }
}
