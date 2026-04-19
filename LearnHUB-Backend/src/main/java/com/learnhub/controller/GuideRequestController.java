package com.learnhub.controller;

import com.learnhub.dto.GuideRequestDTO;
import com.learnhub.dto.GuideResponseDTO;
import com.learnhub.dto.SessionBookingRequestDTO;
import com.learnhub.dto.SessionBookingResponseDTO;
import com.learnhub.entity.GuideRequest;
import com.learnhub.security.JwtUtil;
import com.learnhub.service.GuideRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guide-requests")
@CrossOrigin(origins = "*")
public class GuideRequestController {

    @Autowired
    private GuideRequestService guideRequestService;

    @Autowired
    private JwtUtil jwtUtil;

    // Student creates a guide request
    @PostMapping
    public ResponseEntity<GuideRequest> createGuideRequest(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody GuideRequestDTO dto) {
        String token = authHeader.substring(7);
        Long studentId = jwtUtil.extractUserId(token);
        GuideRequest request = guideRequestService.createGuideRequest(studentId, dto);
        return ResponseEntity.ok(request);
    }

    // Student books a paid 1-on-1 session request (per-session payment)
    @PostMapping("/book-session")
    public ResponseEntity<SessionBookingResponseDTO> bookPaidSession(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody SessionBookingRequestDTO dto) {
        String token = authHeader.substring(7);
        Long studentId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(guideRequestService.bookPaidSessionRequest(studentId, dto));
    }

    // Instructor responds to guide request
    @PutMapping("/{requestId}/respond")
    public ResponseEntity<GuideRequest> respondToRequest(
            @PathVariable Long requestId,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody GuideResponseDTO dto) {
        String token = authHeader.substring(7);
        Long instructorId = jwtUtil.extractUserId(token);
        GuideRequest request = guideRequestService.respondToGuideRequest(instructorId, requestId, dto);
        return ResponseEntity.ok(request);
    }

    // Get all requests for student
    @GetMapping("/my-requests")
    public ResponseEntity<List<GuideRequest>> getMyRequests(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long studentId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(guideRequestService.getStudentRequests(studentId));
    }

    // Get all requests for instructor
    @GetMapping("/instructor/requests")
    public ResponseEntity<List<GuideRequest>> getInstructorRequests(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long instructorId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(guideRequestService.getInstructorRequests(instructorId));
    }

    // Get pending requests for instructor
    @GetMapping("/instructor/pending")
    public ResponseEntity<List<GuideRequest>> getPendingRequests(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long instructorId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(guideRequestService.getInstructorPendingRequests(instructorId));
    }

    // Get pending count for instructor
    @GetMapping("/instructor/pending-count")
    public ResponseEntity<Integer> getPendingCount(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long instructorId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(guideRequestService.getPendingRequestCount(instructorId));
    }

    // Get request by ID
    @GetMapping("/{requestId}")
    public ResponseEntity<GuideRequest> getRequest(@PathVariable Long requestId) {
        return ResponseEntity.ok(guideRequestService.getRequestById(requestId));
    }

    // Cancel request (student)
    @DeleteMapping("/{requestId}")
    public ResponseEntity<String> cancelRequest(
            @PathVariable Long requestId,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long studentId = jwtUtil.extractUserId(token);
        guideRequestService.cancelRequest(studentId, requestId);
        return ResponseEntity.ok("Guide request cancelled successfully");
    }
}
