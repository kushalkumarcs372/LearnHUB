package com.learnhub.service;

import com.learnhub.entity.Course;
import com.learnhub.entity.User;
import com.learnhub.entity.Wishlist;
import com.learnhub.repository.CourseRepository;
import com.learnhub.repository.UserRepository;
import com.learnhub.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    public List<Wishlist> getStudentWishlist(Long studentId) {
        return wishlistRepository.findByStudentIdOrderByAddedAtDesc(studentId);
    }

    @Transactional
    public Wishlist addToWishlist(Long studentId, Long courseId) {
        // Check if already in wishlist
        if (wishlistRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
            throw new RuntimeException("Course already in wishlist");
        }

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Wishlist wishlist = new Wishlist();
        wishlist.setStudent(student);
        wishlist.setCourse(course);

        return wishlistRepository.save(wishlist);
    }

    @Transactional
    public void removeFromWishlist(Long studentId, Long courseId) {
        if (!wishlistRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
            throw new RuntimeException("Course not in wishlist");
        }
        wishlistRepository.deleteByStudentIdAndCourseId(studentId, courseId);
    }

    public boolean isInWishlist(Long studentId, Long courseId) {
        return wishlistRepository.existsByStudentIdAndCourseId(studentId, courseId);
    }
}