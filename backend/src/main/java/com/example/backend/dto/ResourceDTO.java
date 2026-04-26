package com.example.backend.dto;

import com.example.backend.model.ResourceStatus;
import com.example.backend.model.ResourceType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ResourceDTO {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Resource code is required")
    private String code;

    @NotNull(message = "Type is required")
    private ResourceType type;

    @Min(value = 0, message = "Capacity must be 0 or more")
    private Integer capacity;

    @NotBlank(message = "Location is required")
    private String location;

    private String availabilityWindow;

    private ResourceStatus status;

    private String description;
}