package com.learnhub.controller;

import com.learnhub.dto.SessionScheduleDTO;
import com.learnhub.entity.GuideSession;
import com.learnhub.security.JwtUtil;
import com.learnhub.service.GuideSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/guide-sessions")
@CrossOrigin(origins = "*")
public class GuideSessionController {

    @Autowired
    private GuideSessionService sessionService;

    @Autowired
    private JwtUtil jwtUtil;

    // Instructor schedules a session
    @PostMapping("/schedule")
    public ResponseEntity<GuideSession> scheduleSession(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody SessionScheduleDTO dto) {
        String token = authHeader.substring(7);
        Long instructorId = jwtUtil.extractUserId(token);
        GuideSession session = sessionService.scheduleSession(instructorId, dto);
        return ResponseEntity.ok(session);
    }

    // Get session by guide request ID
    @GetMapping("/request/{requestId}")
    public ResponseEntity<GuideSession> getSessionByRequestId(@PathVariable Long requestId) {
        return ResponseEntity.ok(sessionService.getSessionByRequestId(requestId));
    }

    // Get all sessions for student
    @GetMapping("/my-sessions")
    public ResponseEntity<List<GuideSession>> getMySessions(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long studentId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(sessionService.getStudentSessions(studentId));
    }

    // Get all sessions for instructor
    @GetMapping("/instructor/sessions")
    public ResponseEntity<List<GuideSession>> getInstructorSessions(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long instructorId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(sessionService.getInstructorSessions(instructorId));
    }

    // Update session status
    @PutMapping("/{sessionId}/status")
    public ResponseEntity<GuideSession> updateSessionStatus(
            @PathVariable Long sessionId,
            @RequestBody Map<String, Object> body) {

        GuideSession.SessionStatus status = GuideSession.SessionStatus.valueOf(
                body.get("status").toString()
        );
        String notes = body.containsKey("notes") ? body.get("notes").toString() : null;

        GuideSession session = sessionService.updateSessionStatus(sessionId, status, notes);
        return ResponseEntity.ok(session);
    }

    // Cancel session
    @DeleteMapping("/{sessionId}")
    public ResponseEntity<String> cancelSession(
            @PathVariable Long sessionId,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long userId = jwtUtil.extractUserId(token);
        sessionService.cancelSession(sessionId, userId);
        return ResponseEntity.ok("Session cancelled successfully");
    }

    // Get session by ID
    @GetMapping("/{sessionId}")
    public ResponseEntity<GuideSession> getSession(@PathVariable Long sessionId) {
        return ResponseEntity.ok(sessionService.getSessionById(sessionId));
    }
}