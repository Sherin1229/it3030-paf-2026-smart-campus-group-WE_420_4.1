package com.example.backend.maintenance.repository;

import com.example.backend.maintenance.model.MaintenanceTicketNote;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaintenanceTicketNoteRepository extends JpaRepository<MaintenanceTicketNote, Long> {
}
