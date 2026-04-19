package com.learnhub.dto;

import lombok.Data;

@Data
public class PasswordResetConfirmDTO {
    private String token;
    private String newPassword;
}

