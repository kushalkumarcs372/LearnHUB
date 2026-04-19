package com.learnhub.service;

import com.learnhub.entity.PasswordResetToken;
import com.learnhub.entity.User;
import com.learnhub.repository.PasswordResetTokenRepository;
import com.learnhub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.UUID;

@Service
public class PasswordResetService {

    @Value("${app.password-reset.expires-minutes:15}")
    private int expiresMinutes;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String requestResetToken(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }

        var userOpt = userRepository.findByEmail(email.trim());
        if (userOpt.isEmpty()) {
            return null;
        }

        User user = userOpt.get();
        String token = UUID.randomUUID().toString().replace("-", "");

        PasswordResetToken prt = new PasswordResetToken();
        prt.setUser(user);
        prt.setTokenHash(sha256Hex(token));
        prt.setExpiresAt(LocalDateTime.now().plusMinutes(expiresMinutes));
        prt.setUsedAt(null);

        passwordResetTokenRepository.save(prt);
        return token;
    }

    @Transactional
    public void confirmReset(String token, String newPassword) {
        if (token == null || token.trim().isEmpty()) {
            throw new RuntimeException("Reset token is required");
        }
        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new RuntimeException("New password is required");
        }
        if (newPassword.length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters");
        }

        String tokenHash = sha256Hex(token.trim());
        PasswordResetToken prt = passwordResetTokenRepository
                .findFirstByTokenHashAndUsedAtIsNullOrderByCreatedAtDesc(tokenHash)
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset token"));

        if (prt.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Invalid or expired reset token");
        }

        User user = prt.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        prt.setUsedAt(LocalDateTime.now());
        passwordResetTokenRepository.save(prt);
    }

    private String sha256Hex(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(value.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            throw new RuntimeException("Failed to hash token");
        }
    }
}

