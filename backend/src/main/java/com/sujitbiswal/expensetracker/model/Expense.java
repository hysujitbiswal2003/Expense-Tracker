package com.sujitbiswal.expensetracker.model;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity @Table(name = "expenses")
@Data @NoArgsConstructor @AllArgsConstructor
public class Expense {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank private String title;
    @NotNull @Positive private Double amount;
    private String category;
    private String description;

    @CreationTimestamp
    private LocalDateTime createdAt;

    // Many expenses → One user (the user_id column links them)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}