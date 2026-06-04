package com.smart.expense_tracker.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.smart.expense_tracker.dto.ChangePasswordRequest;
import com.smart.expense_tracker.dto.UpdateProfileRequest;
import com.smart.expense_tracker.entity.User;
import com.smart.expense_tracker.exception.InvalidCredentialsException;
import com.smart.expense_tracker.exception.ResourceNotFoundException;
import com.smart.expense_tracker.repository.UserRepository;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User getProfile(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Transactional
    public User updateProfile(String email, UpdateProfileRequest req) {
        User user = getProfile(email);
        user.setFullName(req.getFullName());
        if (req.getPreferredCurrency() != null) user.setPreferredCurrency(req.getPreferredCurrency());
        if (req.getTimezone() != null) user.setTimezone(req.getTimezone());
        logger.info("Updated profile for user: {}", user.getId());
        return userRepository.save(user);
    }

    @Transactional
    public void changePassword(String email, ChangePasswordRequest req) {
        User user = getProfile(email);
        if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPassword())) {
            throw new InvalidCredentialsException();
        }
        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
        logger.info("Password changed for user: {}", user.getId());
    }

    @Transactional
    public void deleteAccount(String email) {
        User user = getProfile(email);
        userRepository.delete(user);
        logger.info("Account deleted for user: {}", user.getId());
    }
}
