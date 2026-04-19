package com.learnhub.dto;

import com.learnhub.entity.User.UserRole;
import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private UserRole role;
}