package com.example.backend.service;

import com.example.backend.dto.ResourceDTO;
import com.example.backend.model.Resource;
import com.example.backend.model.ResourceStatus;
import com.example.backend.model.ResourceType;
import com.example.backend.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;

    // Get all resources
    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    // Get resource by ID
    public Optional<Resource> getResourceById(Long id) {
        return resourceRepository.findById(id);
    }

    // Search by type
    public List<Resource> getResourcesByType(ResourceType type) {
        return resourceRepository.findByType(type);
    }

    // Search by location
    public List<Resource> getResourcesByLocation(String location) {
        return resourceRepository.findByLocationContainingIgnoreCase(location);
    }

    // Search by status
    public List<Resource> getResourcesByStatus(ResourceStatus status) {
        return resourceRepository.findByStatus(status);
    }

    // Search by minimum capacity
    public List<Resource> getResourcesByMinCapacity(Integer capacity) {
        return resourceRepository.findByCapacityGreaterThanEqual(capacity);
    }

    // Create new resource (Admin)
    public Resource createResource(ResourceDTO dto) {
        if (resourceRepository.findByCode(dto.getCode()).isPresent()) {
            throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.CONFLICT, 
                "Resource with code " + dto.getCode() + " already exists."
            );
        }
        Resource resource = new Resource();
        resource.setName(dto.getName());
        resource.setCode(dto.getCode());
        resource.setType(dto.getType());
        resource.setCapacity(dto.getCapacity());
        resource.setLocation(dto.getLocation());
        resource.setAvailabilityWindow(dto.getAvailabilityWindow());
        resource.setStatus(dto.getStatus() != null ? dto.getStatus() : ResourceStatus.ACTIVE);
        resource.setDescription(dto.getDescription());
        return resourceRepository.save(resource);
    }

    // Update resource (Admin)
    public Optional<Resource> updateResource(Long id, ResourceDTO dto) {
        return resourceRepository.findById(id).map(resource -> {
            resource.setName(dto.getName());
            resource.setCode(dto.getCode());
            resource.setType(dto.getType());
            resource.setCapacity(dto.getCapacity());
            resource.setLocation(dto.getLocation());
            resource.setAvailabilityWindow(dto.getAvailabilityWindow());
            resource.setStatus(dto.getStatus());
            resource.setDescription(dto.getDescription());
            return resourceRepository.save(resource);
        });
    }

    // Update status only (Admin)
    public Optional<Resource> updateStatus(Long id, ResourceStatus status) {
        return resourceRepository.findById(id).map(resource -> {
            resource.setStatus(status);
            return resourceRepository.save(resource);
        });
    }

    // Delete resource (Admin)
    public boolean deleteResource(Long id) {
        if (resourceRepository.existsById(id)) {
            resourceRepository.deleteById(id);
            return true;
        }
        return false;
    }
}