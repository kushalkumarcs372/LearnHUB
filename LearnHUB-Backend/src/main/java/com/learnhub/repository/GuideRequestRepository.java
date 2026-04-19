package com.learnhub.repository;

import com.learnhub.entity.GuideRequest;
import com.learnhub.entity.GuideRequest.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GuideRequestRepository extends JpaRepository<GuideRequest, Long> {
    List<GuideRequest> findByStudentIdOrderByRequestedAtDesc(Long studentId);
    List<GuideRequest> findByInstructorIdOrderByRequestedAtDesc(Long instructorId);
    List<GuideRequest> findByCourseIdOrderByRequestedAtDesc(Long courseId);
    List<GuideRequest> findByInstructorIdAndStatus(Long instructorId, RequestStatus status);
    List<GuideRequest> findByStudentIdAndStatus(Long studentId, RequestStatus status);
    int countByInstructorIdAndStatus(Long instructorId, RequestStatus status);
}