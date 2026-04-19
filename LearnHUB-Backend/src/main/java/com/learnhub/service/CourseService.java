package com.learnhub.service;

import com.learnhub.dto.CourseRequest;
import com.learnhub.entity.Category;
import com.learnhub.entity.Course;
import com.learnhub.entity.Course.CourseStatus;
import com.learnhub.entity.User;
import com.learnhub.repository.CategoryRepository;
import com.learnhub.repository.CourseRepository;
import com.learnhub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Course> getAllPublishedCourses() {
        return courseRepository.findByStatus(CourseStatus.PUBLISHED);
    }

    public Course getPublishedCourseById(Long id) {
        return courseRepository.findByIdAndStatus(id, CourseStatus.PUBLISHED)
                .orElseThrow(() -> new RuntimeException("Course not found"));
    }

    public Course getCourseById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
    }

    public List<Course> getCoursesByInstructor(Long instructorId) {
        return courseRepository.findByInstructorId(instructorId);
    }

    public List<Course> searchCourses(String title) {
        return courseRepository.findByStatusAndTitleContainingIgnoreCase(CourseStatus.PUBLISHED, title);
    }

    public List<Course> getCoursesByCategory(Long categoryId) {
        return courseRepository.findByStatusAndCategoryId(CourseStatus.PUBLISHED, categoryId);
    }

    public Course createCourse(Long instructorId, CourseRequest request) {
        User instructor = userRepository.findById(instructorId)
                .orElseThrow(() -> new RuntimeException("Instructor not found"));

        Course course = new Course();
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());

        // Handle category - if categoryId is provided
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            course.setCategory(category);
        }

        course.setPrice(request.getPrice() != null ? request.getPrice() : 0.0);
        course.setInstructor(instructor);
        // For LearnHub, instructor-created courses should be visible to students immediately.
        course.setStatus(CourseStatus.PUBLISHED);

        return courseRepository.save(course);
    }

    public Course updateCourse(Long courseId, Long instructorId, CourseRequest request) {
        Course course = getCourseById(courseId);

        if (!course.getInstructor().getId().equals(instructorId)) {
            throw new RuntimeException("You don't have permission to update this course");
        }

        if (request.getTitle() != null && !request.getTitle().isEmpty()) {
            course.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            course.setDescription(request.getDescription());
        }
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            course.setCategory(category);
        }
        if (request.getPrice() != null) {
            course.setPrice(request.getPrice());
        }

        return courseRepository.save(course);
    }

    public void publishCourse(Long courseId, Long instructorId) {
        Course course = getCourseById(courseId);

        if (!course.getInstructor().getId().equals(instructorId)) {
            throw new RuntimeException("You don't have permission to publish this course");
        }

        course.setStatus(CourseStatus.PUBLISHED);
        courseRepository.save(course);
    }

    public void deleteCourse(Long courseId, Long instructorId) {
        Course course = getCourseById(courseId);

        if (!course.getInstructor().getId().equals(instructorId)) {
            throw new RuntimeException("You don't have permission to delete this course");
        }

        courseRepository.delete(course);
    }
}
