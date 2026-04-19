package com.learnhub.service;

import com.learnhub.dto.MaterialRequest;
import com.learnhub.entity.Course;
import com.learnhub.entity.Material;
import com.learnhub.repository.CourseRepository;
import com.learnhub.repository.MaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class MaterialService {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Value("${app.public.base-url:http://localhost:8080}")
    private String publicBaseUrl;

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private CourseRepository courseRepository;

    public List<Material> getCourseMaterials(Long courseId) {
        return materialRepository.findByCourseIdOrderByUploadedAtDesc(courseId);
    }

    public Material getMaterialById(Long id) {
        return materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found"));
    }

    @Transactional
    public Material createMaterial(Long instructorId, MaterialRequest request) {
        // Verify course exists and belongs to instructor
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (!course.getInstructor().getId().equals(instructorId)) {
            throw new RuntimeException("You don't have permission to add materials to this course");
        }

        Material material = new Material();
        material.setTitle(request.getTitle());
        material.setDescription(request.getDescription());
        material.setFileUrl(request.getFileUrl());
        material.setFileType(request.getFileType());
        material.setFileSize(request.getFileSize());
        material.setCourse(course);

        return materialRepository.save(material);
    }

    @Transactional
    public Material uploadMaterial(Long instructorId, Long courseId, String title, String description, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("File is required");
        }
        if (title == null || title.trim().isEmpty()) {
            throw new RuntimeException("Title is required");
        }

        // Verify course exists and belongs to instructor
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (!course.getInstructor().getId().equals(instructorId)) {
            throw new RuntimeException("You don't have permission to add materials to this course");
        }

        String originalFileName = file.getOriginalFilename() == null ? "material" : file.getOriginalFilename();
        String safeOriginal = originalFileName.replaceAll("[\\\\/]+", "_").trim();
        if (safeOriginal.isBlank()) safeOriginal = "material";

        String storedName = UUID.randomUUID() + "_" + safeOriginal;
        Path courseDir = Paths.get(uploadDir, "materials", String.valueOf(courseId)).toAbsolutePath().normalize();
        try {
            Files.createDirectories(courseDir);
            Path destination = courseDir.resolve(storedName).normalize();
            if (!destination.startsWith(courseDir)) {
                throw new RuntimeException("Invalid file path");
            }

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destination, StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage());
        }

        String storedRelative = Paths.get("materials", String.valueOf(courseId), storedName).toString().replace("\\", "/");

        Material material = new Material();
        material.setTitle(title);
        material.setDescription(description);
        material.setCourse(course);
        material.setFileType(file.getContentType());
        material.setFileSize(file.getSize());
        material.setStoredFilePath(storedRelative);
        material.setOriginalFileName(safeOriginal);
        material.setFileUrl("pending");

        material = materialRepository.save(material);
        material.setFileUrl(publicBaseUrl + "/api/materials/" + material.getId() + "/download");
        return materialRepository.save(material);
    }

    public Path resolveStoredMaterialPath(Material material) {
        if (material.getStoredFilePath() == null || material.getStoredFilePath().isBlank()) {
            throw new RuntimeException("Material is not stored on this server");
        }
        return Paths.get(uploadDir).toAbsolutePath().normalize().resolve(material.getStoredFilePath()).normalize();
    }

    @Transactional
    public Material updateMaterial(Long materialId, Long instructorId, MaterialRequest request) {
        Material material = getMaterialById(materialId);

        // Verify instructor owns the course
        if (!material.getCourse().getInstructor().getId().equals(instructorId)) {
            throw new RuntimeException("You don't have permission to update this material");
        }

        if (request.getTitle() != null && !request.getTitle().isEmpty()) {
            material.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            material.setDescription(request.getDescription());
        }
        if (request.getFileUrl() != null) {
            material.setFileUrl(request.getFileUrl());
        }
        if (request.getFileType() != null) {
            material.setFileType(request.getFileType());
        }
        if (request.getFileSize() != null) {
            material.setFileSize(request.getFileSize());
        }

        return materialRepository.save(material);
    }

    @Transactional
    public void deleteMaterial(Long materialId, Long instructorId) {
        Material material = getMaterialById(materialId);

        // Verify instructor owns the course
        if (!material.getCourse().getInstructor().getId().equals(instructorId)) {
            throw new RuntimeException("You don't have permission to delete this material");
        }

        materialRepository.delete(material);
    }
}
