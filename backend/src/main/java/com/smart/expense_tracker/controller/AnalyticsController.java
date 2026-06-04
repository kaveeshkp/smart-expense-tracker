package com.smart.expense_tracker.controller;

import java.time.LocalDate;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.smart.expense_tracker.dto.BudgetStatusResponse;
import com.smart.expense_tracker.dto.CategoryBreakdownResponse;
import com.smart.expense_tracker.dto.ExpenseSummaryResponse;
import com.smart.expense_tracker.dto.MonthlyTrendResponse;
import com.smart.expense_tracker.entity.User;
import com.smart.expense_tracker.repository.UserRepository;
import com.smart.expense_tracker.service.AnalyticsService;
import com.smart.expense_tracker.service.BudgetService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/analytics")
@Tag(name = "Analytics", description = "Operations for getting financial reports and trends")
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final BudgetService budgetService;
    private final UserRepository userRepository;

    public AnalyticsController(AnalyticsService analyticsService, BudgetService budgetService, UserRepository userRepository) {
        this.analyticsService = analyticsService;
        this.budgetService = budgetService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new org.springframework.security.core.userdetails.UsernameNotFoundException("User not found"));
    }

    @GetMapping("/overview")
    @Operation(summary = "Get overview metrics", description = "Total spent, average daily spent, transaction count, MoM change")
    public ResponseEntity<ExpenseSummaryResponse> getOverview(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        User user = getAuthenticatedUser();
        ExpenseSummaryResponse summary = analyticsService.getOverview(user, startDate, endDate);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/by-category")
    @Operation(summary = "Get spending by category", description = "Spending breakdown by category with percentages")
    public ResponseEntity<List<CategoryBreakdownResponse>> getCategoryBreakdown(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        User user = getAuthenticatedUser();
        List<CategoryBreakdownResponse> breakdown = analyticsService.getCategoryBreakdown(user, startDate, endDate);
        return ResponseEntity.ok(breakdown);
    }

    @GetMapping("/monthly-trend")
    @Operation(summary = "Get monthly spending trend", description = "Spending trends over the last N months")
    public ResponseEntity<List<MonthlyTrendResponse>> getMonthlyTrend(
            @RequestParam(defaultValue = "12") int months) {
        User user = getAuthenticatedUser();
        List<MonthlyTrendResponse> trend = analyticsService.getMonthlyTrend(user, months);
        return ResponseEntity.ok(trend);
    }

    @GetMapping("/budget-status")
    @Operation(summary = "Get budget statuses", description = "Spending vs limit for all user budgets")
    public ResponseEntity<List<BudgetStatusResponse>> getBudgetStatus() {
        User user = getAuthenticatedUser();
        List<BudgetStatusResponse> status = budgetService.getBudgetStatuses(user);
        return ResponseEntity.ok(status);
    }
}
