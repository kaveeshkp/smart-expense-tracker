package com.smart.expense_tracker.exception;

public class EmailAlreadyExistsException extends RuntimeException {
    public EmailAlreadyExistsException(String email) {
        super("An account with email '" + email + "' already exists");
    }
}
