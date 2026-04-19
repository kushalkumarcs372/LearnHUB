package com.learnhub.dto;

import lombok.Data;

@Data
public class GuideRequestDTO {
    private Long courseId;
    private Long instructorId;
    private String topic;
    private String description;
}