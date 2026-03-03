package com.sujitbiswal.expensetracker.repository;
import com.sujitbiswal.expensetracker.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<Expense> findByIdAndUserId(Long id, Long userId);
}