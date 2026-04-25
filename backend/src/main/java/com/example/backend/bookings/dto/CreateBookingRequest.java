package com.example.backend.bookings.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
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

    public CreateBookingRequest() {
    }

    public CreateBookingRequest(
            String requesterEmail,
            String resourceId,
            String resourceName,
            String resourceType,
            String date,
            String startTime,
            String endTime,
            String purpose,
            Integer attendees) {
        this.requesterEmail = requesterEmail;
        this.resourceId = resourceId;
        this.resourceName = resourceName;
        this.resourceType = resourceType;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.purpose = purpose;
        this.attendees = attendees;
    }

    public String getRequesterEmail() {
        return requesterEmail;
    }

    public String getResourceId() {
        return resourceId;
    }

    public String getResourceName() {
        return resourceName;
    }

    public String getResourceType() {
        return resourceType;
    }

    public String getDate() {
        return date;
    }

    public String getStartTime() {
        return startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public String getPurpose() {
        return purpose;
    }

    public Integer getAttendees() {
        return attendees;
    }

    public void setRequesterEmail(String requesterEmail) {
        this.requesterEmail = requesterEmail;
    }

    public void setResourceId(String resourceId) {
        this.resourceId = resourceId;
    }

    public void setResourceName(String resourceName) {
        this.resourceName = resourceName;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public void setAttendees(Integer attendees) {
        this.attendees = attendees;
    }
}
