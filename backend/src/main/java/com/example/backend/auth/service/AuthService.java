package com.example.backend.auth.service;

import com.example.backend.auth.dto.AuthResponse;
import com.example.backend.auth.dto.ForgotPasswordRequest;
import com.example.backend.auth.dto.GoogleLoginRequest;
import com.example.backend.auth.dto.LoginRequest;
import com.example.backend.auth.dto.RegisterRequest;
import com.example.backend.auth.dto.ResetPasswordRequest;
import com.example.backend.auth.dto.UpdateProfileRequest;
import com.example.backend.auth.dto.ChangePasswordRequest;
import com.example.backend.auth.dto.VerifyOtpRequest;
import com.example.backend.auth.model.UserAccount;
import com.example.backend.auth.repository.UserAccountRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Locale;
import java.util.Random;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
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
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Value("${google.client.id}")
    private String googleClientId;

    public AuthService(UserAccountRepository userAccountRepository, JavaMailSender mailSender) {
        this.userAccountRepository = userAccountRepository;
        this.mailSender = mailSender;
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
            return new AuthResponse(ADMIN_NAME, ADMIN_EMAIL, "ADMIN", "LOCAL", null);
        }

        UserAccount user = userAccountRepository
                .findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials."));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials.");
        }

        return toResponse(user);
    }

    public AuthResponse loginWithGoogle(GoogleLoginRequest request) {
        String idTokenString = request.idToken();
        if (idTokenString == null || idTokenString.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Google ID token is required.");
        }

        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken == null) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Google ID token.");
            }

            Payload payload = idToken.getPayload();
            String email = normalizeEmail(payload.getEmail());
            String name = (String) payload.get("name");

            UserAccount user = userAccountRepository.findByEmail(email)
                    .orElseGet(() -> {
                        UserAccount newUser = new UserAccount(
                                name != null ? name : "Campus User",
                                email,
                                passwordEncoder.encode("GOOGLE_AUTH_USER"),
                                "USER",
                                "GOOGLE"
                        );
                        return userAccountRepository.save(newUser);
                    });

            return toResponse(user);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error verifying Google token: " + e.getMessage());
        }
    }

    public void sendOtp(ForgotPasswordRequest request) {
        String email = normalizeEmail(request.email());
        UserAccount user = userAccountRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with this email."));

        String otp = String.format("%06d", new Random().nextInt(1000000));
        user.setOtpCode(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        userAccountRepository.save(user);

        sendEmail(email, "Smart Campus Hub - Password Reset OTP",
                "Your OTP for password reset is: " + otp + ". It will expire in 10 minutes.");
    }

    public void verifyOtp(VerifyOtpRequest request) {
        String email = normalizeEmail(request.email());
        UserAccount user = userAccountRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));

        if (user.getOtpCode() == null || !user.getOtpCode().equals(request.otp())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid OTP.");
        }

        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP has expired.");
        }
    }

    public void resetPassword(ResetPasswordRequest request) {
        verifyOtp(new VerifyOtpRequest(request.email(), request.otp()));

        String email = normalizeEmail(request.email());
        UserAccount user = userAccountRepository.findByEmail(email).get();

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        user.setOtpCode(null);
        user.setOtpExpiry(null);
        user.setProvider("LOCAL");
        userAccountRepository.save(user);
    }

    public AuthResponse updateProfile(String email, UpdateProfileRequest request) {
        UserAccount user = userAccountRepository.findByEmail(normalizeEmail(email))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));
        
        user.setName(safeTrim(request.name()));
        user.setBio(safeTrim(request.bio()));
        return toResponse(userAccountRepository.save(user));
    }

    public void changePassword(ChangePasswordRequest request) {
        UserAccount user = userAccountRepository.findByEmail(normalizeEmail(request.email()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));

        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Incorrect current password.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userAccountRepository.save(user);
    }

    private void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }

    private AuthResponse toResponse(UserAccount user) {
        return new AuthResponse(user.getName(), user.getEmail(), user.getRole(), user.getProvider(), user.getBio());
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
