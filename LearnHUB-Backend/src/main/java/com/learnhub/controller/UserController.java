package com.learnhub.controller;

import com.learnhub.entity.User;
import com.learnhub.security.JwtUtil;
import com.learnhub.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);
        User user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> updates) {
        String token = authHeader.substring(7);
        Long userId = jwtUtil.extractUserId(token);

        User user = userService.updateProfile(
                userId,
                updates.get("name"),
                updates.get("bio")
        );

        return ResponseEntity.ok(user);
    }

    @PutMapping("/password")
    public ResponseEntity<String> updatePassword(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> passwords) {
        String token = authHeader.substring(7);
        Long userId = jwtUtil.extractUserId(token);

        userService.updatePassword(
                userId,
                passwords.get("oldPassword"),
                passwords.get("newPassword")
        );

        return ResponseEntity.ok("Password updated successfully");
    }
}