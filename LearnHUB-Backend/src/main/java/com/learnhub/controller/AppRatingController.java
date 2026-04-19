package com.learnhub.controller;

import com.learnhub.dto.AppRatingRequest;
import com.learnhub.entity.AppRating;
import com.learnhub.security.JwtUtil;
import com.learnhub.service.AppRatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/app-ratings")
@CrossOrigin(origins = "*")
public class AppRatingController {

    @Autowired
    private AppRatingService appRatingService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/me")
    public ResponseEntity<AppRating> getMyRating(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long userId = jwtUtil.extractUserId(token);
        try {
            return ResponseEntity.ok(appRatingService.getMyRating(userId));
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<AppRating> upsertMyRating(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody AppRatingRequest request) {
        String token = authHeader.substring(7);
        Long userId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(appRatingService.upsertMyRating(userId, request));
    }
}
