package com.learnhub.controller;

import com.learnhub.dto.QuizRequest;
import com.learnhub.entity.Quiz;
import com.learnhub.security.JwtUtil;
import com.learnhub.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@CrossOrigin(origins = "*")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @Autowired
    private JwtUtil jwtUtil;

    // Get all quizzes for a course (Public - for students)
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Quiz>> getCourseQuizzes(@PathVariable Long courseId) {
        return ResponseEntity.ok(quizService.getCourseQuizzes(courseId));
    }

    // Get a specific quiz with questions
    @GetMapping("/{id}")
    public ResponseEntity<Quiz> getQuiz(@PathVariable Long id) {
        return ResponseEntity.ok(quizService.getQuizById(id));
    }

    // Create a new quiz (Instructor only)
    @PostMapping
    public ResponseEntity<Quiz> createQuiz(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody QuizRequest request) {
        String token = authHeader.substring(7);
        Long instructorId = jwtUtil.extractUserId(token);
        Quiz quiz = quizService.createQuiz(instructorId, request);
        return ResponseEntity.ok(quiz);
    }

    // Update quiz details (Instructor only)
    @PutMapping("/{id}")
    public ResponseEntity<Quiz> updateQuiz(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody QuizRequest request) {
        String token = authHeader.substring(7);
        Long instructorId = jwtUtil.extractUserId(token);
        Quiz quiz = quizService.updateQuiz(id, instructorId, request);
        return ResponseEntity.ok(quiz);
    }

    // Delete a quiz (Instructor only)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteQuiz(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long instructorId = jwtUtil.extractUserId(token);
        quizService.deleteQuiz(id, instructorId);
        return ResponseEntity.ok("Quiz deleted successfully");
    }
}