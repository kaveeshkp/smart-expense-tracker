package com.smart.expense_tracker.controller;

import java.time.LocalDate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.smart.expense_tracker.dto.CreateExpenseRequest;
import com.smart.expense_tracker.dto.UpdateExpenseRequest;
import com.smart.expense_tracker.dto.ExpenseSummaryResponse;
import com.smart.expense_tracker.entity.Expense;
import com.smart.expense_tracker.entity.User;
import com.smart.expense_tracker.repository.UserRepository;
import com.smart.expense_tracker.service.ExpenseService;
import com.smart.expense_tracker.service.AnalyticsService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/expenses")
@Tag(name = "Expenses", description = "Operations for managing expenses")
public class ExpenseController {

    private final ExpenseService expenseService;
    private final AnalyticsService analyticsService;
    private final UserRepository userRepository;

    public ExpenseController(ExpenseService expenseService, AnalyticsService analyticsService, UserRepository userRepository) {
        this.expenseService = expenseService;
        this.analyticsService = analyticsService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new org.springframework.security.core.userdetails.UsernameNotFoundException("User not found"));
    }

    @PostMapping
    @Operation(summary = "Create expense", description = "Create a new expense for the authenticated user")
    public ResponseEntity<Expense> createExpense(@Valid @RequestBody CreateExpenseRequest req) {
        User user = getAuthenticatedUser();
        Expense expense = expenseService.createExpense(user, req);
        return new ResponseEntity<>(expense, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get paginated expenses", description = "Get expenses with pagination and filtering options")
    public ResponseEntity<Page<Expense>> getExpenses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "date,desc") String sort,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String search) {
        
        User user = getAuthenticatedUser();
        
        // Parse sort parameter (e.g. "date,desc")
        String[] sortParts = sort.split(",");
        Sort sortOrder = Sort.by(sortParts[0]);
        if (sortParts.length > 1 && sortParts[1].equalsIgnoreCase("desc")) {
            sortOrder = sortOrder.descending();
        } else {
            sortOrder = sortOrder.ascending();
        }
        
        Pageable pageable = PageRequest.of(page, size, sortOrder);
        Page<Expense> expenses = expenseService.getExpenses(user, categoryId, startDate, endDate, search, pageable);
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get expense by ID", description = "Get details of a specific expense")
    public ResponseEntity<Expense> getExpenseById(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        Expense expense = expenseService.getExpenseById(id, user);
        return ResponseEntity.ok(expense);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update expense", description = "Update an existing expense")
    public ResponseEntity<Expense> updateExpense(
            @PathVariable Long id,
            @Valid @RequestBody UpdateExpenseRequest req) {
        User user = getAuthenticatedUser();
        Expense updated = expenseService.updateExpense(id, req, user);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete expense", description = "Delete an expense")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        expenseService.deleteExpense(id, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/summary")
    @Operation(summary = "Get expense summary", description = "Get summary dashboard stats for a date range")
    public ResponseEntity<ExpenseSummaryResponse> getExpenseSummary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        User user = getAuthenticatedUser();
        ExpenseSummaryResponse summary = analyticsService.getOverview(user, startDate, endDate);
        return ResponseEntity.ok(summary);
    }
}
