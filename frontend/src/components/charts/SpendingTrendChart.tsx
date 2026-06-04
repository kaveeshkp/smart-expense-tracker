import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { MonthlyTrend } from '../../types';
import { format, parseISO } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

interface SpendingTrendChartProps {
  data: MonthlyTrend[];
}

export default function SpendingTrendChart({ data }: SpendingTrendChartProps) {
  const labels = data.map(d => {
    try {
      return format(parseISO(d.month + '-01'), 'MMM yyyy');
    } catch {
      return d.month;
    }
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Total Spent',
        data: data.map(d => d.totalSpent),
        borderColor: '#8b5cf6',
        backgroundColor: (ctx: { chart: ChartJS }) => {
          const chart = ctx.chart;
          const { ctx: context, chartArea } = chart;
          if (!chartArea) return 'rgba(139, 92, 246, 0.1)';
          const gradient = context.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)');
          gradient.addColorStop(1, 'rgba(139, 92, 246, 0.0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1a1a3e',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        titleColor: '#ffffff',
        bodyColor: 'rgba(255,255,255,0.7)',
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (ctx: { parsed: { y: number } }) =>
            `Spent: $${ctx.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: {
          color: 'rgba(255,255,255,0.5)',
          font: { size: 11 },
          callback: (value: string | number) => `$${Number(value).toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="section-title">Spending Trend</h3>
      </div>
      <div className="card-body" style={{ height: '300px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
