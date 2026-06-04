package com.smart.expense_tracker.controller;

import java.io.IOException;
import java.nio.file.Files;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.smart.expense_tracker.entity.Expense;
import com.smart.expense_tracker.entity.User;
import com.smart.expense_tracker.repository.ExpenseRepository;
import com.smart.expense_tracker.repository.UserRepository;
import com.smart.expense_tracker.service.ExpenseService;
import com.smart.expense_tracker.service.FileStorageService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/expenses")
@Tag(name = "File Uploads", description = "Operations for uploading and downloading expense receipt images")
public class FileUploadController {

    private final FileStorageService fileStorageService;
    private final ExpenseService expenseService;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public FileUploadController(FileStorageService fileStorageService, ExpenseService expenseService,
                                ExpenseRepository expenseRepository, UserRepository userRepository) {
        this.fileStorageService = fileStorageService;
        this.expenseService = expenseService;
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new org.springframework.security.core.userdetails.UsernameNotFoundException("User not found"));
    }

    @PostMapping("/{id}/receipt")
    @Operation(summary = "Upload receipt", description = "Upload a receipt image for a specific expense")
    public ResponseEntity<Expense> uploadReceipt(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        
        User user = getAuthenticatedUser();
        Expense expense = expenseService.getExpenseById(id, user);

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Delete old receipt file if it exists
        if (expense.getReceiptUrl() != null) {
            try {
                fileStorageService.deleteFile(expense.getReceiptUrl());
            } catch (Exception e) {
                // Ignore failure to delete old file
            }
        }

        String filename = fileStorageService.storeFile(file, id);
        expense.setReceiptUrl(filename);
        Expense updated = expenseRepository.save(expense);
        
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}/receipt")
    @Operation(summary = "Get receipt", description = "Download/view the receipt image for an expense")
    public ResponseEntity<Resource> getReceipt(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        Expense expense = expenseService.getExpenseById(id, user);

        if (expense.getReceiptUrl() == null) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = fileStorageService.loadFile(expense.getReceiptUrl());
        String contentType = "application/octet-stream";
        try {
            contentType = Files.probeContentType(resource.getFile().toPath());
        } catch (IOException e) {
            // Use default octet-stream
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
