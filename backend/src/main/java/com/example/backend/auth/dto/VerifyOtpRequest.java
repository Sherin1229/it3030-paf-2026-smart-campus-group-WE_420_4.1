package com.example.backend.auth.dto;

public record VerifyOtpRequest(String email, String otp) {
}
