package com.sujitbiswal.expensetracker.dto;
import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class ExpenseRequest {
    @NotBlank private String title;
    @NotNull @Positive private Double amount;
    private String category;
    private String description;
}