import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  iconColor?: string;
  iconBg?: string;
}

export default function StatCard({
  icon: Icon,
  value,
  label,
  trend,
  iconColor,
  iconBg,
}: StatCardProps) {
  return (
    <motion.div
      className="stat-card"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="stat-card-icon"
        style={{
          color: iconColor || 'var(--color-accent-primary)',
          background: iconBg || 'rgba(139, 92, 246, 0.15)',
        }}
      >
        <Icon size={22} />
      </div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-label">{label}</div>
      {trend && (
        <div className={`stat-card-trend ${trend.positive ? 'positive' : 'negative'}`}>
          {trend.positive ? '↑' : '↓'} {trend.value}
        </div>
      )}
    </motion.div>
  );
}
