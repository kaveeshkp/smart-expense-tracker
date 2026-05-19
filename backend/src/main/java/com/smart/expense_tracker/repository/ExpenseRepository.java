package com.smart.expense_tracker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smart.expense_tracker.entity.Expense;
import com.smart.expense_tracker.entity.User;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUserOrderByDateDesc(User user);
    List<Expense> findByUserAndDateBetweenOrderByDateDesc(User user, java.time.LocalDate start, java.time.LocalDate end);
}