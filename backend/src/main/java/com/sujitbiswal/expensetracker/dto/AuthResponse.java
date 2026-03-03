package com.sujitbiswal.expensetracker.dto;
import lombok.*;

@Data @AllArgsConstructor
public class AuthResponse {
    private String token;
    private String username;
    private String message;
}