package com.learnhub.repository;

import com.learnhub.entity.GuideSession;
import com.learnhub.entity.GuideSession.SessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GuideSessionRepository extends JpaRepository<GuideSession, Long> {
    Optional<GuideSession> findByGuideRequestId(Long guideRequestId);
    List<GuideSession> findByStatus(SessionStatus status);
    List<GuideSession> findByGuideRequest_StudentIdOrderByScheduledAtDesc(Long studentId);
    List<GuideSession> findByGuideRequest_InstructorIdOrderByScheduledAtDesc(Long instructorId);
}