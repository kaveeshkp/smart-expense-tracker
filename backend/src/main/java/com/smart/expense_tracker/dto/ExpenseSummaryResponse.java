package com.smart.expense_tracker.dto;

import java.math.BigDecimal;

public class ExpenseSummaryResponse {

    private BigDecimal totalSpent;
    private BigDecimal avgDaily;
    private long transactionCount;
    private double monthOverMonthChange;

    public ExpenseSummaryResponse() {}

    public ExpenseSummaryResponse(BigDecimal totalSpent, BigDecimal avgDaily, long transactionCount, double monthOverMonthChange) {
        this.totalSpent = totalSpent;
        this.avgDaily = avgDaily;
        this.transactionCount = transactionCount;
        this.monthOverMonthChange = monthOverMonthChange;
    }

    public BigDecimal getTotalSpent() {
        return totalSpent;
    }

    public void setTotalSpent(BigDecimal totalSpent) {
        this.totalSpent = totalSpent;
    }

    public BigDecimal getAvgDaily() {
        return avgDaily;
    }

    public void setAvgDaily(BigDecimal avgDaily) {
        this.avgDaily = avgDaily;
    }

    public long getTransactionCount() {
        return transactionCount;
    }

    public void setTransactionCount(long transactionCount) {
        this.transactionCount = transactionCount;
    }

    public double getMonthOverMonthChange() {
        return monthOverMonthChange;
    }

    public void setMonthOverMonthChange(double monthOverMonthChange) {
        this.monthOverMonthChange = monthOverMonthChange;
    }
}
