package com.smart.expense_tracker.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.smart.expense_tracker.dto.CreateExpenseRequest;
import com.smart.expense_tracker.dto.UpdateExpenseRequest;
import com.smart.expense_tracker.entity.Category;
import com.smart.expense_tracker.entity.Expense;
import com.smart.expense_tracker.entity.User;
import com.smart.expense_tracker.exception.ResourceNotFoundException;
import com.smart.expense_tracker.repository.CategoryRepository;
import com.smart.expense_tracker.repository.ExpenseRepository;

@Service
public class ExpenseService {
    private static final Logger logger = LoggerFactory.getLogger(ExpenseService.class);

    private final ExpenseRepository expenseRepository;
    private final CategoryRepository categoryRepository;
    private final AiCategorizationService aiCategorizationService;

    public ExpenseService(ExpenseRepository expenseRepository, CategoryRepository categoryRepository, AiCategorizationService aiCategorizationService) {
        this.expenseRepository = expenseRepository;
        this.categoryRepository = categoryRepository;
        this.aiCategorizationService = aiCategorizationService;
    }

    @Transactional
    public Expense createExpense(User user, CreateExpenseRequest req) {
        logger.info("Creating expense for user: {}", user.getId());
        Expense e = new Expense();
        e.setUser(user);
        if (req.getCategoryId() != null) {
            Optional<Category> cat = categoryRepository.findById(req.getCategoryId());
            cat.ifPresent(e::setCategory);
        } else {
            // Try AI categorization
            Category aiCat = aiCategorizationService.categorize(req.getTitle());
            if (aiCat != null) {
                e.setCategory(aiCat);
                e.setAiCategorized(true);
            }
        }
        e.setTitle(req.getTitle());
        e.setAmount(req.getAmount());
        e.setDate(req.getDate());
        e.setNotes(req.getNotes());
        if (e.getAiCategorized() == null) e.setAiCategorized(false);
        e.setCurrency(user.getPreferredCurrency() != null ? user.getPreferredCurrency() : "USD");
        e.setCreatedAt(LocalDateTime.now());

        return expenseRepository.save(e);
    }

    public Page<Expense> getExpenses(User user, Long categoryId, java.time.LocalDate startDate, java.time.LocalDate endDate, String search, Pageable pageable) {
        if (search != null && !search.isBlank()) {
            return expenseRepository.findByUserAndTitleContainingIgnoreCase(user, search.trim(), pageable);
        }
        if (categoryId != null && startDate != null && endDate != null) {
            Category cat = categoryRepository.findById(categoryId).orElse(null);
            if (cat != null) return expenseRepository.findByUserAndCategoryAndDateBetween(user, cat, startDate, endDate, pageable);
        }
        if (categoryId != null) {
            Category cat = categoryRepository.findById(categoryId).orElse(null);
            if (cat != null) return expenseRepository.findByUserAndCategory(user, cat, pageable);
        }
        if (startDate != null && endDate != null) {
            return expenseRepository.findByUserAndDateBetween(user, startDate, endDate, pageable);
        }
        return expenseRepository.findByUser(user, pageable);
    }

    public Expense getExpenseById(Long id, User user) {
        return expenseRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));
    }

    @Transactional
    public Expense updateExpense(Long id, UpdateExpenseRequest req, User user) {
        logger.info("Updating expense {} for user: {}", id, user.getId());
        Expense e = getExpenseById(id, user);
        e.setTitle(req.getTitle());
        e.setAmount(req.getAmount());
        e.setDate(req.getDate());
        e.setNotes(req.getNotes());
        if (req.getCategoryId() != null) {
            categoryRepository.findById(req.getCategoryId()).ifPresent(e::setCategory);
        } else {
            e.setCategory(null);
        }
        if (req.getCurrency() != null) e.setCurrency(req.getCurrency());
        return expenseRepository.save(e);
    }

    @Transactional
    public void deleteExpense(Long id, User user) {
        logger.info("Deleting expense {} for user: {}", id, user.getId());
        Expense e = getExpenseById(id, user);
        expenseRepository.delete(e);
    }
}
