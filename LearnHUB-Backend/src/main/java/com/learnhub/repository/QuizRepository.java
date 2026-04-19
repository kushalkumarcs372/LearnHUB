package com.learnhub.repository;

import com.learnhub.entity.Quiz;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByCourseId(Long courseId);

    @Query("select q from Quiz q left join fetch q.questions where q.id = :id")
    Optional<Quiz> findByIdWithQuestions(@Param("id") Long id);
}
