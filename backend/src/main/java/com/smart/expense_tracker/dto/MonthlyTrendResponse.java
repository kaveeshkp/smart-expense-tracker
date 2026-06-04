package com.smart.expense_tracker.dto;

import java.math.BigDecimal;

public class MonthlyTrendResponse {

    private String month;
    private BigDecimal totalSpent;
    private long transactionCount;

    public MonthlyTrendResponse() {}

    public MonthlyTrendResponse(String month, BigDecimal totalSpent, long transactionCount) {
        this.month = month;
        this.totalSpent = totalSpent;
        this.transactionCount = transactionCount;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public BigDecimal getTotalSpent() {
        return totalSpent;
    }

    public void setTotalSpent(BigDecimal totalSpent) {
        this.totalSpent = totalSpent;
    }

    public long getTransactionCount() {
        return transactionCount;
    }

    public void setTransactionCount(long transactionCount) {
        this.transactionCount = transactionCount;
    }
}
