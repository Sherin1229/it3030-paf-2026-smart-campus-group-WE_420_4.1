package com.example.backend.maintenance.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "maintenance_ticket_notes")
public class MaintenanceTicketNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private MaintenanceTicket ticket;

    @Column(nullable = false)
    private String author;

    @Column(nullable = false, length = 2000)
    private String content;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    protected MaintenanceTicketNote() {
    }

    public MaintenanceTicketNote(MaintenanceTicket ticket, String author, String content) {
        this.ticket = ticket;
        this.author = author;
        this.content = content;
    }

    public Long getId() {
        return id;
    }

    public MaintenanceTicket getTicket() {
        return ticket;
    }

    public String getAuthor() {
        return author;
    }

    public String getContent() {
        return content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
