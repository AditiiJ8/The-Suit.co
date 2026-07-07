interface RiskBadgeProps {
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  className?: string;
}

export function RiskBadge({ risk, className = '' }: RiskBadgeProps) {
  const styles = {
    LOW: 'risk-low',
    MEDIUM: 'risk-medium',
    HIGH: 'risk-high',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-bold uppercase tracking-wide ${styles[risk]} ${className}`}
    >
      {risk}
    </span>
  );
}
