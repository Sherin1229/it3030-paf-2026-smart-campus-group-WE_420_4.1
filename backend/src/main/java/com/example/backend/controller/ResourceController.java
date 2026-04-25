package com.example.backend.controller;

import com.example.backend.dto.ResourceDTO;
import com.example.backend.model.Resource;
import com.example.backend.model.ResourceStatus;
import com.example.backend.model.ResourceType;
import com.example.backend.service.ResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/resources")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://10.50.20.47:5173", "http://10.199.20.47:5173", "http://172.28.27.15:5173"})
public class ResourceController {

    private final ResourceService resourceService;

    // GET all resources with optional filters
    @GetMapping
    public ResponseEntity<List<Resource>> getAllResources(
            @RequestParam(required = false) ResourceType type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) ResourceStatus status,
            @RequestParam(required = false) Integer minCapacity) {

        if (type != null) return ResponseEntity.ok(resourceService.getResourcesByType(type));
        if (location != null) return ResponseEntity.ok(resourceService.getResourcesByLocation(location));
        if (status != null) return ResponseEntity.ok(resourceService.getResourcesByStatus(status));
        if (minCapacity != null) return ResponseEntity.ok(resourceService.getResourcesByMinCapacity(minCapacity));

        return ResponseEntity.ok(resourceService.getAllResources());
    }

    // GET single resource by ID
    @GetMapping("/{id}")
    public ResponseEntity<Resource> getResourceById(@PathVariable Long id) {
        return resourceService.getResourceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST create new resource (Admin)
    @PostMapping
    public ResponseEntity<Resource> createResource(@Valid @RequestBody ResourceDTO dto) {
        System.out.println("DEBUG: Creating resource: " + dto.getName() + " (Code: " + dto.getCode() + ", Type: " + dto.getType() + ")");
        try {
            Resource created = resourceService.createResource(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            System.err.println("ERROR: Failed to create resource: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    // PUT update resource (Admin)
    @PutMapping("/{id}")
    public ResponseEntity<Resource> updateResource(
            @PathVariable Long id,
            @Valid @RequestBody ResourceDTO dto) {
        return resourceService.updateResource(id, dto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // PATCH update status only (Admin)
    @PatchMapping("/{id}/status")
    public ResponseEntity<Resource> updateStatus(
            @PathVariable Long id,
            @RequestParam ResourceStatus status) {
        return resourceService.updateStatus(id, status)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE resource (Admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        if (resourceService.deleteResource(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}