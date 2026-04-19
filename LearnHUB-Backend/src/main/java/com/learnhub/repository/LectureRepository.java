package com.learnhub.repository;

import com.learnhub.entity.Lecture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LectureRepository extends JpaRepository<Lecture, Long> {
    List<Lecture> findByCourseIdOrderByOrderNumberAsc(Long courseId);
    int countByCourseId(Long courseId);
}