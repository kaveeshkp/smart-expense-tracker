package com.smart.expense_tracker.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.smart.expense_tracker.dto.CreateRecurringExpenseRequest;
import com.smart.expense_tracker.dto.UpdateRecurringExpenseRequest;
import com.smart.expense_tracker.entity.Expense;
import com.smart.expense_tracker.entity.Frequency;
import com.smart.expense_tracker.entity.RecurringExpense;
import com.smart.expense_tracker.entity.User;
import com.smart.expense_tracker.exception.ResourceNotFoundException;
import com.smart.expense_tracker.repository.CategoryRepository;
import com.smart.expense_tracker.repository.ExpenseRepository;
import com.smart.expense_tracker.repository.RecurringExpenseRepository;

@Service
public class RecurringExpenseService {
    private static final Logger logger = LoggerFactory.getLogger(RecurringExpenseService.class);

    private final RecurringExpenseRepository recurringRepo;
    private final ExpenseRepository expenseRepository;
    private final CategoryRepository categoryRepository;

    public RecurringExpenseService(RecurringExpenseRepository recurringRepo, ExpenseRepository expenseRepository, CategoryRepository categoryRepository) {
        this.recurringRepo = recurringRepo;
        this.expenseRepository = expenseRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<RecurringExpense> getRecurringExpenses(User user) {
        return recurringRepo.findByUser(user);
    }

    public RecurringExpense getById(Long id, User user) {
        return recurringRepo.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Recurring expense not found: " + id));
    }

    @Transactional
    public RecurringExpense create(CreateRecurringExpenseRequest req, User user) {
        RecurringExpense re = new RecurringExpense();
        re.setUser(user);
        re.setTitle(req.getTitle());
        re.setAmount(req.getAmount());
        re.setNotes(req.getNotes());
        re.setFrequency(Frequency.valueOf(req.getFrequency().toUpperCase()));
        re.setNextDueDate(req.getNextDueDate());
        re.setIsActive(true);
        re.setCurrency(user.getPreferredCurrency() != null ? user.getPreferredCurrency() : "USD");
        if (req.getCategoryId() != null) {
            categoryRepository.findById(req.getCategoryId()).ifPresent(re::setCategory);
        }
        re.setCreatedAt(LocalDateTime.now());
        return recurringRepo.save(re);
    }

    @Transactional
    public RecurringExpense update(Long id, UpdateRecurringExpenseRequest req, User user) {
        RecurringExpense re = getById(id, user);
        re.setTitle(req.getTitle());
        re.setAmount(req.getAmount());
        re.setNotes(req.getNotes());
        re.setFrequency(Frequency.valueOf(req.getFrequency().toUpperCase()));
        re.setNextDueDate(req.getNextDueDate());
        if (req.getIsActive() != null) re.setIsActive(req.getIsActive());
        if (req.getCategoryId() != null) {
            categoryRepository.findById(req.getCategoryId()).ifPresent(re::setCategory);
        }
        return recurringRepo.save(re);
    }

    @Transactional
    public void delete(Long id, User user) {
        RecurringExpense re = getById(id, user);
        recurringRepo.delete(re);
    }

    @Transactional
    public void processRecurringExpenses() {
        LocalDate today = LocalDate.now();
        List<RecurringExpense> dueExpenses = recurringRepo.findByIsActiveTrueAndNextDueDateLessThanEqual(today);
        logger.info("Processing {} recurring expenses", dueExpenses.size());

        for (RecurringExpense re : dueExpenses) {
            Expense expense = new Expense();
            expense.setUser(re.getUser());
            expense.setTitle(re.getTitle());
            expense.setAmount(re.getAmount());
            expense.setDate(re.getNextDueDate());
            expense.setNotes(re.getNotes());
            expense.setCategory(re.getCategory());
            expense.setCurrency(re.getCurrency());
            expense.setAiCategorized(false);
            expense.setCreatedAt(LocalDateTime.now());
            expenseRepository.save(expense);

            // Advance next due date
            LocalDate next = re.getNextDueDate();
            switch (re.getFrequency()) {
                case DAILY: next = next.plusDays(1); break;
                case WEEKLY: next = next.plusWeeks(1); break;
                case MONTHLY: next = next.plusMonths(1); break;
                case YEARLY: next = next.plusYears(1); break;
            }
            re.setNextDueDate(next);
            recurringRepo.save(re);
            logger.info("Created expense from recurring '{}', next due: {}", re.getTitle(), next);
        }
    }
}
