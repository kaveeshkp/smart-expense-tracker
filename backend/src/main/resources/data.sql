-- Seed default categories (MERGE to avoid duplicates on restart)
MERGE INTO categories (id, name, icon, color) KEY(name) VALUES
(1, 'Food & Dining', 'Utensils', '#ef4444'),
(2, 'Shopping', 'ShoppingBag', '#3b82f6'),
(3, 'Transportation', 'Car', '#10b981'),
(4, 'Entertainment', 'Film', '#f59e0b'),
(5, 'Housing', 'Home', '#8b5cf6'),
(6, 'Utilities', 'Zap', '#06b6d4'),
(7, 'Health', 'HeartPulse', '#ec4899'),
(8, 'Education', 'GraduationCap', '#14b8a6'),
(9, 'Others', 'CircleEllipsis', '#6b7280');
