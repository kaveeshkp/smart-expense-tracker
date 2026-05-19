package com.smart.expense_tracker.controller;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.Optional;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smart.expense_tracker.entity.User;
import com.smart.expense_tracker.repository.UserRepository;
import com.smart.expense_tracker.service.ReportService;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;
    private final UserRepository userRepository;

    public ReportController(ReportService reportService, UserRepository userRepository) {
        this.reportService = reportService;
        this.userRepository = userRepository;
    }

    @GetMapping("/financial")
    public ResponseEntity<byte[]> downloadReport(
            @RequestParam(name = "format", defaultValue = "csv") String format,
            @RequestParam(name = "start") String start,
            @RequestParam(name = "end") String end
    ) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return ResponseEntity.status(401).build();
        User user = userOpt.get();

        LocalDate startDate;
        LocalDate endDate;
        try {
            startDate = LocalDate.parse(start);
            endDate = LocalDate.parse(end);
        } catch (DateTimeParseException ex) {
            return ResponseEntity.badRequest().body(("Invalid date format: " + ex.getMessage()).getBytes());
        }

        if (!format.equalsIgnoreCase("csv") && !format.equalsIgnoreCase("pdf")) {
            return ResponseEntity.badRequest().body(("Unsupported format: " + format).getBytes());
        }

        if (endDate.isBefore(startDate)) {
            return ResponseEntity.badRequest().body(("End date must be on or after start date").getBytes());
        }

        // limit range to 1 year for performance
        if (startDate.plusDays(366).isBefore(endDate)) {
            return ResponseEntity.badRequest().body(("Date range too large; max 1 year").getBytes());
        }

        byte[] content;
        String filename;
        MediaType mediaType;
        if (format.equalsIgnoreCase("csv")) {
            content = reportService.generateCsvReport(user, startDate, endDate);
            filename = String.format("financial-report-%s_to_%s.csv", startDate, endDate);
            mediaType = MediaType.TEXT_PLAIN;
        } else {
            content = reportService.generatePdfReport(user, startDate, endDate);
            filename = String.format("financial-report-%s_to_%s.pdf", startDate, endDate);
            mediaType = MediaType.APPLICATION_PDF;
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(mediaType)
                .body(content);
    }
}
