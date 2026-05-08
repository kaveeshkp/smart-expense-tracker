package com.smart.expense_tracker.repository;

import com.smart.expense_tracker.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}