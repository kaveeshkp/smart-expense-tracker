package com.smart.expense_tracker.service;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;

import com.smart.expense_tracker.dto.CreateExpenseRequest;
import com.smart.expense_tracker.entity.Category;
import com.smart.expense_tracker.entity.Expense;
import com.smart.expense_tracker.entity.User;
import com.smart.expense_tracker.repository.CategoryRepository;
import com.smart.expense_tracker.repository.ExpenseRepository;

class ExpenseServiceTest {

    @Test
    void createExpensePersistsEntity() {
        ExpenseRepository repo = Mockito.mock(ExpenseRepository.class);
        CategoryRepository crepo = Mockito.mock(CategoryRepository.class);

        User user = new User();
        user.setId(2L);
        user.setEmail("u@example.com");

        Category cat = new Category();
        cat.setId(5L);
        cat.setName("Food");

        Mockito.when(crepo.findById(5L)).thenReturn(java.util.Optional.of(cat));

        ArgumentCaptor<Expense> cap = ArgumentCaptor.forClass(Expense.class);
        Mockito.when(repo.save(cap.capture())).thenAnswer(i -> i.getArgument(0));

        ExpenseService svc = new ExpenseService(repo, crepo);

        CreateExpenseRequest req = new CreateExpenseRequest();
        req.setTitle("Dinner");
        req.setAmount(new BigDecimal("23.45"));
        req.setDate(LocalDate.now());
        req.setCategoryId(5L);
        req.setNotes("Test meal");

        Expense saved = svc.createExpense(user, req);

        Expense captured = cap.getValue();
        assertNotNull(captured);
        assertEquals("Dinner", captured.getTitle());
        assertEquals(new BigDecimal("23.45"), captured.getAmount());
        assertEquals(cat.getName(), captured.getCategory().getName());
    }
}
