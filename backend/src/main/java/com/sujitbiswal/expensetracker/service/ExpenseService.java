package com.sujitbiswal.expensetracker.service;
import com.sujitbiswal.expensetracker.dto.ExpenseRequest;
import com.sujitbiswal.expensetracker.model.*;
import com.sujitbiswal.expensetracker.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ExpenseService {
    @Autowired private ExpenseRepository expenseRepository;
    @Autowired private UserRepository userRepository;

    public List<Expense> getExpenses(String username) {
        return expenseRepository.findByUserIdOrderByCreatedAtDesc(getUser(username).getId());
    }

    public Expense addExpense(ExpenseRequest req, String username) {
        var user = getUser(username);
        var expense = new Expense();
        expense.setTitle(req.getTitle());
        expense.setAmount(req.getAmount());
        expense.setCategory(req.getCategory());
        expense.setDescription(req.getDescription());
        expense.setUser(user);
        return expenseRepository.save(expense);
    }

    public void deleteExpense(Long id, String username) {
        var user = getUser(username);
        var expense = expenseRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Expense not found or not authorized!"));
        expenseRepository.delete(expense);
    }

    private com.sujitbiswal.expensetracker.model.User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found!"));
    }
}