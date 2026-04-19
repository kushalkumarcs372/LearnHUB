package com.learnhub.dto;

import lombok.Data;

@Data
public class LectureRequest {
    private Long courseId;
    private String title;
    private String content;
    private String imageUrl;
    private String videoUrl;
    private Integer orderNumber;
}
