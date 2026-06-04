package com.smart.expense_tracker.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.smart.expense_tracker.dto.CreateRecurringExpenseRequest;
import com.smart.expense_tracker.dto.UpdateRecurringExpenseRequest;
import com.smart.expense_tracker.entity.RecurringExpense;
import com.smart.expense_tracker.entity.User;
import com.smart.expense_tracker.repository.UserRepository;
import com.smart.expense_tracker.service.RecurringExpenseService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/recurring-expenses")
@Tag(name = "Recurring Expenses", description = "Operations for managing recurring expense templates")
public class RecurringExpenseController {

    private final RecurringExpenseService recurringExpenseService;
    private final UserRepository userRepository;

    public RecurringExpenseController(RecurringExpenseService recurringExpenseService, UserRepository userRepository) {
        this.recurringExpenseService = recurringExpenseService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new org.springframework.security.core.userdetails.UsernameNotFoundException("User not found"));
    }

    @GetMapping
    @Operation(summary = "Get recurring expenses", description = "Get list of all recurring expenses for the authenticated user")
    public ResponseEntity<List<RecurringExpense>> getRecurringExpenses() {
        User user = getAuthenticatedUser();
        List<RecurringExpense> list = recurringExpenseService.getRecurringExpenses(user);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get recurring expense by ID", description = "Get details of a recurring expense")
    public ResponseEntity<RecurringExpense> getRecurringExpenseById(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        RecurringExpense item = recurringExpenseService.getById(id, user);
        return ResponseEntity.ok(item);
    }

    @PostMapping
    @Operation(summary = "Create recurring expense", description = "Create a new recurring expense template")
    public ResponseEntity<RecurringExpense> createRecurringExpense(@Valid @RequestBody CreateRecurringExpenseRequest req) {
        User user = getAuthenticatedUser();
        RecurringExpense created = recurringExpenseService.create(req, user);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update recurring expense", description = "Update an existing recurring expense template")
    public ResponseEntity<RecurringExpense> updateRecurringExpense(
            @PathVariable Long id,
            @Valid @RequestBody UpdateRecurringExpenseRequest req) {
        User user = getAuthenticatedUser();
        RecurringExpense updated = recurringExpenseService.update(id, req, user);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete recurring expense", description = "Delete a recurring expense template")
    public ResponseEntity<Void> deleteRecurringExpense(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        recurringExpenseService.delete(id, user);
        return ResponseEntity.noContent().build();
    }
}
