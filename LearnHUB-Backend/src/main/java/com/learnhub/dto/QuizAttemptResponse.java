package com.learnhub.dto;

import lombok.Data;

@Data
public class QuizAttemptResponse {
    private Long attemptId;
    private Integer score;
    private Integer correctAnswers;
    private Integer totalQuestions;
    private Boolean passed;
    private Integer passingScore;
    private Integer timeTaken;

    // If passing this quiz completes the course, a certificate can be issued automatically.
    private Long courseId;
    private Boolean certificateGenerated;
    private String certificateId;
}
