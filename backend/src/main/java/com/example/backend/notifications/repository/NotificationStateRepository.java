package com.example.backend.notifications.repository;

import com.example.backend.notifications.model.NotificationState;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationStateRepository extends JpaRepository<NotificationState, Long> {

    Optional<NotificationState> findByRecipientEmailAndSourceTypeAndSourceId(
            String recipientEmail,
            String sourceType,
            Long sourceId);
}
