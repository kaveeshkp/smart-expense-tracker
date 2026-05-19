package com.smart.expense_tracker.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.smart.expense_tracker.dto.CreateExpenseRequest;
import com.smart.expense_tracker.entity.Category;
import com.smart.expense_tracker.entity.Expense;
import com.smart.expense_tracker.entity.User;
import com.smart.expense_tracker.repository.CategoryRepository;
import com.smart.expense_tracker.repository.ExpenseRepository;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final CategoryRepository categoryRepository;

    public ExpenseService(ExpenseRepository expenseRepository, CategoryRepository categoryRepository) {
        this.expenseRepository = expenseRepository;
        this.categoryRepository = categoryRepository;
    }

    public Expense createExpense(User user, CreateExpenseRequest req) {
        Expense e = new Expense();
        e.setUser(user);
        if (req.getCategoryId() != null) {
            Optional<Category> cat = categoryRepository.findById(req.getCategoryId());
            cat.ifPresent(e::setCategory);
        }
        e.setTitle(req.getTitle());
        e.setAmount(req.getAmount());
        e.setDate(req.getDate());
        e.setNotes(req.getNotes());
        e.setAiCategorized(false);
        e.setCreatedAt(LocalDateTime.now());

        return expenseRepository.save(e);
    }
}
