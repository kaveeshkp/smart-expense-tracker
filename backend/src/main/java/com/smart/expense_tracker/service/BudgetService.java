package com.smart.expense_tracker.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.smart.expense_tracker.dto.BudgetStatusResponse;
import com.smart.expense_tracker.dto.CreateBudgetRequest;
import com.smart.expense_tracker.dto.UpdateBudgetRequest;
import com.smart.expense_tracker.entity.Budget;
import com.smart.expense_tracker.entity.BudgetPeriod;
import com.smart.expense_tracker.entity.User;
import com.smart.expense_tracker.exception.ResourceNotFoundException;
import com.smart.expense_tracker.repository.BudgetRepository;
import com.smart.expense_tracker.repository.CategoryRepository;
import com.smart.expense_tracker.repository.ExpenseRepository;

@Service
public class BudgetService {
    private static final Logger logger = LoggerFactory.getLogger(BudgetService.class);

    private final BudgetRepository budgetRepository;
    private final CategoryRepository categoryRepository;
    private final ExpenseRepository expenseRepository;

    public BudgetService(BudgetRepository budgetRepository, CategoryRepository categoryRepository, ExpenseRepository expenseRepository) {
        this.budgetRepository = budgetRepository;
        this.categoryRepository = categoryRepository;
        this.expenseRepository = expenseRepository;
    }

    public List<Budget> getBudgets(User user) {
        return budgetRepository.findByUser(user);
    }

    public Budget getBudgetById(Long id, User user) {
        return budgetRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + id));
    }

    @Transactional
    public Budget createBudget(CreateBudgetRequest req, User user) {
        logger.info("Creating budget for user: {}", user.getId());
        Budget b = new Budget();
        b.setUser(user);
        b.setName(req.getName());
        b.setAmount(req.getAmount());
        b.setPeriod(BudgetPeriod.valueOf(req.getPeriod().toUpperCase()));
        b.setStartDate(req.getStartDate());
        b.setEndDate(req.getEndDate());
        if (req.getCategoryId() != null) {
            categoryRepository.findById(req.getCategoryId()).ifPresent(b::setCategory);
        }
        b.setCreatedAt(LocalDateTime.now());
        return budgetRepository.save(b);
    }

    @Transactional
    public Budget updateBudget(Long id, UpdateBudgetRequest req, User user) {
        logger.info("Updating budget {} for user: {}", id, user.getId());
        Budget b = getBudgetById(id, user);
        b.setName(req.getName());
        b.setAmount(req.getAmount());
        b.setPeriod(BudgetPeriod.valueOf(req.getPeriod().toUpperCase()));
        b.setStartDate(req.getStartDate());
        b.setEndDate(req.getEndDate());
        if (req.getCategoryId() != null) {
            categoryRepository.findById(req.getCategoryId()).ifPresent(b::setCategory);
        } else {
            b.setCategory(null);
        }
        return budgetRepository.save(b);
    }

    @Transactional
    public void deleteBudget(Long id, User user) {
        logger.info("Deleting budget {} for user: {}", id, user.getId());
        Budget b = getBudgetById(id, user);
        budgetRepository.delete(b);
    }

    public List<BudgetStatusResponse> getBudgetStatuses(User user) {
        List<Budget> budgets = budgetRepository.findByUser(user);
        List<BudgetStatusResponse> statuses = new ArrayList<>();

        for (Budget budget : budgets) {
            LocalDate start = budget.getStartDate();
            LocalDate end = budget.getEndDate() != null ? budget.getEndDate() : LocalDate.now();

            BigDecimal spent = BigDecimal.ZERO;
            if (budget.getCategory() != null) {
                spent = expenseRepository.sumAmountByUserAndCategoryAndDateBetween(user, budget.getCategory(), start, end);
            }

            double percentUsed = budget.getAmount().compareTo(BigDecimal.ZERO) > 0
                    ? spent.doubleValue() / budget.getAmount().doubleValue() * 100.0
                    : 0.0;

            BudgetStatusResponse status = new BudgetStatusResponse(
                    budget.getId(),
                    budget.getName(),
                    budget.getCategory() != null ? budget.getCategory().getName() : "All Categories",
                    budget.getAmount(),
                    spent,
                    Math.round(percentUsed * 100.0) / 100.0,
                    budget.getPeriod().name()
            );
            statuses.add(status);
        }
        return statuses;
    }
}
