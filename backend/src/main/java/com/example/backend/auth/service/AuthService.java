package com.example.backend.auth.service;

import com.example.backend.auth.dto.AuthResponse;
import com.example.backend.auth.dto.LoginRequest;
import com.example.backend.auth.dto.RegisterRequest;
import com.example.backend.auth.model.UserAccount;
import com.example.backend.auth.repository.UserAccountRepository;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private static final String ADMIN_EMAIL = "admin@campushub.edu";
    private static final String ADMIN_PASSWORD = "Admin@123";
    private static final String ADMIN_NAME = "Campus Admin";

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.email());
        String name = safeTrim(request.name());
        String password = safeTrim(request.password());

        if (email.isBlank() || name.isBlank() || password.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name, email and password are required.");
        }

        if (ADMIN_EMAIL.equals(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This email is reserved for the admin account.");
        }

        if (userAccountRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Account already exists for this email.");
        }

        UserAccount newUser = new UserAccount(name, email, passwordEncoder.encode(password), "USER", "LOCAL");
        UserAccount savedUser = userAccountRepository.save(newUser);

        return toResponse(savedUser);
    }

    public AuthResponse login(LoginRequest request) {
        String email = normalizeEmail(request.email());
        String password = safeTrim(request.password());

        if (email.isBlank() || password.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email and password are required.");
        }

        if (isAdminCredentials(email, password)) {
            return new AuthResponse(ADMIN_NAME, ADMIN_EMAIL, "ADMIN", "LOCAL");
        }

        UserAccount user = userAccountRepository
                .findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials."));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials.");
        }

        return toResponse(user);
    }

    private AuthResponse toResponse(UserAccount user) {
        return new AuthResponse(user.getName(), user.getEmail(), user.getRole(), user.getProvider());
    }

    private boolean isAdminCredentials(String email, String password) {
        return ADMIN_EMAIL.equals(email) && ADMIN_PASSWORD.equals(password);
    }

    private String normalizeEmail(String email) {
        return safeTrim(email).toLowerCase(Locale.ROOT);
    }

    private String safeTrim(String value) {
        return value == null ? "" : value.trim();
    }
}
