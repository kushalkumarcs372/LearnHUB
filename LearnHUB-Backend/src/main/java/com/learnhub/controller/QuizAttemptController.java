package com.learnhub.controller;

import com.learnhub.dto.QuizAttemptRequest;
import com.learnhub.dto.QuizAttemptResponse;
import com.learnhub.entity.QuizAttempt;
import com.learnhub.security.JwtUtil;
import com.learnhub.service.QuizAttemptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz-attempts")
@CrossOrigin(origins = "*")
public class QuizAttemptController {

    @Autowired
    private QuizAttemptService quizAttemptService;

    @Autowired
    private JwtUtil jwtUtil;

    // Submit a quiz attempt (Student)
    @PostMapping("/submit")
    public ResponseEntity<QuizAttemptResponse> submitQuizAttempt(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody QuizAttemptRequest request) {
        String token = authHeader.substring(7);
        Long studentId = jwtUtil.extractUserId(token);
        QuizAttemptResponse response = quizAttemptService.submitQuizAttempt(studentId, request);
        return ResponseEntity.ok(response);
    }

    // Get all attempts by a student for a specific quiz
    @GetMapping("/quiz/{quizId}/my-attempts")
    public ResponseEntity<List<QuizAttempt>> getMyQuizAttempts(
            @PathVariable Long quizId,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long studentId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(quizAttemptService.getStudentQuizAttempts(studentId, quizId));
    }

    // Get all attempts by the student (across all quizzes)
    @GetMapping("/my-attempts")
    public ResponseEntity<List<QuizAttempt>> getAllMyAttempts(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long studentId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(quizAttemptService.getAllStudentAttempts(studentId));
    }

    // Get a specific attempt by ID
    @GetMapping("/{attemptId}")
    public ResponseEntity<QuizAttempt> getAttempt(@PathVariable Long attemptId) {
        return ResponseEntity.ok(quizAttemptService.getAttemptById(attemptId));
    }

    // Get all attempts for a quiz (Instructor - to see all student attempts)
    @GetMapping("/quiz/{quizId}/all")
    public ResponseEntity<List<QuizAttempt>> getAllQuizAttempts(@PathVariable Long quizId) {
        return ResponseEntity.ok(quizAttemptService.getQuizAttempts(quizId));
    }

    // Check if student has passed a quiz
    @GetMapping("/quiz/{quizId}/has-passed")
    public ResponseEntity<Boolean> hasPassedQuiz(
            @PathVariable Long quizId,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long studentId = jwtUtil.extractUserId(token);
        boolean passed = quizAttemptService.hasPassedQuiz(studentId, quizId);
        return ResponseEntity.ok(passed);
    }
}