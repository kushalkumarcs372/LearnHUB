package com.learnhub.controller;

import com.learnhub.dto.AuthResponse;
import com.learnhub.dto.ErrorResponse;
import com.learnhub.dto.LoginRequest;
import com.learnhub.dto.MessageResponse;
import com.learnhub.dto.PasswordResetConfirmDTO;
import com.learnhub.dto.PasswordResetRequestDTO;
import com.learnhub.dto.PasswordResetRequestResponseDTO;
import com.learnhub.dto.RegisterRequest;
import com.learnhub.service.AuthService;
import com.learnhub.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage(), 400));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse(e.getMessage(), 401));
        }
    }

    // Forgot password: request reset token (demo returns token in response)
    @PostMapping("/password-reset/request")
    public ResponseEntity<?> requestPasswordReset(@RequestBody PasswordResetRequestDTO request) {
        try {
            String token = passwordResetService.requestResetToken(request.getEmail());
            String msg = "If the email exists, a reset token has been generated.";
            return ResponseEntity.ok(new PasswordResetRequestResponseDTO(msg, token));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage(), 400));
        }
    }

    // Confirm password reset with token + new password
    @PostMapping("/password-reset/confirm")
    public ResponseEntity<?> confirmPasswordReset(@RequestBody PasswordResetConfirmDTO request) {
        try {
            passwordResetService.confirmReset(request.getToken(), request.getNewPassword());
            return ResponseEntity.ok(new MessageResponse("Password reset successful. You can now log in."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage(), 400));
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Auth API is working!");
    }
}
