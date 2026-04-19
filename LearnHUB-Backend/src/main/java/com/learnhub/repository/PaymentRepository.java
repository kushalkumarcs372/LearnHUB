package com.learnhub.repository;

import com.learnhub.entity.Payment;
import com.learnhub.entity.Payment.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByStudentIdOrderByPaymentDateDesc(Long studentId);
    List<Payment> findByEnrollmentId(Long enrollmentId);
    Optional<Payment> findByTransactionId(String transactionId);
    boolean existsByEnrollmentIdAndStatus(Long enrollmentId, PaymentStatus status);
    boolean existsByGuideRequestIdAndStatus(Long guideRequestId, PaymentStatus status);
    Optional<Payment> findByGuideRequestId(Long guideRequestId);
}
