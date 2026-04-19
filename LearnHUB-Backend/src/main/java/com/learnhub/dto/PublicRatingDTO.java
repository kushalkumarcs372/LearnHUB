package com.learnhub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PublicRatingDTO {
    private String name;
    private Integer rating;
    private String comment;
    private Boolean recommend;
    private Integer easeOfUse;
    private Integer contentQuality;
    private LocalDateTime updatedAt;
}

