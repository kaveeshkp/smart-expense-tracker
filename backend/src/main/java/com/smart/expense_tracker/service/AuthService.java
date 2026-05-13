package com.smart.expense_tracker.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.smart.expense_tracker.dto.AuthRequest;
import com.smart.expense_tracker.dto.AuthResponse;
import com.smart.expense_tracker.dto.LoginRequest;
import com.smart.expense_tracker.entity.User;
import com.smart.expense_tracker.exception.EmailAlreadyExistsException;
import com.smart.expense_tracker.exception.InvalidCredentialsException;
import com.smart.expense_tracker.repository.UserRepository;
import com.smart.expense_tracker.security.JwtUtil;

@Service
public class AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse register(AuthRequest request) {
        logger.info("Attempting to register user with email: {}", request.getEmail());

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            logger.warn("Registration failed: Email already exists - {}", request.getEmail());
            throw new EmailAlreadyExistsException(request.getEmail());
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user = userRepository.save(user);
        logger.info("User registered successfully: {}", user.getId());

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getFullName(), user.getId());
    }

    public AuthResponse login(LoginRequest request) {
        logger.info("Attempting to login user with email: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    logger.warn("Login failed: User not found - {}", request.getEmail());
                    return new InvalidCredentialsException();
                });

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            logger.warn("Login failed: Invalid password for user - {}", request.getEmail());
            throw new InvalidCredentialsException();
        }

        logger.info("User logged in successfully: {}", user.getId());
        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getFullName(), user.getId());
    }
}