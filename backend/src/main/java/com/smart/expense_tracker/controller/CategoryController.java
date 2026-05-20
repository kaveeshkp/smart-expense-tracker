package com.smart.expense_tracker.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smart.expense_tracker.entity.Category;
import com.smart.expense_tracker.repository.CategoryRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
    @RequestMapping("/categories")
@Tag(name = "Categories", description = "Category lookup and management")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    @Operation(summary = "List categories")
    public List<Category> list() {
        return categoryRepository.findAll();
    }

    @PostMapping
    @Operation(summary = "Create category")
    public ResponseEntity<Category> create(@Valid @RequestBody Category c) {
        Category saved = categoryRepository.save(c);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }
}
