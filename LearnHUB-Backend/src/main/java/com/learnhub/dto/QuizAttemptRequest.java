package com.learnhub.dto;

import lombok.Data;
import java.util.Map;

@Data
public class QuizAttemptRequest {
    private Long quizId;
    private Map<String, String> answers; // questionId -> selectedAnswer (A/B/C/D)
    private Integer timeTaken; // in seconds
}