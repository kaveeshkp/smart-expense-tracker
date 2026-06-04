import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { BudgetStatus } from '../../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BudgetProgressChartProps {
  data: BudgetStatus[];
}

function getColor(percent: number): string {
  if (percent >= 90) return '#ef4444';
  if (percent >= 75) return '#f59e0b';
  return '#10b981';
}

export default function BudgetProgressChart({ data }: BudgetProgressChartProps) {
  const chartData = {
    labels: data.map(d => d.budgetName || d.categoryName),
    datasets: [
      {
        label: 'Budget',
        data: data.map(d => d.budgetAmount),
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        borderColor: '#8b5cf6',
        borderWidth: 1,
        borderRadius: 6,
      },
      {
        label: 'Spent',
        data: data.map(d => d.spentAmount),
        backgroundColor: data.map(d => {
          const c = getColor(d.percentUsed);
          return c + '99';
        }),
        borderColor: data.map(d => getColor(d.percentUsed)),
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255,255,255,0.7)',
          font: { size: 12 },
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: '#1a1a3e',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        titleColor: '#ffffff',
        bodyColor: 'rgba(255,255,255,0.7)',
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (ctx: { dataset: { label?: string }; parsed: { x: number } }) =>
            `${ctx.dataset.label}: $${ctx.parsed.x.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: {
          color: 'rgba(255,255,255,0.5)',
          font: { size: 11 },
          callback: (value: string | number) => `$${Number(value).toLocaleString()}`,
        },
      },
      y: {
        grid: { display: false },
        ticks: { color: 'rgba(255,255,255,0.7)', font: { size: 12 } },
      },
    },
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="section-title">Budget vs Actual</h3>
      </div>
      <div className="card-body" style={{ height: Math.max(200, data.length * 60) + 'px' }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
