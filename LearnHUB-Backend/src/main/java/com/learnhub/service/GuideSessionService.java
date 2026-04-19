package com.learnhub.service;

import com.learnhub.dto.SessionScheduleDTO;
import com.learnhub.entity.GuideRequest;
import com.learnhub.entity.GuideSession;
import com.learnhub.entity.Payment;
import com.learnhub.repository.GuideRequestRepository;
import com.learnhub.repository.GuideSessionRepository;
import com.learnhub.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class GuideSessionService {

    @Autowired
    private GuideSessionRepository sessionRepository;

    @Autowired
    private GuideRequestRepository requestRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    // Instructor schedules a session after approving request
    @Transactional
    public GuideSession scheduleSession(Long instructorId, SessionScheduleDTO dto) {
        GuideRequest request = requestRepository.findById(dto.getGuideRequestId())
                .orElseThrow(() -> new RuntimeException("Guide request not found"));

        if (!request.getInstructor().getId().equals(instructorId)) {
            throw new RuntimeException("You don't have permission to schedule this session");
        }

        if (request.getStatus() != GuideRequest.RequestStatus.APPROVED) {
            throw new RuntimeException("Request must be approved before scheduling");
        }

        // Enforce LearnHub flow: payment is per session booking.
        if (!paymentRepository.existsByGuideRequestIdAndStatus(request.getId(), Payment.PaymentStatus.COMPLETED)) {
            throw new RuntimeException("Student must complete session payment before scheduling");
        }

        // Check if session already exists
        if (sessionRepository.findByGuideRequestId(request.getId()).isPresent()) {
            throw new RuntimeException("Session already scheduled for this request");
        }

        GuideSession session = new GuideSession();
        session.setGuideRequest(request);
        session.setScheduledAt(dto.getScheduledAt());
        session.setDurationMinutes(dto.getDurationMinutes() != null ? dto.getDurationMinutes() : 60);
        session.setMeetingLink(dto.getMeetingLink());
        session.setStatus(GuideSession.SessionStatus.SCHEDULED);

        return sessionRepository.save(session);
    }

    // Get session by guide request ID
    public GuideSession getSessionByRequestId(Long requestId) {
        return sessionRepository.findByGuideRequestId(requestId)
                .orElseThrow(() -> new RuntimeException("Session not found for this request"));
    }

    // Get all sessions for a student
    public List<GuideSession> getStudentSessions(Long studentId) {
        return sessionRepository.findByGuideRequest_StudentIdOrderByScheduledAtDesc(studentId);
    }

    // Get all sessions for an instructor
    public List<GuideSession> getInstructorSessions(Long instructorId) {
        return sessionRepository.findByGuideRequest_InstructorIdOrderByScheduledAtDesc(instructorId);
    }

    // Update session status
    @Transactional
    public GuideSession updateSessionStatus(Long sessionId, GuideSession.SessionStatus status, String notes) {
        GuideSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        session.setStatus(status);

        if (notes != null) {
            session.setNotes(notes);
        }

        if (status == GuideSession.SessionStatus.COMPLETED) {
            session.setCompletedAt(LocalDateTime.now());

            // Also update the guide request status
            GuideRequest request = session.getGuideRequest();
            request.setStatus(GuideRequest.RequestStatus.COMPLETED);
            requestRepository.save(request);
        }

        return sessionRepository.save(session);
    }

    // Cancel session
    @Transactional
    public void cancelSession(Long sessionId, Long userId) {
        GuideSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        // Check if user is either student or instructor
        boolean isStudent = session.getGuideRequest().getStudent().getId().equals(userId);
        boolean isInstructor = session.getGuideRequest().getInstructor().getId().equals(userId);

        if (!isStudent && !isInstructor) {
            throw new RuntimeException("You don't have permission to cancel this session");
        }

        if (session.getStatus() == GuideSession.SessionStatus.COMPLETED) {
            throw new RuntimeException("Cannot cancel a completed session");
        }

        session.setStatus(GuideSession.SessionStatus.CANCELLED);
        sessionRepository.save(session);
    }

    // Get session by ID
    public GuideSession getSessionById(Long sessionId) {
        return sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
    }
}
