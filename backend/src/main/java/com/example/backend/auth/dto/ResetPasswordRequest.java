package com.example.backend.auth.dto;

public record ResetPasswordRequest(String email, String otp, String newPassword) {
}
