package com.learnhub.service;

import com.learnhub.dto.PaymentRequestDTO;
import com.learnhub.entity.*;
import com.learnhub.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class PaymentService {

    // For demos/local usage we default to always succeed. Override via `APP_PAYMENT_SUCCESS_RATE` if needed.
    // Range: 0.0 - 1.0
    @Value("${app.payment.success-rate:${APP_PAYMENT_SUCCESS_RATE:1.0}}")
    private double successRate;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private GuideRequestRepository guideRequestRepository;

    // Process premium guide access payment
    @Transactional
    public Payment processPremiumPayment(Long studentId, PaymentRequestDTO dto) {
        // Get enrollment
        Enrollment enrollment = enrollmentRepository.findById(dto.getEnrollmentId())
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        // Verify student owns this enrollment
        if (!enrollment.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("This enrollment doesn't belong to you");
        }

        // Check if already has premium access
        if (enrollment.getHasPremiumAccess()) {
            throw new RuntimeException("You already have premium access for this course");
        }

        // Check if payment already exists
        if (paymentRepository.existsByEnrollmentIdAndStatus(
                dto.getEnrollmentId(), Payment.PaymentStatus.COMPLETED)) {
            throw new RuntimeException("Payment already completed for this enrollment");
        }

        // Simulate payment processing
        boolean paymentSuccess = simulatePayment(dto.getPaymentMethod());

        Payment payment = new Payment();
        payment.setStudent(enrollment.getStudent());
        payment.setCourse(enrollment.getCourse());
        payment.setEnrollment(enrollment);
        payment.setAmount(dto.getAmount());
        payment.setPaymentType(Payment.PaymentType.PREMIUM_GUIDE);
        payment.setPaymentMethod(dto.getPaymentMethod());
        payment.setStatus(paymentSuccess ? Payment.PaymentStatus.COMPLETED : Payment.PaymentStatus.FAILED);
        payment.setPaymentDate(LocalDateTime.now());

        payment = paymentRepository.save(payment);

        // If payment successful, grant premium access
        if (paymentSuccess) {
            enrollment.setHasPremiumAccess(true);
            enrollmentRepository.save(enrollment);
        }

        return payment;
    }

    // Process a per-session guidance payment linked to a GuideRequest
    @Transactional
    public Payment processGuideSessionPayment(Long studentId, Long enrollmentId, Long guideRequestId, String paymentMethod, Double amount) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        if (!enrollment.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("This enrollment doesn't belong to you");
        }

        GuideRequest guideRequest = guideRequestRepository.findById(guideRequestId)
                .orElseThrow(() -> new RuntimeException("Guide request not found"));

        if (!guideRequest.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("This guide request doesn't belong to you");
        }

        if (!guideRequest.getCourse().getId().equals(enrollment.getCourse().getId())) {
            throw new RuntimeException("Guide request course does not match enrollment");
        }

        // Prevent paying twice for the same request
        if (paymentRepository.existsByGuideRequestIdAndStatus(guideRequestId, Payment.PaymentStatus.COMPLETED)) {
            throw new RuntimeException("Payment already completed for this session request");
        }

        boolean paymentSuccess = simulatePayment(paymentMethod);

        Payment payment = new Payment();
        payment.setStudent(enrollment.getStudent());
        payment.setCourse(enrollment.getCourse());
        payment.setEnrollment(enrollment);
        payment.setGuideRequest(guideRequest);
        payment.setAmount(amount);
        payment.setPaymentType(Payment.PaymentType.GUIDE_SESSION);
        payment.setPaymentMethod(paymentMethod);
        payment.setStatus(paymentSuccess ? Payment.PaymentStatus.COMPLETED : Payment.PaymentStatus.FAILED);
        payment.setPaymentDate(LocalDateTime.now());

        return paymentRepository.save(payment);
    }

    // Simulate payment processing (90% success rate)
    private boolean simulatePayment(String paymentMethod) {
        // Simulate processing delay
        try {
            Thread.sleep(1000); // 1 second delay
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        // Success rate (default 100% for demos)
        Random random = new Random();
        int threshold = (int) Math.round(Math.max(0, Math.min(1, successRate)) * 100);
        return random.nextInt(100) < threshold;
    }

    // Get payment history for student
    public List<Payment> getStudentPayments(Long studentId) {
        return paymentRepository.findByStudentIdOrderByPaymentDateDesc(studentId);
    }

    // Get payment by transaction ID
    public Payment getPaymentByTransactionId(String transactionId) {
        return paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    // Get payment by ID
    public Payment getPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    // Get payments for an enrollment
    public List<Payment> getEnrollmentPayments(Long enrollmentId) {
        return paymentRepository.findByEnrollmentId(enrollmentId);
    }

    // Check if enrollment has completed payment
    public boolean hasCompletedPayment(Long enrollmentId) {
        return paymentRepository.existsByEnrollmentIdAndStatus(
                enrollmentId, Payment.PaymentStatus.COMPLETED);
    }
}
