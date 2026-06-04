package com.smart.expense_tracker.scheduler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.smart.expense_tracker.service.RecurringExpenseService;

@Component
@EnableScheduling
public class RecurringExpenseScheduler {
    private static final Logger logger = LoggerFactory.getLogger(RecurringExpenseScheduler.class);

    private final RecurringExpenseService recurringExpenseService;

    public RecurringExpenseScheduler(RecurringExpenseService recurringExpenseService) {
        this.recurringExpenseService = recurringExpenseService;
    }

    @Scheduled(cron = "0 0 1 * * *") // Daily at 1 AM
    public void processRecurringExpenses() {
        logger.info("Executing scheduled recurring expenses process...");
        try {
            recurringExpenseService.processRecurringExpenses();
            logger.info("Scheduled recurring expenses process completed successfully.");
        } catch (Exception e) {
            logger.error("Error occurred while processing scheduled recurring expenses", e);
        }
    }
}
