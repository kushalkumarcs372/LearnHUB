package com.learnhub.service;

import com.learnhub.dto.GuideRequestDTO;
import com.learnhub.dto.GuideResponseDTO;
import com.learnhub.entity.*;
import com.learnhub.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class GuideRequestService {

    @Autowired
    private GuideRequestRepository guideRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private PaymentService paymentService;

    // Student creates a guide request
    @Transactional
    public GuideRequest createGuideRequest(Long studentId, GuideRequestDTO dto) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        User instructor = userRepository.findById(dto.getInstructorId())
                .orElseThrow(() -> new RuntimeException("Instructor not found"));

        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Check if student is enrolled
        Enrollment enrollment = enrollmentRepository.findByStudentIdAndCourseId(studentId, dto.getCourseId())
                .orElseThrow(() -> new RuntimeException("You must be enrolled in this course"));

        GuideRequest request = new GuideRequest();
        request.setStudent(student);
        request.setInstructor(instructor);
        request.setCourse(course);
        request.setTopic(dto.getTopic());
        request.setDescription(dto.getDescription());
        request.setStatus(GuideRequest.RequestStatus.PENDING);

        return guideRequestRepository.save(request);
    }

    /**
     * LearnHub flow: student books a paid 1-on-1 doubt session request.
     * Creates the guide request and records a per-session payment linked to that request.
     */
    @Transactional
    public com.learnhub.dto.SessionBookingResponseDTO bookPaidSessionRequest(Long studentId, com.learnhub.dto.SessionBookingRequestDTO dto) {
        if (dto.getCourseId() == null || dto.getInstructorId() == null) {
            throw new RuntimeException("Course and instructor are required");
        }
        if (dto.getTopic() == null || dto.getTopic().trim().isEmpty()) {
            throw new RuntimeException("Topic is required");
        }
        if (dto.getAmount() == null || dto.getAmount() <= 0) {
            throw new RuntimeException("Amount must be greater than 0");
        }
        if (dto.getPaymentMethod() == null || dto.getPaymentMethod().trim().isEmpty()) {
            throw new RuntimeException("Payment method is required");
        }

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        User instructor = userRepository.findById(dto.getInstructorId())
                .orElseThrow(() -> new RuntimeException("Instructor not found"));

        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Enrollment enrollment = enrollmentRepository.findByStudentIdAndCourseId(studentId, dto.getCourseId())
                .orElseThrow(() -> new RuntimeException("You must be enrolled in this course"));

        GuideRequest request = new GuideRequest();
        request.setStudent(student);
        request.setInstructor(instructor);
        request.setCourse(course);
        request.setTopic(dto.getTopic());
        request.setDescription(dto.getDescription());
        request.setStatus(GuideRequest.RequestStatus.PENDING);

        request = guideRequestRepository.save(request);

        Payment payment = paymentService.processGuideSessionPayment(
                studentId,
                enrollment.getId(),
                request.getId(),
                dto.getPaymentMethod(),
                dto.getAmount()
        );

        if (payment.getStatus() != Payment.PaymentStatus.COMPLETED) {
            request.setStatus(GuideRequest.RequestStatus.CANCELLED);
            guideRequestRepository.save(request);
            throw new RuntimeException("Payment failed. Please try again.");
        }

        return new com.learnhub.dto.SessionBookingResponseDTO(
                request.getId(),
                payment.getId(),
                payment.getTransactionId(),
                payment.getStatus().name()
        );
    }

    // Instructor responds to guide request
    @Transactional
    public GuideRequest respondToGuideRequest(Long instructorId, Long requestId, GuideResponseDTO dto) {
        GuideRequest request = guideRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Guide request not found"));

        if (!request.getInstructor().getId().equals(instructorId)) {
            throw new RuntimeException("You don't have permission to respond to this request");
        }

        if (request.getStatus() != GuideRequest.RequestStatus.PENDING) {
            throw new RuntimeException("This request has already been responded to");
        }

        request.setStatus(dto.getStatus());
        request.setInstructorResponse(dto.getInstructorResponse());
        request.setRespondedAt(LocalDateTime.now());

        return guideRequestRepository.save(request);
    }

    // Get all requests for a student
    public List<GuideRequest> getStudentRequests(Long studentId) {
        return guideRequestRepository.findByStudentIdOrderByRequestedAtDesc(studentId);
    }

    // Get all requests for an instructor
    public List<GuideRequest> getInstructorRequests(Long instructorId) {
        return guideRequestRepository.findByInstructorIdOrderByRequestedAtDesc(instructorId);
    }

    // Get pending requests for instructor
    public List<GuideRequest> getInstructorPendingRequests(Long instructorId) {
        return guideRequestRepository.findByInstructorIdAndStatus(
                instructorId, GuideRequest.RequestStatus.PENDING
        );
    }

    // Get request by ID
    public GuideRequest getRequestById(Long requestId) {
        return guideRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Guide request not found"));
    }

    // Cancel request (student)
    @Transactional
    public void cancelRequest(Long studentId, Long requestId) {
        GuideRequest request = getRequestById(requestId);

        if (!request.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("You don't have permission to cancel this request");
        }

        if (request.getStatus() != GuideRequest.RequestStatus.PENDING) {
            throw new RuntimeException("Only pending requests can be cancelled");
        }

        request.setStatus(GuideRequest.RequestStatus.CANCELLED);
        guideRequestRepository.save(request);
    }

    // Get count of pending requests for instructor
    public int getPendingRequestCount(Long instructorId) {
        return guideRequestRepository.countByInstructorIdAndStatus(
                instructorId, GuideRequest.RequestStatus.PENDING
        );
    }
}
