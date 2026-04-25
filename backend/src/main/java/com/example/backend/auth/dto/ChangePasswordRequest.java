package com.example.backend.auth.dto;

public record ChangePasswordRequest(String email, String currentPassword, String newPassword) {}
