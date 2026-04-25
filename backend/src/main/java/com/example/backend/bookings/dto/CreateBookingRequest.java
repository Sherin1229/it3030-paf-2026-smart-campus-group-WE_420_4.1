package com.example.backend.bookings.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateBookingRequest {
    @JsonProperty("requesterEmail")
    private String requesterEmail;

    @JsonProperty("resourceId")
    private String resourceId;

    @JsonProperty("resourceName")
    private String resourceName;

    @JsonProperty("resourceType")
    private String resourceType;

    @JsonProperty("date")
    private String date;

    @JsonProperty("startTime")
    private String startTime;

    @JsonProperty("endTime")
    private String endTime;

    @JsonProperty("purpose")
    private String purpose;

    @JsonProperty("attendees")
    private Integer attendees;
}
