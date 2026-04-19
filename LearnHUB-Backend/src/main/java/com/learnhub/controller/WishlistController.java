package com.learnhub.controller;

import com.learnhub.entity.Wishlist;
import com.learnhub.security.JwtUtil;
import com.learnhub.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "*")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @Autowired
    private JwtUtil jwtUtil;

    // Get student's wishlist
    @GetMapping("/my-wishlist")
    public ResponseEntity<List<Wishlist>> getMyWishlist(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long studentId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(wishlistService.getStudentWishlist(studentId));
    }

    // Add course to wishlist
    @PostMapping("/add/{courseId}")
    public ResponseEntity<Wishlist> addToWishlist(
            @PathVariable Long courseId,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long studentId = jwtUtil.extractUserId(token);
        Wishlist wishlist = wishlistService.addToWishlist(studentId, courseId);
        return ResponseEntity.ok(wishlist);
    }

    // Remove course from wishlist
    @DeleteMapping("/remove/{courseId}")
    public ResponseEntity<String> removeFromWishlist(
            @PathVariable Long courseId,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long studentId = jwtUtil.extractUserId(token);
        wishlistService.removeFromWishlist(studentId, courseId);
        return ResponseEntity.ok("Course removed from wishlist");
    }

    // Check if course is in wishlist
    @GetMapping("/check/{courseId}")
    public ResponseEntity<Boolean> isInWishlist(
            @PathVariable Long courseId,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long studentId = jwtUtil.extractUserId(token);
        boolean inWishlist = wishlistService.isInWishlist(studentId, courseId);
        return ResponseEntity.ok(inWishlist);
    }
}