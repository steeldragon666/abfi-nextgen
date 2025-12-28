/**
 * ABFI Platform - Professional Finance Typography Components
 *
 * Inter: Body text and UI elements
 * JetBrains Mono: Financial data, metrics, currency
 * Poppins: Display headings and titles
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

// ===========================================
// DISPLAY & HEADING COMPONENTS
// ===========================================

export const H1: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h1 className={cn(
    'text-4xl md:text-5xl font-bold tracking-tight',
    'font-[var(--font-display)]',
    className
  )}>
    {children}
  </h1>
);

export const H2: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h2 className={cn(
    'text-3xl md:text-4xl font-bold tracking-tight',
    'font-[var(--font-display)]',
    className
  )}>
    {children}
  </h2>
);

export const H3: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h3 className={cn(
    'text-2xl md:text-3xl font-semibold tracking-tight',
    'font-[var(--font-display)]',
    className
  )}>
    {children}
  </h3>
);

export const H4: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h4 className={cn(
    'text-xl md:text-2xl font-semibold tracking-tight',
    'font-[var(--font-display)]',
    className
  )}>
    {children}
  </h4>
);

export const H5: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h5 className={cn(
    'text-lg font-semibold',
    'font-[var(--font-display)]',
    className
  )}>
    {children}
  </h5>
);

export const H6: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h6 className={cn(
    'text-base font-semibold',
    'font-[var(--font-display)]',
    className
  )}>
    {children}
  </h6>
);

// ===========================================
// BODY TEXT COMPONENTS
// ===========================================

interface BodyProps extends TypographyProps {
  size?: 'sm' | 'base' | 'lg';
}

export const Body: React.FC<BodyProps> = ({
  children,
  className = '',
  size = 'base'
}) => {
  const sizes = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
  };

  return (
    <p className={cn(
      'font-[var(--font-body)]',
      sizes[size],
      className
    )}>
      {children}
    </p>
  );
};

export const Lead: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <p className={cn(
    'text-xl text-muted-foreground',
    'font-[var(--font-body)]',
    className
  )}>
    {children}
  </p>
);

export const Small: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <small className={cn(
    'text-sm font-medium leading-none',
    className
  )}>
    {children}
  </small>
);

export const Muted: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <p className={cn(
    'text-sm text-muted-foreground',
    className
  )}>
    {children}
  </p>
);

// ===========================================
// FINANCE-SPECIFIC COMPONENTS
// ===========================================

interface CurrencyProps extends TypographyProps {
  value?: number;
  currency?: string;
  showSign?: boolean;
}

export const Currency: React.FC<CurrencyProps> = ({
  children,
  value,
  currency = 'AUD',
  showSign = false,
  className = ''
}) => {
  const displayValue = value !== undefined
    ? new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency,
        signDisplay: showSign ? 'always' : 'auto'
      }).format(value)
    : children;

  return (
    <span className={cn(
      'font-[var(--font-numeric)] font-semibold tabular-nums',
      className
    )}>
      {displayValue}
    </span>
  );
};

interface PercentageProps extends TypographyProps {
  value?: number;
  showSign?: boolean;
}

export const Percentage: React.FC<PercentageProps> = ({
  children,
  value,
  showSign = true,
  className = ''
}) => {
  let displayValue = children;
  let colorClass = '';

  if (value !== undefined) {
    const sign = showSign && value > 0 ? '+' : '';
    displayValue = `${sign}${value.toFixed(2)}%`;
    colorClass = value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : '';
  }

  return (
    <span className={cn(
      'font-[var(--font-numeric)] font-bold tabular-nums',
      colorClass,
      className
    )}>
      {displayValue}
    </span>
  );
};

interface MetricValueProps extends TypographyProps {
  positive?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const MetricValue: React.FC<MetricValueProps> = ({
  children,
  className = '',
  positive,
  size = 'lg'
}) => {
  const sizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={cn(
      'font-[var(--font-numeric)] font-bold tabular-nums',
      sizes[size],
      positive === true && 'text-green-600',
      positive === false && 'text-red-600',
      className
    )}>
      {children}
    </div>
  );
};

export const DataLabel: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <span className={cn(
    'text-sm font-medium text-muted-foreground uppercase tracking-wide',
    'font-[var(--font-body)]',
    className
  )}>
    {children}
  </span>
);

// ===========================================
// TABLE COMPONENTS
// ===========================================

export const TableHeader: React.FC<TypographyProps & React.ThHTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <th className={cn(
    'text-sm font-semibold text-gray-900 uppercase tracking-wide',
    'font-[var(--font-body)]',
    'px-4 py-3 text-left',
    className
  )} {...props}>
    {children}
  </th>
);

export const TableCell: React.FC<TypographyProps & React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <td className={cn(
    'font-[var(--font-body)]',
    'px-4 py-3',
    className
  )} {...props}>
    {children}
  </td>
);

export const TableCellNumeric: React.FC<TypographyProps & React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <td className={cn(
    'font-[var(--font-numeric)] tabular-nums text-right',
    'px-4 py-3',
    className
  )} {...props}>
    {children}
  </td>
);

// ===========================================
// CARD COMPONENTS
// ===========================================

export const CardTitle: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h3 className={cn(
    'text-lg font-semibold text-gray-900',
    'font-[var(--font-display)]',
    className
  )}>
    {children}
  </h3>
);

export const CardDescription: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <p className={cn(
    'text-sm text-muted-foreground',
    'font-[var(--font-body)]',
    className
  )}>
    {children}
  </p>
);

// ===========================================
// CODE COMPONENTS
// ===========================================

export const Code: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <code className={cn(
    'font-[var(--font-mono)] text-sm',
    'bg-muted px-1.5 py-0.5 rounded',
    className
  )}>
    {children}
  </code>
);

export const Pre: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <pre className={cn(
    'font-[var(--font-mono)] text-sm',
    'bg-muted p-4 rounded-lg overflow-x-auto',
    className
  )}>
    {children}
  </pre>
);

// ===========================================
// UTILITY COMPONENTS
// ===========================================

export const Blockquote: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <blockquote className={cn(
    'border-l-4 border-primary pl-4 italic',
    'font-[var(--font-body)]',
    className
  )}>
    {children}
  </blockquote>
);

export const List: React.FC<TypographyProps & { ordered?: boolean }> = ({
  children,
  className = '',
  ordered = false
}) => {
  const Tag = ordered ? 'ol' : 'ul';
  return (
    <Tag className={cn(
      'font-[var(--font-body)]',
      ordered ? 'list-decimal' : 'list-disc',
      'pl-6 space-y-1',
      className
    )}>
      {children}
    </Tag>
  );
};

// Default export with all components
const Typography = {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Body,
  Lead,
  Small,
  Muted,
  Currency,
  Percentage,
  MetricValue,
  DataLabel,
  TableHeader,
  TableCell,
  TableCellNumeric,
  CardTitle,
  CardDescription,
  Code,
  Pre,
  Blockquote,
  List,
};

export default Typography;
