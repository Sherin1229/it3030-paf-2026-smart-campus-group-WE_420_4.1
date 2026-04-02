package com.example.backend.auth.repository;

import com.example.backend.auth.model.UserAccount;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {
    boolean existsByEmail(String email);

    Optional<UserAccount> findByEmail(String email);
}
