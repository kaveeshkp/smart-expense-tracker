package com.smart.expensetracker.repository;

import com.smart.expensetracker.entity.Expense;
import com.smart.expensetracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUserOrderByDateDesc(User user);
}