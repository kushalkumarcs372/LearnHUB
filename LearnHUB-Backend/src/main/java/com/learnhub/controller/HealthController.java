package com.learnhub.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/")
    public Map<String, Object> welcome() {
        Map<String, Object> response = new HashMap<>();
        response.put("service", "LearnHub Backend API");
        response.put("version", "0.0.1-SNAPSHOT");
        response.put("status", "Running");
        response.put("message", "Welcome to LearnHub API! Visit /api/health for health check");
        response.put("timestamp", LocalDateTime.now());
        return response;
    }

    @GetMapping("/api/health")
    public Map<String, Object> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "LearnHub Backend is running successfully!");
        response.put("timestamp", LocalDateTime.now());
        response.put("service", "LearnHub Backend API");
        response.put("version", "0.0.1-SNAPSHOT");
        return response;
    }
}
