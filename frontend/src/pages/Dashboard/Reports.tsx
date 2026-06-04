import { useState } from 'react';
import { useCategoryBreakdown, useMonthlyTrend } from '../../hooks/useAnalytics';
import PageLayout from '../../components/ui/PageLayout';
import SpendingTrendChart from '../../components/charts/SpendingTrendChart';
import CategoryPieChart from '../../components/charts/CategoryPieChart';
import { Download, Calendar, BarChart2, PieChart, Info, FileText } from 'lucide-react';
import { format } from 'date-fns';
import API from '../../api/api';
import toast from 'react-hot-toast';

export default function Reports() {
  const [rangeType, setRangeType] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [downloadFormat, setDownloadFormat] = useState<'csv' | 'pdf'>('pdf');
  const [isDownloading, setIsDownloading] = useState(false);

  // Helper to calculate date range
  const getDates = (type: string) => {
    const end = new Date();
    const start = new Date();
    switch (type) {
      case 'week':
        start.setDate(end.getDate() - 7);
        break;
      case 'month':
        start.setMonth(end.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(end.getMonth() - 3);
        break;
      case 'year':
        start.setFullYear(end.getFullYear() - 1);
        break;
      default:
        start.setMonth(end.getMonth() - 1);
    }
    return {
      start: format(start, 'yyyy-MM-dd'),
      end: format(end, 'yyyy-MM-dd')
    };
  };

  const dates = getDates(rangeType);

  const { data: categories, isLoading: categoriesLoading } = useCategoryBreakdown(dates.start, dates.end);
  const { data: trendData, isLoading: trendLoading } = useMonthlyTrend(rangeType === 'year' ? 12 : 6);

  const handleDownload = async () => {
    setIsDownloading(true);
    const downloadToast = toast.loading(`Generating your ${downloadFormat.toUpperCase()} report...`);
    try {
      const resp = await API.get(`/reports/financial?format=${downloadFormat}&start=${dates.start}&end=${dates.end}`, {
        responseType: 'blob'
      });
      const blob = resp.data as Blob;
      const contentDisposition = resp.headers['content-disposition'] || '';
      const match = /filename="?(.*)"?/.exec(contentDisposition);
      const filename = match ? match[1] : `financial-report-${dates.start}_to_${dates.end}.${downloadFormat}`;
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Report downloaded successfully!', { id: downloadToast });
    } catch (err: any) {
      toast.error('Failed to download report. Please try again.', { id: downloadToast });
    } finally {
      setIsDownloading(false);
    }
  };

  const totalSpent = categories?.reduce((sum, cat) => sum + cat.totalSpent, 0) || 0;

  return (
    <PageLayout title="Financial Reports">
      {/* Date selector and download toolbar */}
      <div className="card" style={{ padding: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
        <div className="flex-between" style={{ gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <Calendar size={18} className="text-accent" />
            <select
              className="select"
              style={{ width: 'auto' }}
              value={rangeType}
              onChange={(e) => setRangeType(e.target.value as any)}
            >
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
              <option value="quarter">Past Quarter</option>
              <option value="year">Past Year</option>
            </select>
            <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
              ({dates.start} to {dates.end})
            </span>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'center' }}>
            <select
              className="select"
              style={{ width: 'auto', padding: '10px 14px' }}
              value={downloadFormat}
              onChange={(e) => setDownloadFormat(e.target.value as any)}
            >
              <option value="pdf">PDF Statement</option>
              <option value="csv">CSV Spreadsheets</option>
            </select>
            <button
              className="btn btn-primary"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              <Download size={16} />
              {isDownloading ? 'Downloading...' : 'Export'}
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stat Row */}
      <div className="grid-3" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="card" style={{ padding: 'var(--space-lg)' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Total Spent in Period
          </span>
          <p style={{ fontSize: '32px', fontWeight: 800, marginTop: 8 }}>
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalSpent)}
          </p>
        </div>
        <div className="card" style={{ padding: 'var(--space-lg)' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Categories Active
          </span>
          <p style={{ fontSize: '32px', fontWeight: 800, marginTop: 8 }}>
            {categories?.length || 0}
          </p>
        </div>
        <div className="card" style={{ padding: 'var(--space-lg)', background: 'var(--color-accent-gradient)', color: '#ffffff' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Report Status
          </span>
          <p style={{ fontSize: '20px', fontWeight: 700, marginTop: 8 }}>
            Ready to Export
          </p>
          <span style={{ fontSize: '12px', opacity: 0.8 }}>Range covers {rangeType}</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid-2" style={{ gap: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <h3 className="section-title"><BarChart2 size={16} style={{ marginRight: 6 }} />Spending Trends</h3>
          </div>
          <div className="card-body" style={{ flex: 1, minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {trendLoading ? (
              <div className="loading-spinner" />
            ) : trendData && trendData.length > 0 ? (
              <SpendingTrendChart data={trendData} />
            ) : (
              <div style={{ color: 'var(--color-text-muted)' }}>No trend data found.</div>
            )}
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <h3 className="section-title"><PieChart size={16} style={{ marginRight: 6 }} />Category Breakdown</h3>
          </div>
          <div className="card-body" style={{ flex: 1, minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {categoriesLoading ? (
              <div className="loading-spinner" />
            ) : categories && categories.length > 0 ? (
              <CategoryPieChart data={categories} />
            ) : (
              <div style={{ color: 'var(--color-text-muted)' }}>No category spending found.</div>
            )}
          </div>
        </div>
      </div>

      {/* Detailed breakdowns list */}
      <div className="card">
        <div className="card-header">
          <h3 className="section-title"><FileText size={16} style={{ marginRight: 6 }} />Detailed Category Summary</h3>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {categoriesLoading ? (
            <div style={{ padding: 'var(--space-lg)' }}>
              {[1, 2].map(n => (
                <div key={n} className="skeleton" style={{ height: 40, marginBottom: 8 }} />
              ))}
            </div>
          ) : !categories || categories.length === 0 ? (
            <div style={{ padding: 'var(--space-xl)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              No data in this date range.
            </div>
          ) : (
            <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Total Spent</th>
                    <th>Transaction Count</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.categoryId}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span 
                            style={{ 
                              width: 10, 
                              height: 10, 
                              borderRadius: '50%', 
                              backgroundColor: cat.categoryColor || 'var(--color-accent-primary)' 
                            }} 
                          />
                          <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>{cat.categoryName}</span>
                        </div>
                      </td>
                      <td>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cat.totalSpent)}</td>
                      <td>{cat.transactionCount} transactions</td>
                      <td>{cat.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}