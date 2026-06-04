package com.smart.expense_tracker.service;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.smart.expense_tracker.entity.Category;
import com.smart.expense_tracker.repository.CategoryRepository;

@Service
public class AiCategorizationService {
    private static final Logger logger = LoggerFactory.getLogger(AiCategorizationService.class);

    private final CategoryRepository categoryRepository;
    private final Map<String, String> keywordToCategory = new HashMap<>();

    public AiCategorizationService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
        initKeywords();
    }

    private void initKeywords() {
        // Transportation
        for (String kw : new String[]{"uber", "lyft", "taxi", "bus", "train", "metro", "subway", "parking", "gas station", "fuel", "petrol"}) {
            keywordToCategory.put(kw, "Transportation");
        }
        // Food & Dining
        for (String kw : new String[]{"restaurant", "cafe", "coffee", "starbucks", "mcdonald", "burger", "pizza", "sushi", "dining", "doordash", "grubhub", "ubereats"}) {
            keywordToCategory.put(kw, "Food & Dining");
        }
        // Entertainment
        for (String kw : new String[]{"netflix", "spotify", "hulu", "disney", "movie", "cinema", "theater", "concert", "gaming", "steam"}) {
            keywordToCategory.put(kw, "Entertainment");
        }
        // Shopping
        for (String kw : new String[]{"amazon", "walmart", "target", "costco", "ebay", "shopping", "store", "mall", "clothing"}) {
            keywordToCategory.put(kw, "Shopping");
        }
        // Housing
        for (String kw : new String[]{"rent", "mortgage", "property", "apartment", "housing", "lease"}) {
            keywordToCategory.put(kw, "Housing");
        }
        // Utilities
        for (String kw : new String[]{"electric", "electricity", "water", "gas", "internet", "wifi", "phone", "mobile", "utility"}) {
            keywordToCategory.put(kw, "Utilities");
        }
        // Healthcare
        for (String kw : new String[]{"doctor", "hospital", "pharmacy", "medicine", "dental", "health", "medical", "clinic"}) {
            keywordToCategory.put(kw, "Healthcare");
        }
        // Education
        for (String kw : new String[]{"school", "university", "college", "course", "tuition", "book", "education", "udemy", "coursera"}) {
            keywordToCategory.put(kw, "Education");
        }
        // Groceries
        for (String kw : new String[]{"grocery", "groceries", "supermarket", "whole foods", "trader joe", "aldi", "kroger"}) {
            keywordToCategory.put(kw, "Groceries");
        }
    }

    public Category categorize(String title) {
        if (title == null || title.isBlank()) return null;
        String lower = title.toLowerCase().trim();

        for (Map.Entry<String, String> entry : keywordToCategory.entrySet()) {
            if (lower.contains(entry.getKey())) {
                logger.info("AI categorized '{}' as '{}'", title, entry.getValue());
                return categoryRepository.findByName(entry.getValue()).orElse(null);
            }
        }
        return null;
    }
}
