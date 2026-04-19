package com.learnhub.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.learnhub.dto.QuizAttemptRequest;
import com.learnhub.dto.QuizAttemptResponse;
import com.learnhub.entity.Certificate;
import com.learnhub.entity.Question;
import com.learnhub.entity.Quiz;
import com.learnhub.entity.QuizAttempt;
import com.learnhub.entity.User;
import com.learnhub.repository.CertificateRepository;
import com.learnhub.repository.QuestionRepository;
import com.learnhub.repository.QuizAttemptRepository;
import com.learnhub.repository.QuizRepository;
import com.learnhub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class QuizAttemptService {

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private CertificateService certificateService;

    @Autowired
    private CertificateRepository certificateRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Transactional
    public QuizAttemptResponse submitQuizAttempt(Long studentId, QuizAttemptRequest request) {
        // Get quiz and student
        Quiz quiz = quizRepository.findById(request.getQuizId())
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Check if student has exceeded max attempts
        int attemptCount = quizAttemptRepository.countByStudentIdAndQuizId(studentId, request.getQuizId());
        if (attemptCount >= quiz.getMaxAttempts()) {
            throw new RuntimeException("Maximum attempts exceeded for this quiz");
        }

        // Get all questions for the quiz
        List<Question> questions = questionRepository.findByQuizIdOrderByOrderNumberAsc(request.getQuizId());

        // Calculate score
        int correctAnswers = 0;
        Map<String, String> studentAnswers = request.getAnswers();

        for (Question question : questions) {
            String studentAnswer = studentAnswers.get(question.getId().toString());
            if (studentAnswer != null && studentAnswer.equalsIgnoreCase(question.getCorrectAnswer())) {
                correctAnswers++;
            }
        }

        int totalQuestions = questions.size();
        int scorePercentage = (totalQuestions > 0) ? (correctAnswers * 100) / totalQuestions : 0;
        boolean passed = scorePercentage >= quiz.getPassingScore();

        // Create quiz attempt
        QuizAttempt attempt = new QuizAttempt();
        attempt.setQuiz(quiz);
        attempt.setStudent(student);
        attempt.setScore(scorePercentage);
        attempt.setTotalQuestions(totalQuestions);
        attempt.setCorrectAnswers(correctAnswers);
        attempt.setTimeTaken(request.getTimeTaken());
        attempt.setPassed(passed);
        attempt.setSubmittedAt(LocalDateTime.now());

        // Store answers as JSON
        try {
            String answersJson = objectMapper.writeValueAsString(studentAnswers);
            attempt.setAnswers(answersJson);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error processing answers");
        }

        attempt = quizAttemptRepository.save(attempt);

        // Create response
        QuizAttemptResponse response = new QuizAttemptResponse();
        response.setAttemptId(attempt.getId());
        response.setScore(scorePercentage);
        response.setCorrectAnswers(correctAnswers);
        response.setTotalQuestions(totalQuestions);
        response.setPassed(passed);
        response.setPassingScore(quiz.getPassingScore());
        response.setTimeTaken(request.getTimeTaken());
        response.setCourseId(quiz.getCourse().getId());
        response.setCertificateGenerated(false);

        if (passed) {
            try {
                Certificate cert = certificateService.generateCertificate(studentId, quiz.getCourse().getId());
                response.setCertificateGenerated(true);
                response.setCertificateId(cert.getCertificateId());
            } catch (RuntimeException ex) {
                // If already generated (or not yet eligible because other quizzes exist), surface existing certificate if present.
                certificateRepository.findByStudentIdAndCourseId(studentId, quiz.getCourse().getId())
                        .ifPresent(existing -> response.setCertificateId(existing.getCertificateId()));
            }
        }

        return response;
    }

    public List<QuizAttempt> getStudentQuizAttempts(Long studentId, Long quizId) {
        return quizAttemptRepository.findByStudentIdAndQuizId(studentId, quizId);
    }

    public List<QuizAttempt> getAllStudentAttempts(Long studentId) {
        return quizAttemptRepository.findByStudentIdOrderByAttemptedAtDesc(studentId);
    }

    public List<QuizAttempt> getQuizAttempts(Long quizId) {
        return quizAttemptRepository.findByQuizIdOrderByAttemptedAtDesc(quizId);
    }

    public QuizAttempt getAttemptById(Long attemptId) {
        return quizAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Quiz attempt not found"));
    }

    public boolean hasPassedQuiz(Long studentId, Long quizId) {
        return quizAttemptRepository.existsByStudentIdAndQuizIdAndPassedTrue(studentId, quizId);
    }
}
