package com.sujitbiswal.expensetracker.model;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity @Table(name = "users")
@Data @NoArgsConstructor @AllArgsConstructor
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Column(unique = true)
    private String username;

    @NotBlank @Email @Column(unique = true)
    private String email;

    @NotBlank
    private String password; // Always stored ENCRYPTED, never plain text
}