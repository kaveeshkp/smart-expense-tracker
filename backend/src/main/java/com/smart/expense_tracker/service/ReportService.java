package com.smart.expense_tracker.service;

import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.smart.expense_tracker.entity.Expense;
import com.smart.expense_tracker.entity.User;
import com.smart.expense_tracker.repository.ExpenseRepository;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;

@Service
public class ReportService {

    private final ExpenseRepository expenseRepository;

    public ReportService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public byte[] generatePdfReport(User user, LocalDate start, LocalDate end) {
        List<Expense> expenses = expenseRepository.findByUserAndDateBetweenOrderByDateDesc(user, start, end);

        try (PDDocument doc = new PDDocument(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            PDPage page = new PDPage(PDRectangle.LETTER);
            doc.addPage(page);

            try (PDPageContentStream cs = new PDPageContentStream(doc, page)) {
                cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 16);
                cs.beginText();
                cs.newLineAtOffset(50, 750);
                cs.showText("Financial Report: " + start.toString() + " to " + end.toString());
                cs.endText();

                cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 10);
                float y = 720;
                cs.beginText();
                cs.newLineAtOffset(50, y);
                cs.showText(String.format("%-12s %-40s %-18s %10s", "Date", "Title", "Category", "Amount"));
                cs.endText();
                y -= 16;

                BigDecimal total = BigDecimal.ZERO;
                for (Expense e : expenses) {
                    if (y < 80) {
                        cs.close();
                        page = new PDPage(PDRectangle.LETTER);
                        doc.addPage(page);
                        y = 750;
                    }
                    String date = e.getDate() != null ? e.getDate().toString() : "";
                    String title = e.getTitle() != null ? e.getTitle() : "";
                    String cat = e.getCategory() != null ? e.getCategory().getName() : "Uncategorized";
                    String amount = e.getAmount() != null ? e.getAmount().toString() : "0";

                    cs.beginText();
                    cs.newLineAtOffset(50, y);
                    String line = String.format("%-12s %-40s %-18s %10s", date, trimTo(title, 40), trimTo(cat, 18), amount);
                    cs.showText(line);
                    cs.endText();
                    y -= 14;
                    if (e.getAmount() != null) total = total.add(e.getAmount());
                }

                // total
                if (y < 80) {
                    cs.close();
                    page = new PDPage(PDRectangle.LETTER);
                    doc.addPage(page);
                    y = 750;
                }
                cs.beginText();
                cs.newLineAtOffset(50, y - 8);
                cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 12);
                cs.showText("Total: " + total.toString());
                cs.endText();
            }

            doc.save(out);
            return out.toByteArray();
        } catch (Exception ex) {
            throw new RuntimeException("Failed to generate PDF report", ex);
        }
    }

    private String trimTo(String s, int len) {
        if (s == null) return "";
        return s.length() <= len ? s : s.substring(0, len - 3) + "...";
    }

    public byte[] generateCsvReport(User user, LocalDate start, LocalDate end) {
        List<Expense> expenses = expenseRepository.findByUserAndDateBetweenOrderByDateDesc(user, start, end);

        try (ByteArrayOutputStream out = new ByteArrayOutputStream(); PrintWriter writer = new PrintWriter(out)) {
            writer.println("Date,Title,Category,Amount,Notes");
            BigDecimal total = BigDecimal.ZERO;
            for (Expense e : expenses) {
                String date = e.getDate() != null ? e.getDate().toString() : "";
                String title = escapeCsv(e.getTitle());
                String cat = e.getCategory() != null ? escapeCsv(e.getCategory().getName()) : "Uncategorized";
                String amount = e.getAmount() != null ? e.getAmount().toString() : "0";
                String notes = escapeCsv(e.getNotes());
                writer.printf("%s,%s,%s,%s,%s\n", date, title, cat, amount, notes);
                if (e.getAmount() != null) total = total.add(e.getAmount());
            }
            writer.println();
            writer.printf("Total,%s\n", total.toString());
            writer.flush();
            return out.toByteArray();
        } catch (Exception ex) {
            throw new RuntimeException("Failed to generate CSV report", ex);
        }
    }

    private String escapeCsv(String s) {
        if (s == null) return "";
        if (s.contains(",") || s.contains("\"") || s.contains("\n")) {
            return "\"" + s.replace("\"", "\"\"") + "\"";
        }
        return s;
    }
}
