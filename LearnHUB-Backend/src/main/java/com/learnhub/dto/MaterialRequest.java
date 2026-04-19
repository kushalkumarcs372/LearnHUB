package com.learnhub.dto;

import lombok.Data;

@Data
public class MaterialRequest {
    private Long courseId;
    private String title;
    private String description;
    private String fileUrl;
    private String fileType; // PDF, DOCX, etc.
    private Long fileSize; // in bytes
}