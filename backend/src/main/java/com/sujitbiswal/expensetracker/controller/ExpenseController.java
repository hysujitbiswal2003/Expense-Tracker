package com.sujitbiswal.expensetracker.controller;
import com.sujitbiswal.expensetracker.dto.ExpenseRequest;
import com.sujitbiswal.expensetracker.model.Expense;
import com.sujitbiswal.expensetracker.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/expenses")
public class ExpenseController {
    @Autowired private ExpenseService expenseService;

    @GetMapping
    public ResponseEntity<List<Expense>> getExpenses(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(expenseService.getExpenses(ud.getUsername()));
    }

    @PostMapping
    public ResponseEntity<?> addExpense(@Valid @RequestBody ExpenseRequest req,
                                        @AuthenticationPrincipal UserDetails ud) {
        try { return ResponseEntity.ok(expenseService.addExpense(req, ud.getUsername())); }
        catch (RuntimeException e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id,
                                           @AuthenticationPrincipal UserDetails ud) {
        try { expenseService.deleteExpense(id, ud.getUsername()); return ResponseEntity.ok("Deleted!"); }
        catch (RuntimeException e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }
}