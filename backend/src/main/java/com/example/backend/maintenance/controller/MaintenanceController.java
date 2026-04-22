package com.example.backend.maintenance.controller;

import com.example.backend.maintenance.dto.CreateTicketNoteRequest;
import com.example.backend.maintenance.dto.MaintenanceTicketNoteResponse;
import com.example.backend.maintenance.dto.MaintenanceTicketResponse;
import com.example.backend.maintenance.dto.UpdateTicketStatusRequest;
import com.example.backend.maintenance.service.MaintenanceService;
import java.util.List;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/maintenance/tickets")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    public MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public MaintenanceTicketResponse createTicket(
            @RequestParam String resourceName,
            @RequestParam String resourceLocation,
            @RequestParam String category,
            @RequestParam String description,
            @RequestParam String priority,
            @RequestParam String contactName,
            @RequestParam String contactEmail,
            @RequestParam String contactPhone,
            @RequestParam(value = "images", required = false) List<MultipartFile> images) {
        return maintenanceService.createTicket(
                resourceName,
                resourceLocation,
                category,
                description,
                priority,
                contactName,
                contactEmail,
                contactPhone,
                images);
    }

    @GetMapping("/my")
    public List<MaintenanceTicketResponse> myTickets(
            @RequestParam(value = "email", required = false) String email) {
        return maintenanceService.getMyTickets(email);
    }

    @GetMapping("/all")
    public List<MaintenanceTicketResponse> allTickets() {
        return maintenanceService.getAllTickets();
    }

    @PutMapping("/{ticketId}/status")
    public MaintenanceTicketResponse updateStatus(
            @PathVariable Long ticketId,
            @RequestBody UpdateTicketStatusRequest request) {
        return maintenanceService.updateStatus(ticketId, request);
    }

    @PostMapping("/{ticketId}/notes")
    public MaintenanceTicketNoteResponse addNote(
            @PathVariable Long ticketId,
            @RequestBody CreateTicketNoteRequest request) {
        return maintenanceService.addNote(ticketId, request.content(), request.author());
    }
}
