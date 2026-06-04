package com.smart.expense_tracker.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.smart.expense_tracker.dto.BudgetStatusResponse;
import com.smart.expense_tracker.dto.CreateBudgetRequest;
import com.smart.expense_tracker.dto.UpdateBudgetRequest;
import com.smart.expense_tracker.entity.Budget;
import com.smart.expense_tracker.entity.User;
import com.smart.expense_tracker.repository.UserRepository;
import com.smart.expense_tracker.service.BudgetService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/budgets")
@Tag(name = "Budgets", description = "Operations for managing budgets")
public class BudgetController {

    private final BudgetService budgetService;
    private final UserRepository userRepository;

    public BudgetController(BudgetService budgetService, UserRepository userRepository) {
        this.budgetService = budgetService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new org.springframework.security.core.userdetails.UsernameNotFoundException("User not found"));
    }

    @GetMapping
    @Operation(summary = "Get budgets", description = "Get list of budgets for the authenticated user")
    public ResponseEntity<List<Budget>> getBudgets() {
        User user = getAuthenticatedUser();
        List<Budget> budgets = budgetService.getBudgets(user);
        return ResponseEntity.ok(budgets);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get budget by ID", description = "Get details of a specific budget")
    public ResponseEntity<Budget> getBudgetById(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        Budget budget = budgetService.getBudgetById(id, user);
        return ResponseEntity.ok(budget);
    }

    @PostMapping
    @Operation(summary = "Create budget", description = "Create a new budget")
    public ResponseEntity<Budget> createBudget(@Valid @RequestBody CreateBudgetRequest req) {
        User user = getAuthenticatedUser();
        Budget budget = budgetService.createBudget(req, user);
        return new ResponseEntity<>(budget, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update budget", description = "Update an existing budget")
    public ResponseEntity<Budget> updateBudget(@PathVariable Long id, @Valid @RequestBody UpdateBudgetRequest req) {
        User user = getAuthenticatedUser();
        Budget updated = budgetService.updateBudget(id, req, user);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete budget", description = "Delete a budget")
    public ResponseEntity<Void> deleteBudget(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        budgetService.deleteBudget(id, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/status")
    @Operation(summary = "Get budgets status", description = "Get budgets status with spending progress")
    public ResponseEntity<List<BudgetStatusResponse>> getBudgetStatuses() {
        User user = getAuthenticatedUser();
        List<BudgetStatusResponse> statuses = budgetService.getBudgetStatuses(user);
        return ResponseEntity.ok(statuses);
    }
}
