package com.smart.expense_tracker.repository;

import com.smart.expense_tracker.entity.Expense;
import com.smart.expense_tracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUserOrderByDateDesc(User user);
}