package com.learnhub.dto;

import lombok.Data;

@Data
public class AppRatingRequest {
    private Integer rating; // 1..5
    private Boolean recommend;
    private Integer easeOfUse; // 1..5
    private Integer contentQuality; // 1..5
    private String comment;
}
