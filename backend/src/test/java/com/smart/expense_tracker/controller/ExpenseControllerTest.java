package com.smart.expense_tracker.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smart.expense_tracker.dto.CreateExpenseRequest;
import com.smart.expense_tracker.entity.User;
import com.smart.expense_tracker.repository.UserRepository;
import com.smart.expense_tracker.service.ExpenseService;

class ExpenseControllerTest {

    private MockMvc mockMvc;
    private ExpenseService expenseService;
    private UserRepository userRepository;
    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setup() {
        objectMapper.findAndRegisterModules();
        userRepository = Mockito.mock(UserRepository.class);
        // Use a lightweight stub for ExpenseService to avoid Mockito issues with final/classes
        expenseService = new ExpenseService(null, null) {
            @Override
            public com.smart.expense_tracker.entity.Expense createExpense(com.smart.expense_tracker.entity.User user, com.smart.expense_tracker.dto.CreateExpenseRequest req) {
                com.smart.expense_tracker.entity.Expense e = new com.smart.expense_tracker.entity.Expense();
                e.setTitle(req.getTitle());
                e.setAmount(req.getAmount());
                e.setDate(req.getDate());
                return e;
            }
        };
        ExpenseController controller = new ExpenseController(expenseService, userRepository);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();

        org.springframework.security.authentication.UsernamePasswordAuthenticationToken auth =
            new org.springframework.security.authentication.UsernamePasswordAuthenticationToken("test@example.com", null, java.util.List.of());
        org.springframework.security.core.context.SecurityContext sc = SecurityContextHolder.createEmptyContext();
        sc.setAuthentication(auth);
        SecurityContextHolder.setContext(sc);
    }

    @Test
    void postCreatesExpense() throws Exception {
        User u = new User();
        u.setId(10L);
        u.setEmail("test@example.com");
        Mockito.when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(u));

        CreateExpenseRequest req = new CreateExpenseRequest();
        req.setTitle("Test");
        req.setAmount(new BigDecimal("12.34"));
        req.setDate(LocalDate.now());

        mockMvc.perform(post("/api/expenses")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated());
    }
}
