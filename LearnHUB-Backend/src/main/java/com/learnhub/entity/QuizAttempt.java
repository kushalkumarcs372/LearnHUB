package com.learnhub.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "quiz_attempts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Column(name = "score", nullable = false)
    private Integer score;

    @Column(name = "total_questions", nullable = false)
    private Integer totalQuestions;

    @Column(name = "correct_answers", nullable = false)
    private Integer correctAnswers;

    @Column(name = "time_taken")
    private Integer timeTaken; // in seconds

    @Column(name = "passed", nullable = false)
    private Boolean passed;

    @Column(name = "attempted_at")
    private LocalDateTime attemptedAt;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "answers", length = 2000)
    private String answers; // JSON string storing student's answers

    @PrePersist
    protected void onCreate() {
        attemptedAt = LocalDateTime.now();
    }
}
