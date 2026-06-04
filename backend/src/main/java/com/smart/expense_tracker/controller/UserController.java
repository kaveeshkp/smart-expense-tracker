package com.smart.expense_tracker.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.smart.expense_tracker.dto.ChangePasswordRequest;
import com.smart.expense_tracker.dto.UpdateProfileRequest;
import com.smart.expense_tracker.entity.User;
import com.smart.expense_tracker.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
@Tag(name = "Users", description = "Operations for user profile management")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    private String getAuthenticatedUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @GetMapping("/profile")
    @Operation(summary = "Get user profile", description = "Get details of the authenticated user profile")
    public ResponseEntity<User> getProfile() {
        String email = getAuthenticatedUserEmail();
        User user = userService.getProfile(email);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    @Operation(summary = "Update user profile", description = "Update full name, currency preference, and timezone")
    public ResponseEntity<User> updateProfile(@Valid @RequestBody UpdateProfileRequest req) {
        String email = getAuthenticatedUserEmail();
        User updated = userService.updateProfile(email, req);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/password")
    @Operation(summary = "Change password", description = "Change password with validation of old password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordRequest req) {
        String email = getAuthenticatedUserEmail();
        userService.changePassword(email, req);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    @Operation(summary = "Delete account", description = "Delete user account and cascade delete all associated data")
    public ResponseEntity<Void> deleteAccount() {
        String email = getAuthenticatedUserEmail();
        userService.deleteAccount(email);
        return ResponseEntity.noContent().build();
    }
}
