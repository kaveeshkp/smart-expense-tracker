package com.smart.expense_tracker.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smart.expense_tracker.entity.Budget;
import com.smart.expense_tracker.entity.User;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByUser(User user);
    Optional<Budget> findByIdAndUser(Long id, User user);
}
