package com.learnhub.service;

import com.learnhub.entity.Certificate;
import com.learnhub.entity.Course;
import com.learnhub.entity.Enrollment;
import com.learnhub.entity.Quiz;
import com.learnhub.entity.User;
import com.learnhub.repository.CertificateRepository;
import com.learnhub.repository.CourseRepository;
import com.learnhub.repository.EnrollmentRepository;
import com.learnhub.repository.QuizAttemptRepository;
import com.learnhub.repository.QuizRepository;
import com.learnhub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CertificateService {

    @Autowired
    private CertificateRepository certificateRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    @Transactional
    public Certificate generateCertificate(Long studentId, Long courseId) {
        // Check if certificate already exists
        if (certificateRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
            throw new RuntimeException("Certificate already generated for this course");
        }

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Check if student is enrolled
        Enrollment enrollment = enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId)
                .orElseThrow(() -> new RuntimeException("You must be enrolled in this course"));

        // Primary LearnHub rule: certificate after passing course quiz/quizzes.
        // Fallback (legacy): if no quizzes exist, require 100% progress.
        var quizzes = quizRepository.findByCourseId(courseId);
        if (!quizzes.isEmpty()) {
            boolean allPassed = quizzes.stream()
                    .map(Quiz::getId)
                    .allMatch(quizId -> quizAttemptRepository.existsByStudentIdAndQuizIdAndPassedTrue(studentId, quizId));
            if (!allPassed) {
                throw new RuntimeException("You must pass the course quiz to generate a certificate");
            }
            // Mark course completed from a learning perspective.
            enrollment.setProgressPercent(100);
            enrollment.setStatus(Enrollment.EnrollmentStatus.COMPLETED);
            enrollment.setCompletedAt(LocalDateTime.now());
            enrollmentRepository.save(enrollment);
        } else {
            if (enrollment.getProgressPercent() < 100) {
                throw new RuntimeException("Course must be 100% complete to generate certificate");
            }
        }

        Certificate certificate = new Certificate();
        certificate.setStudent(student);
        certificate.setCourse(course);
        certificate.setCompletionDate(LocalDateTime.now());

        return certificateRepository.save(certificate);
    }

    public List<Certificate> getStudentCertificates(Long studentId) {
        return certificateRepository.findByStudentId(studentId);
    }

    public Certificate getCertificateById(Long id) {
        return certificateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certificate not found"));
    }

    public Certificate verifyCertificate(String certificateId) {
        return certificateRepository.findByCertificateId(certificateId)
                .orElseThrow(() -> new RuntimeException("Invalid certificate ID"));
    }

    public boolean hasCertificate(Long studentId, Long courseId) {
        return certificateRepository.existsByStudentIdAndCourseId(studentId, courseId);
    }
}
