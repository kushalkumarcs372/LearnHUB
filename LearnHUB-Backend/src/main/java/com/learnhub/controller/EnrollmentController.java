package com.learnhub.controller;

import com.learnhub.entity.Enrollment;
import com.learnhub.security.JwtUtil;
import com.learnhub.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "*")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/enroll/{courseId}")
    public ResponseEntity<Enrollment> enrollInCourse(
            @PathVariable Long courseId,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long studentId = jwtUtil.extractUserId(token);
        Enrollment enrollment = enrollmentService.enrollInCourse(studentId, courseId);
        return ResponseEntity.ok(enrollment);
    }

    @GetMapping("/my-enrollments")
    public ResponseEntity<List<Enrollment>> getMyEnrollments(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long studentId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(enrollmentService.getStudentEnrollments(studentId));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Enrollment>> getCourseEnrollments(@PathVariable Long courseId) {
        return ResponseEntity.ok(enrollmentService.getCourseEnrollments(courseId));
    }

    @PutMapping("/{enrollmentId}/progress")
    public ResponseEntity<String> updateProgress(
            @PathVariable Long enrollmentId,
            @RequestBody Map<String, Integer> body) {
        enrollmentService.updateProgress(enrollmentId, body.get("progressPercent"));
        return ResponseEntity.ok("Progress updated");
    }

    @PostMapping("/{enrollmentId}/premium")
    public ResponseEntity<String> purchasePremium(
            @PathVariable Long enrollmentId,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long studentId = jwtUtil.extractUserId(token);
        enrollmentService.purchasePremiumAccess(studentId, enrollmentId);
        return ResponseEntity.ok("Premium access granted");
    }
}
