import { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: number;
  gradientClass: string;
  prefix?: string;
  suffix?: string;
}

export default function StatCard({ title, value, icon, trend, gradientClass, prefix = '', suffix = '' }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const numericValue = typeof value === 'string' ? parseInt(value.replace(/\D/g, '')) || 0 : value;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const duration = 1200;
    const steps = 30;
    const stepDuration = duration / steps;
    const increment = numericValue / steps;
    let current = 0;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), numericValue);
      setDisplayValue(current);
      if (step >= steps) clearInterval(timer);
    }, stepDuration);
    return () => clearInterval(timer);
  }, [isVisible, numericValue]);

  const formattedValue = typeof value === 'string'
    ? value
    : `${prefix}${displayValue.toLocaleString('ar-DZ')}${suffix}`;

  return (
    <div
      ref={ref}
      className={`${gradientClass} rounded-[20px] p-6 text-white transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] cursor-default`}
      style={{ boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-[2.5rem] opacity-80">{icon}</div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs ${trend >= 0 ? 'text-white/90' : 'text-white/70'}`}>
            {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="text-2xl font-bold mb-1">{formattedValue}</div>
      <div className="text-sm opacity-90">{title}</div>
    </div>
  );
}
