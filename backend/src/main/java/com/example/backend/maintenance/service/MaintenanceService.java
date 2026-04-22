package com.example.backend.maintenance.service;

import com.example.backend.maintenance.dto.MaintenanceTicketNoteResponse;
import com.example.backend.maintenance.dto.MaintenanceTicketResponse;
import com.example.backend.maintenance.dto.UpdateTicketStatusRequest;
import com.example.backend.maintenance.model.MaintenanceTicket;
import com.example.backend.maintenance.model.MaintenanceTicketNote;
import com.example.backend.maintenance.repository.MaintenanceTicketNoteRepository;
import com.example.backend.maintenance.repository.MaintenanceTicketRepository;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class MaintenanceService {

    private static final Set<String> ALLOWED_STATUSES =
            Set.of("OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED", "REJECTED");

    private final MaintenanceTicketRepository ticketRepository;
    private final MaintenanceTicketNoteRepository noteRepository;

    public MaintenanceService(
            MaintenanceTicketRepository ticketRepository,
            MaintenanceTicketNoteRepository noteRepository) {
        this.ticketRepository = ticketRepository;
        this.noteRepository = noteRepository;
    }

    public MaintenanceTicketResponse createTicket(
            String resourceName,
            String resourceLocation,
            String category,
            String description,
            String priority,
            String contactName,
            String contactEmail,
            String contactPhone,
            List<MultipartFile> images) {

        String cleanResourceName = safeTrim(resourceName);
        String cleanResourceLocation = safeTrim(resourceLocation);
        String cleanCategory = safeTrim(category);
        String cleanDescription = safeTrim(description);
        String cleanPriority = safeTrim(priority);
        String cleanContactName = safeTrim(contactName);
        String cleanContactEmail = safeTrim(contactEmail).toLowerCase(Locale.ROOT);
        String cleanContactPhone = safeTrim(contactPhone);

        if (cleanResourceName.isBlank()
                || cleanResourceLocation.isBlank()
                || cleanCategory.isBlank()
                || cleanDescription.isBlank()
                || cleanPriority.isBlank()
                || cleanContactName.isBlank()
                || cleanContactEmail.isBlank()
                || cleanContactPhone.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "All required fields must be provided.");
        }

        if (cleanDescription.length() < 10) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Description must be at least 10 characters.");
        }

        List<String> encodedImages = encodeImages(images);

        MaintenanceTicket ticket = new MaintenanceTicket(
                cleanResourceName,
                cleanResourceLocation,
                cleanCategory,
                cleanDescription,
                cleanPriority,
                cleanContactName,
                cleanContactEmail,
                cleanContactPhone,
                "OPEN",
                imageAt(encodedImages, 0),
                imageAt(encodedImages, 1),
                imageAt(encodedImages, 2));

        MaintenanceTicket saved = ticketRepository.save(ticket);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<MaintenanceTicketResponse> getAllTickets() {
        return ticketRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MaintenanceTicketResponse> getMyTickets(String email) {
        String cleanEmail = safeTrim(email).toLowerCase(Locale.ROOT);
        if (cleanEmail.isBlank()) {
            return getAllTickets();
        }
        return ticketRepository.findByContactEmailOrderByCreatedAtDesc(cleanEmail).stream()
                .map(this::toResponse)
                .toList();
    }

    public MaintenanceTicketResponse updateStatus(Long ticketId, UpdateTicketStatusRequest request) {
        MaintenanceTicket ticket = findTicket(ticketId);
        String newStatus = safeTrim(request.status()).toUpperCase(Locale.ROOT);

        if (!ALLOWED_STATUSES.contains(newStatus)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status value.");
        }

        if ("REJECTED".equals(newStatus) && safeTrim(request.rejectionReason()).isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rejection reason is required for REJECTED status.");
        }

        ticket.setStatus(newStatus);
        ticket.setAssignedTo(safeTrim(request.assignedTo()).isBlank() ? ticket.getAssignedTo() : safeTrim(request.assignedTo()));
        ticket.setRejectionReason("REJECTED".equals(newStatus) ? safeTrim(request.rejectionReason()) : null);

        return toResponse(ticketRepository.save(ticket));
    }

    public MaintenanceTicketNoteResponse addNote(Long ticketId, String content, String author) {
        MaintenanceTicket ticket = findTicket(ticketId);
        String cleanContent = safeTrim(content);
        if (cleanContent.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Note content is required.");
        }

        String cleanAuthor = safeTrim(author);
        if (cleanAuthor.isBlank()) {
            cleanAuthor = "Staff";
        }

        MaintenanceTicketNote note = noteRepository.save(new MaintenanceTicketNote(ticket, cleanAuthor, cleanContent));
        return toNoteResponse(note);
    }

    private MaintenanceTicket findTicket(Long ticketId) {
        return ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found."));
    }

    private MaintenanceTicketResponse toResponse(MaintenanceTicket ticket) {
        List<String> imageUrls = new ArrayList<>();
        if (notBlank(ticket.getImageUrl1())) imageUrls.add(ticket.getImageUrl1());
        if (notBlank(ticket.getImageUrl2())) imageUrls.add(ticket.getImageUrl2());
        if (notBlank(ticket.getImageUrl3())) imageUrls.add(ticket.getImageUrl3());

        List<MaintenanceTicketNoteResponse> notes = ticket.getNotes().stream()
                .map(this::toNoteResponse)
                .toList();

        return new MaintenanceTicketResponse(
                ticket.getId(),
                ticket.getResourceName(),
                ticket.getResourceLocation(),
                ticket.getCategory(),
                ticket.getDescription(),
                ticket.getPriority(),
                ticket.getStatus(),
                ticket.getRejectionReason(),
                ticket.getAssignedTo(),
                ticket.getContactName(),
                ticket.getContactEmail(),
                ticket.getContactPhone(),
                imageUrls,
                notes,
                ticket.getCreatedAt() != null ? ticket.getCreatedAt().toString() : null,
                ticket.getUpdatedAt() != null ? ticket.getUpdatedAt().toString() : null);
    }

    private MaintenanceTicketNoteResponse toNoteResponse(MaintenanceTicketNote note) {
        return new MaintenanceTicketNoteResponse(
                note.getId(),
                note.getAuthor(),
                note.getContent(),
                note.getCreatedAt() != null ? note.getCreatedAt().toString() : null);
    }

    private List<String> encodeImages(List<MultipartFile> images) {
        if (images == null || images.isEmpty()) {
            return List.of();
        }

        List<MultipartFile> realImages = images.stream()
                .filter(file -> file != null && !file.isEmpty())
                .limit(3)
                .toList();

        List<String> encoded = new ArrayList<>();
        for (MultipartFile file : realImages) {
            try {
                byte[] bytes = file.getBytes();
                if (bytes.length == 0) {
                    continue;
                }
                if (bytes.length > 5_000_000) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Each image must be 5MB or less.");
                }
                String type = notBlank(file.getContentType()) ? file.getContentType() : "image/jpeg";
                String dataUrl = "data:" + type + ";base64," + Base64.getEncoder().encodeToString(bytes);
                encoded.add(dataUrl);
            } catch (IOException ex) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to process image upload.");
            }
        }

        return encoded;
    }

    private String imageAt(List<String> images, int index) {
        return images.size() > index ? images.get(index) : null;
    }

    private boolean notBlank(String value) {
        return value != null && !value.isBlank();
    }

    private String safeTrim(String value) {
        return value == null ? "" : value.trim();
    }
}
