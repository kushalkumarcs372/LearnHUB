package com.learnhub.controller;

import com.learnhub.dto.MaterialRequest;
import com.learnhub.entity.Material;
import com.learnhub.security.JwtUtil;
import com.learnhub.service.MaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/api/materials")
@CrossOrigin(origins = "*")
public class MaterialController {

    @Autowired
    private MaterialService materialService;

    @Autowired
    private JwtUtil jwtUtil;

    // Get all materials for a course (Public - for enrolled students)
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Material>> getCourseMaterials(@PathVariable Long courseId) {
        return ResponseEntity.ok(materialService.getCourseMaterials(courseId));
    }

    // Get a specific material by ID
    @GetMapping("/{id}")
    public ResponseEntity<Material> getMaterial(@PathVariable Long id) {
        return ResponseEntity.ok(materialService.getMaterialById(id));
    }

    // Upload/Create a new material (Instructor only)
    @PostMapping
    public ResponseEntity<Material> createMaterial(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody MaterialRequest request) {
        String token = authHeader.substring(7);
        Long instructorId = jwtUtil.extractUserId(token);
        Material material = materialService.createMaterial(instructorId, request);
        return ResponseEntity.ok(material);
    }

    // Upload a file and create material record (Instructor only)
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Material> uploadMaterial(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("courseId") Long courseId,
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestPart("file") MultipartFile file) {
        String token = authHeader.substring(7);
        Long instructorId = jwtUtil.extractUserId(token);
        Material material = materialService.uploadMaterial(instructorId, courseId, title, description, file);
        return ResponseEntity.ok(material);
    }

    // Download (or open inline) a stored material file
    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadMaterial(
            @PathVariable Long id,
            @RequestParam(value = "inline", defaultValue = "false") boolean inline) {
        Material material = materialService.getMaterialById(id);

        // If this material is an external link, redirect to it.
        if (material.getStoredFilePath() == null || material.getStoredFilePath().isBlank()) {
            return ResponseEntity.status(302)
                    .header(HttpHeaders.LOCATION, material.getFileUrl())
                    .build();
        }

        try {
            Path filePath = materialService.resolveStoredMaterialPath(material);
            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = material.getFileType();
            if (contentType == null || contentType.isBlank()) {
                contentType = Files.probeContentType(filePath);
            }
            if (contentType == null || contentType.isBlank()) {
                contentType = "application/octet-stream";
            }

            String filename = material.getOriginalFileName();
            if (filename == null || filename.isBlank()) {
                filename = "material-" + material.getId();
            }

            String encoded = URLEncoder.encode(filename, StandardCharsets.UTF_8).replace("+", "%20");
            String dispositionType = inline ? "inline" : "attachment";

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, dispositionType + "; filename*=UTF-8''" + encoded)
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Update material details (Instructor only)
    @PutMapping("/{id}")
    public ResponseEntity<Material> updateMaterial(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody MaterialRequest request) {
        String token = authHeader.substring(7);
        Long instructorId = jwtUtil.extractUserId(token);
        Material material = materialService.updateMaterial(id, instructorId, request);
        return ResponseEntity.ok(material);
    }

    // Delete a material (Instructor only)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMaterial(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long instructorId = jwtUtil.extractUserId(token);
        materialService.deleteMaterial(id, instructorId);
        return ResponseEntity.ok("Material deleted successfully");
    }
}
