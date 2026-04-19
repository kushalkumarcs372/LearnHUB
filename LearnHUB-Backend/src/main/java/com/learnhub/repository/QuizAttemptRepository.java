package com.learnhub.repository;

import com.learnhub.entity.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByStudentIdOrderByAttemptedAtDesc(Long studentId);
    List<QuizAttempt> findByQuizIdOrderByAttemptedAtDesc(Long quizId);
    List<QuizAttempt> findByStudentIdAndQuizId(Long studentId, Long quizId);
    int countByStudentIdAndQuizId(Long studentId, Long quizId);
    boolean existsByStudentIdAndQuizIdAndPassedTrue(Long studentId, Long quizId);
}