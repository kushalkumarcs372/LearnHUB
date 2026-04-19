package com.learnhub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetRequestResponseDTO {
    private String message;
    // For demo/dev only: in production this should be emailed to the user.
    private String resetToken;
}

