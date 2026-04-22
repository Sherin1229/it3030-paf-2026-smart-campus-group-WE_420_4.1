package com.example.backend.bookings.controller;

import com.example.backend.bookings.dto.BookingResponse;
import com.example.backend.bookings.dto.CreateBookingRequest;
import com.example.backend.bookings.service.BookingService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public BookingResponse create(@RequestBody CreateBookingRequest request) {
        return bookingService.createBooking(request);
    }
}
