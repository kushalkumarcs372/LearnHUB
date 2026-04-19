package com.learnhub.controller;

import com.learnhub.entity.Certificate;
import com.learnhub.security.JwtUtil;
import com.learnhub.service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certificates")
@CrossOrigin(origins = "*")
public class CertificateController {

    @Autowired
    private CertificateService certificateService;

    @Autowired
    private JwtUtil jwtUtil;

    // Generate certificate for a completed course
    @PostMapping("/generate/{courseId}")
    public ResponseEntity<Certificate> generateCertificate(
            @PathVariable Long courseId,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long studentId = jwtUtil.extractUserId(token);
        Certificate certificate = certificateService.generateCertificate(studentId, courseId);
        return ResponseEntity.ok(certificate);
    }

    // Get all certificates for the student
    @GetMapping("/my-certificates")
    public ResponseEntity<List<Certificate>> getMyCertificates(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long studentId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(certificateService.getStudentCertificates(studentId));
    }

    // Get certificate by ID
    @GetMapping("/{id}")
    public ResponseEntity<Certificate> getCertificate(@PathVariable Long id) {
        return ResponseEntity.ok(certificateService.getCertificateById(id));
    }

    // Verify certificate by certificate ID
    @GetMapping("/verify/{certificateId}")
    public ResponseEntity<Certificate> verifyCertificate(@PathVariable String certificateId) {
        return ResponseEntity.ok(certificateService.verifyCertificate(certificateId));
    }

    // Check if student has certificate for a course
    @GetMapping("/check/{courseId}")
    public ResponseEntity<Boolean> hasCertificate(
            @PathVariable Long courseId,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long studentId = jwtUtil.extractUserId(token);
        boolean hasCert = certificateService.hasCertificate(studentId, courseId);
        return ResponseEntity.ok(hasCert);
    }
}