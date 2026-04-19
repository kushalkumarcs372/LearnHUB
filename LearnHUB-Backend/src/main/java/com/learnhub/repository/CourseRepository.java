package com.learnhub.repository;

import com.learnhub.entity.Course;
import com.learnhub.entity.Course.CourseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByInstructorId(Long instructorId);
    List<Course> findByCategoryId(Long categoryId);  // UPDATED: Changed from String to Long
    List<Course> findByTitleContainingIgnoreCase(String title);
    List<Course> findByStatus(CourseStatus status);
    long countByStatus(CourseStatus status);

    // Public catalog helpers (published-only)
    Optional<Course> findByIdAndStatus(Long id, CourseStatus status);
    List<Course> findByStatusAndCategoryId(CourseStatus status, Long categoryId);
    List<Course> findByStatusAndTitleContainingIgnoreCase(CourseStatus status, String title);
}
