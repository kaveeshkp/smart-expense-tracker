package com.smart.expense_tracker.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.smart.expense_tracker.dto.CategoryBreakdownResponse;
import com.smart.expense_tracker.dto.ExpenseSummaryResponse;
import com.smart.expense_tracker.dto.MonthlyTrendResponse;
import com.smart.expense_tracker.entity.Category;
import com.smart.expense_tracker.entity.User;
import com.smart.expense_tracker.repository.ExpenseRepository;

@Service
public class AnalyticsService {
    private final ExpenseRepository expenseRepository;

    public AnalyticsService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public ExpenseSummaryResponse getOverview(User user, LocalDate startDate, LocalDate endDate) {
        if (startDate == null) startDate = LocalDate.now().withDayOfMonth(1);
        if (endDate == null) endDate = LocalDate.now();

        BigDecimal totalSpent = expenseRepository.sumAmountByUserAndDateBetween(user, startDate, endDate);
        long txCount = expenseRepository.countByUserAndDateBetween(user, startDate, endDate);

        long days = ChronoUnit.DAYS.between(startDate, endDate) + 1;
        BigDecimal avgDaily = days > 0 ? totalSpent.divide(BigDecimal.valueOf(days), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO;

        // Month-over-month change
        LocalDate prevStart = startDate.minusMonths(1);
        LocalDate prevEnd = endDate.minusMonths(1);
        BigDecimal prevTotal = expenseRepository.sumAmountByUserAndDateBetween(user, prevStart, prevEnd);
        double momChange = 0.0;
        if (prevTotal.compareTo(BigDecimal.ZERO) > 0) {
            momChange = totalSpent.subtract(prevTotal).doubleValue() / prevTotal.doubleValue() * 100.0;
            momChange = Math.round(momChange * 100.0) / 100.0;
        }

        return new ExpenseSummaryResponse(totalSpent, avgDaily, txCount, momChange);
    }

    public List<CategoryBreakdownResponse> getCategoryBreakdown(User user, LocalDate startDate, LocalDate endDate) {
        if (startDate == null) startDate = LocalDate.now().withDayOfMonth(1);
        if (endDate == null) endDate = LocalDate.now();

        List<Object[]> results = expenseRepository.sumAmountGroupByCategory(user, startDate, endDate);
        BigDecimal total = expenseRepository.sumAmountByUserAndDateBetween(user, startDate, endDate);

        List<CategoryBreakdownResponse> breakdowns = new ArrayList<>();
        for (Object[] row : results) {
            Category cat = (Category) row[0];
            BigDecimal catTotal = (BigDecimal) row[1];
            long cnt = (long) row[2];
            double pct = total.compareTo(BigDecimal.ZERO) > 0
                    ? catTotal.doubleValue() / total.doubleValue() * 100.0 : 0.0;

            breakdowns.add(new CategoryBreakdownResponse(
                    cat.getId(), cat.getName(), cat.getColor(), cat.getIcon(),
                    catTotal, Math.round(pct * 100.0) / 100.0, cnt
            ));
        }
        return breakdowns;
    }

    public List<MonthlyTrendResponse> getMonthlyTrend(User user, int months) {
        LocalDate startDate = LocalDate.now().minusMonths(months).withDayOfMonth(1);
        List<Object[]> results = expenseRepository.getMonthlyTrend(user, startDate);

        List<MonthlyTrendResponse> trends = new ArrayList<>();
        for (Object[] row : results) {
            String month = (String) row[0];
            BigDecimal total = (BigDecimal) row[1];
            long cnt = (long) row[2];
            trends.add(new MonthlyTrendResponse(month, total, cnt));
        }
        return trends;
    }
}
