package com.learnhub.controller;

import com.learnhub.dto.CourseRequest;
import com.learnhub.entity.Course;
import com.learnhub.security.JwtUtil;
import com.learnhub.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/public")
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllPublishedCourses());
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<Course> getCourse(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getPublishedCourseById(id));
    }

    @GetMapping("/public/search")
    public ResponseEntity<List<Course>> searchCourses(@RequestParam String title) {
        return ResponseEntity.ok(courseService.searchCourses(title));
    }

    // FIXED: Changed from String to Long
    @GetMapping("/public/category/{categoryId}")
    public ResponseEntity<List<Course>> getCoursesByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(courseService.getCoursesByCategory(categoryId));
    }

    @GetMapping("/instructor/my-courses")
    public ResponseEntity<List<Course>> getInstructorCourses(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long instructorId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(courseService.getCoursesByInstructor(instructorId));
    }

    @PostMapping
    public ResponseEntity<Course> createCourse(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody CourseRequest request) {
        String token = authHeader.substring(7);
        Long instructorId = jwtUtil.extractUserId(token);
        Course course = courseService.createCourse(instructorId, request);
        return ResponseEntity.ok(course);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody CourseRequest request) {
        String token = authHeader.substring(7);
        Long instructorId = jwtUtil.extractUserId(token);
        Course course = courseService.updateCourse(id, instructorId, request);
        return ResponseEntity.ok(course);
    }

    @PutMapping("/{id}/publish")
    public ResponseEntity<String> publishCourse(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long instructorId = jwtUtil.extractUserId(token);
        courseService.publishCourse(id, instructorId);
        return ResponseEntity.ok("Course published successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCourse(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long instructorId = jwtUtil.extractUserId(token);
        courseService.deleteCourse(id, instructorId);
        return ResponseEntity.ok("Course deleted successfully");
    }
}
