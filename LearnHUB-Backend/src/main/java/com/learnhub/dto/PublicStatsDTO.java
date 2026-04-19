package com.learnhub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PublicStatsDTO {
    private long totalCourses;
    private long totalStudents;
    private long totalInstructors;
    private long totalEnrollments;
    private long totalCertificates;
    private long totalLogins;
    private double averageRating;
    private long ratingCount;
}
