package com.smart.expense_tracker.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.smart.expense_tracker.entity.Category;
import com.smart.expense_tracker.entity.Expense;
import com.smart.expense_tracker.entity.User;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUserOrderByDateDesc(User user);
    List<Expense> findByUserAndDateBetweenOrderByDateDesc(User user, LocalDate start, LocalDate end);

    Page<Expense> findByUser(User user, Pageable pageable);
    Page<Expense> findByUserAndCategory(User user, Category category, Pageable pageable);
    Page<Expense> findByUserAndDateBetween(User user, LocalDate start, LocalDate end, Pageable pageable);
    Page<Expense> findByUserAndCategoryAndDateBetween(User user, Category category, LocalDate start, LocalDate end, Pageable pageable);
    Page<Expense> findByUserAndTitleContainingIgnoreCase(User user, String title, Pageable pageable);

    Optional<Expense> findByIdAndUser(Long id, User user);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user = :user AND e.date BETWEEN :start AND :end")
    BigDecimal sumAmountByUserAndDateBetween(@Param("user") User user, @Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT COUNT(e) FROM Expense e WHERE e.user = :user AND e.date BETWEEN :start AND :end")
    long countByUserAndDateBetween(@Param("user") User user, @Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT e.category, COALESCE(SUM(e.amount), 0) as total, COUNT(e) as cnt FROM Expense e WHERE e.user = :user AND e.date BETWEEN :start AND :end AND e.category IS NOT NULL GROUP BY e.category ORDER BY total DESC")
    List<Object[]> sumAmountGroupByCategory(@Param("user") User user, @Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT FORMATDATETIME(e.date, 'yyyy-MM') as month, COALESCE(SUM(e.amount), 0) as total, COUNT(e) as cnt FROM Expense e WHERE e.user = :user AND e.date >= :startDate GROUP BY FORMATDATETIME(e.date, 'yyyy-MM') ORDER BY month ASC")
    List<Object[]> getMonthlyTrend(@Param("user") User user, @Param("startDate") LocalDate startDate);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user = :user AND e.category = :category AND e.date BETWEEN :start AND :end")
    BigDecimal sumAmountByUserAndCategoryAndDateBetween(@Param("user") User user, @Param("category") Category category, @Param("start") LocalDate start, @Param("end") LocalDate end);
}