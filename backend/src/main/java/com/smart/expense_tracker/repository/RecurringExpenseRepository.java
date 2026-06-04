package com.smart.expense_tracker.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smart.expense_tracker.entity.RecurringExpense;
import com.smart.expense_tracker.entity.User;

public interface RecurringExpenseRepository extends JpaRepository<RecurringExpense, Long> {
    List<RecurringExpense> findByUser(User user);
    Optional<RecurringExpense> findByIdAndUser(Long id, User user);
    List<RecurringExpense> findByIsActiveTrueAndNextDueDateLessThanEqual(LocalDate date);
}
