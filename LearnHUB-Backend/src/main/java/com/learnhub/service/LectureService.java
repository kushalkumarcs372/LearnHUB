package com.learnhub.service;

import com.learnhub.dto.LectureRequest;
import com.learnhub.entity.Course;
import com.learnhub.entity.Lecture;
import com.learnhub.repository.CourseRepository;
import com.learnhub.repository.LectureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LectureService {

    @Autowired
    private LectureRepository lectureRepository;

    @Autowired
    private CourseRepository courseRepository;

    public List<Lecture> getCourseLectures(Long courseId) {
        return lectureRepository.findByCourseIdOrderByOrderNumberAsc(courseId);
    }

    public Lecture getLectureById(Long id) {
        return lectureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lecture not found"));
    }

    public int getLectureCount(Long courseId) {
        return lectureRepository.countByCourseId(courseId);
    }

    @Transactional
    public Lecture createLecture(Long instructorId, LectureRequest request) {
        // Verify course exists and belongs to instructor
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (!course.getInstructor().getId().equals(instructorId)) {
            throw new RuntimeException("You don't have permission to add lectures to this course");
        }

        Lecture lecture = new Lecture();
        lecture.setTitle(request.getTitle());
        lecture.setContent(request.getContent());
        lecture.setCourse(course);
        lecture.setImageUrl(request.getImageUrl());
        lecture.setVideoUrl(request.getVideoUrl());

        // Auto-assign order number if not provided
        if (request.getOrderNumber() != null) {
            lecture.setOrderNumber(request.getOrderNumber());
        } else {
            // Get the count and assign next order number
            int count = lectureRepository.countByCourseId(request.getCourseId());
            lecture.setOrderNumber(count + 1);
        }

        return lectureRepository.save(lecture);
    }

    @Transactional
    public Lecture updateLecture(Long lectureId, Long instructorId, LectureRequest request) {
        Lecture lecture = getLectureById(lectureId);

        // Verify instructor owns the course
        if (!lecture.getCourse().getInstructor().getId().equals(instructorId)) {
            throw new RuntimeException("You don't have permission to update this lecture");
        }

        if (request.getTitle() != null && !request.getTitle().isEmpty()) {
            lecture.setTitle(request.getTitle());
        }
        if (request.getContent() != null) {
            lecture.setContent(request.getContent());
        }
        if (request.getImageUrl() != null) {
            lecture.setImageUrl(request.getImageUrl());
        }
        if (request.getVideoUrl() != null) {
            lecture.setVideoUrl(request.getVideoUrl());
        }
        if (request.getOrderNumber() != null) {
            lecture.setOrderNumber(request.getOrderNumber());
        }

        return lectureRepository.save(lecture);
    }

    @Transactional
    public void updateLectureOrder(Long lectureId, Long instructorId, Integer newOrderNumber) {
        Lecture lecture = getLectureById(lectureId);

        // Verify instructor owns the course
        if (!lecture.getCourse().getInstructor().getId().equals(instructorId)) {
            throw new RuntimeException("You don't have permission to reorder this lecture");
        }

        lecture.setOrderNumber(newOrderNumber);
        lectureRepository.save(lecture);
    }

    @Transactional
    public void deleteLecture(Long lectureId, Long instructorId) {
        Lecture lecture = getLectureById(lectureId);

        // Verify instructor owns the course
        if (!lecture.getCourse().getInstructor().getId().equals(instructorId)) {
            throw new RuntimeException("You don't have permission to delete this lecture");
        }

        lectureRepository.delete(lecture);
    }
}
