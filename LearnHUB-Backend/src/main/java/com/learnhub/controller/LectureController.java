package com.learnhub.controller;

import com.learnhub.dto.LectureRequest;
import com.learnhub.entity.Lecture;
import com.learnhub.security.JwtUtil;
import com.learnhub.service.LectureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lectures")
@CrossOrigin(origins = "*")
public class LectureController {

    @Autowired
    private LectureService lectureService;

    @Autowired
    private JwtUtil jwtUtil;

    // Get all lectures for a specific course (Public - for enrolled students)
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Lecture>> getCourseLectures(@PathVariable Long courseId) {
        return ResponseEntity.ok(lectureService.getCourseLectures(courseId));
    }

    // Get a specific lecture by ID
    @GetMapping("/{id}")
    public ResponseEntity<Lecture> getLecture(@PathVariable Long id) {
        return ResponseEntity.ok(lectureService.getLectureById(id));
    }

    // Create a new lecture (Instructor only)
    @PostMapping
    public ResponseEntity<Lecture> createLecture(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody LectureRequest request) {
        String token = authHeader.substring(7);
        Long instructorId = jwtUtil.extractUserId(token);
        Lecture lecture = lectureService.createLecture(instructorId, request);
        return ResponseEntity.ok(lecture);
    }

    // Update an existing lecture (Instructor only)
    @PutMapping("/{id}")
    public ResponseEntity<Lecture> updateLecture(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody LectureRequest request) {
        String token = authHeader.substring(7);
        Long instructorId = jwtUtil.extractUserId(token);
        Lecture lecture = lectureService.updateLecture(id, instructorId, request);
        return ResponseEntity.ok(lecture);
    }

    // Update lecture order (Instructor only)
    @PutMapping("/{id}/order")
    public ResponseEntity<String> updateLectureOrder(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Integer> body) {
        String token = authHeader.substring(7);
        Long instructorId = jwtUtil.extractUserId(token);
        lectureService.updateLectureOrder(id, instructorId, body.get("orderNumber"));
        return ResponseEntity.ok("Lecture order updated successfully");
    }

    // Delete a lecture (Instructor only)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteLecture(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long instructorId = jwtUtil.extractUserId(token);
        lectureService.deleteLecture(id, instructorId);
        return ResponseEntity.ok("Lecture deleted successfully");
    }

    // Get lecture count for a course
    @GetMapping("/course/{courseId}/count")
    public ResponseEntity<Integer> getLectureCount(@PathVariable Long courseId) {
        int count = lectureService.getLectureCount(courseId);
        return ResponseEntity.ok(count);
    }
}