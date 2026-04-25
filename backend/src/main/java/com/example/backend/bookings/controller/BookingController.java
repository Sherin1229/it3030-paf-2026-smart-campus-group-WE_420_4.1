package com.example.backend.bookings.controller;

import com.example.backend.bookings.dto.BookingResponse;
import com.example.backend.bookings.dto.CreateBookingRequest;
import com.example.backend.bookings.service.BookingService;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://10.50.20.47:5173", "http://10.199.20.47:5173", "http://172.28.27.15:5173"})
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping("/my")
    public List<BookingResponse> getUserBookings(@RequestParam String email) {
        return bookingService.getUserBookings(email);
    }

    @GetMapping("/verify")
    public BookingResponse verifyBooking(@RequestParam String code) {
        return bookingService.verifyBooking(code);
    }

    @GetMapping
    public List<BookingResponse> getAll() {
        return bookingService.getAllBookings();
    }

    @PatchMapping("/{id}/status")
    public BookingResponse updateStatus(@PathVariable Long id, @RequestParam String status) {
        return bookingService.updateBookingStatus(id, status);
    }

    @PostMapping
    public BookingResponse create(@RequestBody CreateBookingRequest request) {
        return bookingService.createBooking(request);
    }

    @PostMapping("/check-in")
    public java.util.Map<String, String> checkIn(@RequestParam String email, @RequestParam String resourceCode) {
        bookingService.checkIn(email, resourceCode);
        return java.util.Collections.singletonMap("message", "Check-in successful! Welcome to the facility.");
    }
}
