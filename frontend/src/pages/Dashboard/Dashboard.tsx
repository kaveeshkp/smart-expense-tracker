import { useState } from 'react';
import { useAnalyticsOverview, useCategoryBreakdown, useMonthlyTrend } from '../../hooks/useAnalytics';
import { useExpenses } from '../../hooks/useExpenses';
import PageLayout from '../../components/ui/PageLayout';
import StatCard from '../../components/ui/StatCard';
import SpendingTrendChart from '../../components/charts/SpendingTrendChart';
import CategoryPieChart from '../../components/charts/CategoryPieChart';
import AddExpenseForm from '../../components/AddExpenseForm';
import { format } from 'date-fns';
import { ArrowUpRight, TrendingUp, TrendingDown, DollarSign, Calendar, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [dateRange] = useState({
    startDate: format(new Date().setDate(1), 'yyyy-MM-dd'), // Start of month
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });

  const { data: overview, isLoading: overviewLoading } = useAnalyticsOverview(dateRange.startDate, dateRange.endDate);
  const { data: categories, isLoading: categoriesLoading } = useCategoryBreakdown(dateRange.startDate, dateRange.endDate);
  const { data: recentExpensesData, isLoading: recentLoading } = useExpenses({ size: 5, sort: 'date,desc' });
  const { data: monthlyTrend } = useMonthlyTrend(6);

  const isLoading = overviewLoading || categoriesLoading || recentLoading;

  // Format currency
  const formatCurrency = (val: number | undefined) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val || 0);
  };

  const recentExpenses = recentExpensesData?.content || [];

  return (
    <PageLayout 
      title="Dashboard" 
      onAddExpense={() => setShowAddForm(true)}
      actions={
        <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
          <ArrowUpRight size={16} /> New Transaction
        </button>
      }
    >
      {isLoading ? (
        <div className="grid-4" style={{ marginBottom: 'var(--space-lg)' }}>
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="skeleton" style={{ height: 140, borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      ) : (
        <div className="grid-4" style={{ marginBottom: 'var(--space-lg)' }}>
          <StatCard
            icon={DollarSign}
            label="Total Spent (This Month)"
            value={formatCurrency(overview?.totalSpent)}
            trend={
              overview?.monthOverMonthChange !== undefined
                ? {
                    value: Math.abs(overview.monthOverMonthChange),
                    isPositive: overview.monthOverMonthChange < 0, // Negative MoM change is good for expenses
                  }
                : undefined
            }
          />
          <StatCard
            icon={Calendar}
            label="Daily Average"
            value={formatCurrency(overview?.avgDaily)}
          />
          <StatCard
            icon={ArrowUpRight}
            label="Transactions"
            value={overview?.transactionCount || 0}
          />
          <StatCard
            icon={overview?.monthOverMonthChange && overview.monthOverMonthChange > 0 ? TrendingUp : TrendingDown}
            label="MoM Comparison"
            value={`${overview?.monthOverMonthChange || 0}%`}
            color={overview?.monthOverMonthChange && overview.monthOverMonthChange > 0 ? 'var(--color-danger)' : 'var(--color-success)'}
          />
        </div>
      )}

      {/* Charts Section */}
      <div className="grid-3" style={{ marginBottom: 'var(--space-lg)', alignItems: 'stretch' }}>
        <div className="card" style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <h2 className="section-title">Spending Trend</h2>
          </div>
          <div className="card-body" style={{ flex: 1, minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {monthlyTrend && monthlyTrend.length > 0 ? (
              <SpendingTrendChart data={monthlyTrend} />
            ) : (
              <div style={{ color: 'var(--color-text-muted)' }}>No trend data available</div>
            )}
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <h2 className="section-title">Category Breakdown</h2>
          </div>
          <div className="card-body" style={{ flex: 1, minHeight: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {categories && categories.length > 0 ? (
              <CategoryPieChart data={categories} />
            ) : (
              <div style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>No category data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions & Actions */}
      <div className="card">
        <div className="card-header">
          <h2 className="section-title">Recent Transactions</h2>
          <Link to="/transactions" className="btn btn-ghost btn-sm">View All</Link>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {isLoading ? (
            <div style={{ padding: 'var(--space-lg)' }}>
              {[1, 2, 3].map(n => (
                <div key={n} className="skeleton" style={{ height: 48, marginBottom: 8, borderRadius: 'var(--radius-sm)' }} />
              ))}
            </div>
          ) : recentExpenses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <DollarSign size={32} />
              </div>
              <h3 className="empty-state-title">No expenses recorded yet</h3>
              <p className="empty-state-description">Start tracking your spending by adding a new expense.</p>
              <button className="btn btn-primary" style={{ marginTop: 'var(--space-md)' }} onClick={() => setShowAddForm(true)}>
                Add First Expense
              </button>
            </div>
          ) : (
            <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentExpenses.map((expense) => (
                    <tr key={expense.id}>
                      <td>{format(new Date(expense.date), 'MMM dd, yyyy')}</td>
                      <td style={{ fontWeight: 'var(--font-weight-medium)' }}>{expense.title}</td>
                      <td>
                        <span 
                          className="badge" 
                          style={{ 
                            backgroundColor: expense.category?.color ? `${expense.category.color}20` : 'rgba(255,255,255,0.05)', 
                            color: expense.category?.color || 'var(--color-text-secondary)',
                            border: `1px solid ${expense.category?.color || 'transparent'}40`
                          }}
                        >
                          {expense.category?.name || 'Uncategorized'}
                        </span>
                      </td>
                      <td style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
                        {formatCurrency(expense.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showAddForm && (
        <AddExpenseForm onClose={() => setShowAddForm(false)} />
      )}
    </PageLayout>
  );
}