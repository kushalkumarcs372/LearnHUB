package com.learnhub.controller;

import com.learnhub.dto.PaymentRequestDTO;
import com.learnhub.entity.Payment;
import com.learnhub.security.JwtUtil;
import com.learnhub.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private JwtUtil jwtUtil;

    // Process premium guide payment
    @PostMapping("/premium")
    public ResponseEntity<Payment> processPremiumPayment(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody PaymentRequestDTO dto) {
        String token = authHeader.substring(7);
        Long studentId = jwtUtil.extractUserId(token);
        Payment payment = paymentService.processPremiumPayment(studentId, dto);
        return ResponseEntity.ok(payment);
    }

    // Get payment history for student
    @GetMapping("/my-payments")
    public ResponseEntity<List<Payment>> getMyPayments(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long studentId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(paymentService.getStudentPayments(studentId));
    }

    // Get payment by transaction ID
    @GetMapping("/transaction/{transactionId}")
    public ResponseEntity<Payment> getPaymentByTransaction(@PathVariable String transactionId) {
        return ResponseEntity.ok(paymentService.getPaymentByTransactionId(transactionId));
    }

    // Get payment by ID
    @GetMapping("/{paymentId}")
    public ResponseEntity<Payment> getPayment(@PathVariable Long paymentId) {
        return ResponseEntity.ok(paymentService.getPaymentById(paymentId));
    }

    // Get payments for an enrollment
    @GetMapping("/enrollment/{enrollmentId}")
    public ResponseEntity<List<Payment>> getEnrollmentPayments(@PathVariable Long enrollmentId) {
        return ResponseEntity.ok(paymentService.getEnrollmentPayments(enrollmentId));
    }

    // Check if enrollment has premium access
    @GetMapping("/enrollment/{enrollmentId}/has-premium")
    public ResponseEntity<Boolean> hasCompletedPayment(@PathVariable Long enrollmentId) {
        return ResponseEntity.ok(paymentService.hasCompletedPayment(enrollmentId));
    }
}