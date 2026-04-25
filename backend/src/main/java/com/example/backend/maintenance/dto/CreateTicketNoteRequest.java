package com.example.backend.maintenance.dto;

public record CreateTicketNoteRequest(
        String content,
        String author) {
}
