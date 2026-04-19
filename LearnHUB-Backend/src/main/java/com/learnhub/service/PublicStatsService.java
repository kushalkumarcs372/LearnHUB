package com.learnhub.service;

import com.learnhub.dto.PublicStatsDTO;
import com.learnhub.entity.Course;
import com.learnhub.entity.User;
import com.learnhub.repository.AppRatingRepository;
import com.learnhub.repository.CertificateRepository;
import com.learnhub.repository.CourseRepository;
import com.learnhub.repository.EnrollmentRepository;
import com.learnhub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PublicStatsService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private CertificateRepository certificateRepository;

    @Autowired
    private AppRatingRepository appRatingRepository;

    @Autowired
    private AppCounterService appCounterService;

    public PublicStatsDTO getPublicStats() {
        long totalCourses = courseRepository.countByStatus(Course.CourseStatus.PUBLISHED);
        long totalStudents = userRepository.countByRole(User.UserRole.STUDENT);
        long totalInstructors = userRepository.countByRole(User.UserRole.INSTRUCTOR);
        long totalEnrollments = enrollmentRepository.count();
        long totalCertificates = certificateRepository.count();
        long totalLogins = appCounterService.getValue(AppCounterService.COUNTER_LOGINS);
        long ratingCount = appRatingRepository.count();

        Double avg = appRatingRepository.getAverageRating();
        double averageRating = avg == null ? 0.0 : avg;

        return new PublicStatsDTO(
                totalCourses,
                totalStudents,
                totalInstructors,
                totalEnrollments,
                totalCertificates,
                totalLogins,
                averageRating,
                ratingCount
        );
    }
}
