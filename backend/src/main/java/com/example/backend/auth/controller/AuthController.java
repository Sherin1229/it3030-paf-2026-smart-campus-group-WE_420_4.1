package com.example.backend.auth.controller;

import com.example.backend.auth.dto.AuthResponse;
import com.example.backend.auth.dto.ForgotPasswordRequest;
import com.example.backend.auth.dto.GoogleLoginRequest;
import com.example.backend.auth.dto.LoginRequest;
import com.example.backend.auth.dto.RegisterRequest;
import com.example.backend.auth.dto.ResetPasswordRequest;
import com.example.backend.auth.dto.VerifyOtpRequest;
import com.example.backend.auth.service.AuthService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://10.50.20.47:5173", "http://10.199.20.47:5173"})
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/google")
    public AuthResponse googleLogin(@RequestBody GoogleLoginRequest request) {
        return authService.loginWithGoogle(request);
    }

    @PostMapping("/forgot-password")
    public void forgotPassword(@RequestBody ForgotPasswordRequest request) {
        authService.sendOtp(request);
    }

    @PostMapping("/verify-otp")
    public void verifyOtp(@RequestBody VerifyOtpRequest request) {
        authService.verifyOtp(request);
    }

    @PostMapping("/reset-password")
    public void resetPassword(@RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
    }

    @PostMapping("/update-profile")
    public AuthResponse updateProfile(@org.springframework.web.bind.annotation.RequestParam String email, @RequestBody com.example.backend.auth.dto.UpdateProfileRequest request) {
        return authService.updateProfile(email, request);
    }

    @PostMapping("/change-password")
    public void changePassword(@RequestBody com.example.backend.auth.dto.ChangePasswordRequest request) {
        authService.changePassword(request);
    }
}
