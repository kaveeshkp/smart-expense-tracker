package com.smart.expense_tracker.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smart.expense_tracker.dto.CreateExpenseRequest;
import com.smart.expense_tracker.repository.UserRepository;
import com.smart.expense_tracker.service.ExpenseService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
    @RequestMapping("/expenses")
@Tag(name = "Expenses", description = "Operations for managing expenses")
public class ExpenseController {

    private final ExpenseService expenseService;
    private final UserRepository userRepository;

    public ExpenseController(ExpenseService expenseService, UserRepository userRepository) {
        this.expenseService = expenseService;
        this.userRepository = userRepository;
    }

    @PostMapping
    @Operation(summary = "Create expense", description = "Create a new expense for the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Expense created", content = @Content(schema = @Schema(implementation = Object.class))),
            @ApiResponse(responseCode = "400", description = "Validation failed"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<?> createExpense(@Valid @RequestBody CreateExpenseRequest req) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        var userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        var expense = expenseService.createExpense(userOpt.get(), req);
        return new ResponseEntity<>(expense, HttpStatus.CREATED);
    }
}
