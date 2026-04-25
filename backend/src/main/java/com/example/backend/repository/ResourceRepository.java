package com.example.backend.repository;

import com.example.backend.model.Resource;
import com.example.backend.model.ResourceStatus;
import com.example.backend.model.ResourceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    Optional<Resource> findByCode(String code);

    List<Resource> findByType(ResourceType type);

    List<Resource> findByStatus(ResourceStatus status);

    List<Resource> findByLocationContainingIgnoreCase(String location);

    List<Resource> findByTypeAndStatus(ResourceType type, ResourceStatus status);

    List<Resource> findByCapacityGreaterThanEqual(Integer capacity);

    long countByStatus(ResourceStatus status);
}