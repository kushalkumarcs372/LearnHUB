package com.learnhub.dto;

import lombok.Data;

@Data
public class CourseRequest {
    private String title;
    private String description;
    private Long categoryId;  // CHANGED: from String category to Long categoryId
    private Double price;
}