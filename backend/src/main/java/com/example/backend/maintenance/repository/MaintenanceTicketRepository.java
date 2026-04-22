package com.example.backend.maintenance.repository;

import com.example.backend.maintenance.model.MaintenanceTicket;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaintenanceTicketRepository extends JpaRepository<MaintenanceTicket, Long> {

    List<MaintenanceTicket> findAllByOrderByCreatedAtDesc();

    List<MaintenanceTicket> findByContactEmailOrderByCreatedAtDesc(String contactEmail);
}
