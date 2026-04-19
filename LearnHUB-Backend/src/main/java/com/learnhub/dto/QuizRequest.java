package com.learnhub.dto;

import lombok.Data;
import java.util.List;

@Data
public class QuizRequest {
    private Long courseId;
    private String title;
    private Integer timeLimit; // in minutes
    private Integer passingScore; // percentage
    private Integer maxAttempts;
    private List<QuestionDTO> questions;
}