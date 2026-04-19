package com.learnhub.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "materials")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(name = "file_url", nullable = false)
    private String fileUrl;

    // When using backend local storage uploads, we store the relative file path here.
    @Column(name = "stored_file_path", length = 1000)
    private String storedFilePath;

    @Column(name = "original_file_name", length = 500)
    private String originalFileName;

    @Column(name = "file_type")
    private String fileType; // PDF, DOCX, etc.

    @Column(name = "file_size")
    private Long fileSize; // in bytes

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    @JsonIgnore
    private Course course;

    @PrePersist
    protected void onCreate() {
        uploadedAt = LocalDateTime.now();
    }
}
