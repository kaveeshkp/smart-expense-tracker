package com.smart.expense_tracker.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.smart.expense_tracker.entity.Category;
import com.smart.expense_tracker.entity.Expense;
import com.smart.expense_tracker.entity.User;
import com.smart.expense_tracker.repository.ExpenseRepository;

class ReportServiceTest {

    @Test
    void generatesCsvAndPdf() {
        ExpenseRepository repo = Mockito.mock(ExpenseRepository.class);
        User user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");

        Expense e = new Expense();
        e.setId(1L);
        e.setUser(user);
        Category c = new Category();
        c.setName("Food");
        e.setCategory(c);
        e.setTitle("Lunch");
        e.setAmount(new BigDecimal("12.50"));
        e.setDate(LocalDate.now());

        Mockito.when(repo.findByUserAndDateBetweenOrderByDateDesc(Mockito.eq(user), Mockito.any(), Mockito.any()))
                .thenReturn(List.of(e));

        ReportService svc = new ReportService(repo);
        byte[] csv = svc.generateCsvReport(user, LocalDate.now().minusDays(1), LocalDate.now());
        byte[] pdf = svc.generatePdfReport(user, LocalDate.now().minusDays(1), LocalDate.now());

        assertTrue(csv.length > 0);
        assertTrue(pdf.length > 0);
    }
}
