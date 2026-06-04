import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import type { CategoryBreakdown } from '../../types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryPieChartProps {
  data: CategoryBreakdown[];
}

const DEFAULT_COLORS = [
  '#8b5cf6', '#6366f1', '#3b82f6', '#10b981',
  '#f59e0b', '#ef4444', '#ec4899', '#06b6d4',
  '#84cc16', '#f97316',
];

export default function CategoryPieChart({ data }: CategoryPieChartProps) {
  const colors = data.map((d, i) => d.categoryColor || DEFAULT_COLORS[i % DEFAULT_COLORS.length]);
  const totalSpent = data.reduce((sum, d) => sum + d.totalSpent, 0);

  const chartData = {
    labels: data.map(d => d.categoryName),
    datasets: [
      {
        data: data.map(d => d.totalSpent),
        backgroundColor: colors.map(c => c + '99'),
        borderColor: colors,
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: 'rgba(255,255,255,0.7)',
          font: { size: 12 },
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 10,
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
          label: (ctx: { label: string; parsed: number }) =>
            `${ctx.label}: $${ctx.parsed.toLocaleString()} (${totalSpent > 0 ? ((ctx.parsed / totalSpent) * 100).toFixed(1) : 0}%)`,
        },
      },
    },
  };

  const centerTextPlugin = {
    id: 'centerText',
    beforeDraw: (chart: ChartJS) => {
      const { ctx, chartArea } = chart;
      if (!chartArea) return;
      ctx.save();
      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;

      ctx.font = 'bold 20px Inter, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`$${totalSpent.toLocaleString()}`, centerX, centerY - 8);

      ctx.font = '12px Inter, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillText('Total', centerX, centerY + 14);

      ctx.restore();
    },
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="section-title">By Category</h3>
      </div>
      <div className="card-body" style={{ height: '300px' }}>
        <Doughnut data={chartData} options={options} plugins={[centerTextPlugin]} />
      </div>
    </div>
  );
}
