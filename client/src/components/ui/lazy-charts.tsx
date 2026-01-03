/**
 * Lazy-loaded Recharts wrapper
 *
 * This module provides a lazy-loaded chart component that defers loading
 * the entire recharts library (~392KB) until a chart is actually rendered.
 *
 * Usage:
 *   import { LazyChart } from "@/components/ui/lazy-charts";
 *
 *   <LazyChart height={300}>
 *     {({ AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer }) => (
 *       <ResponsiveContainer width="100%" height="100%">
 *         <AreaChart data={data}>
 *           <XAxis dataKey="name" />
 *           <YAxis />
 *           <Tooltip />
 *           <Area dataKey="value" fill="#8884d8" />
 *         </AreaChart>
 *       </ResponsiveContainer>
 *     )}
 *   </LazyChart>
 */
import { lazy, Suspense, useState, useEffect, type ReactNode } from "react";
import { Skeleton } from "./skeleton";
import type * as RechartsTypes from "recharts";

// Chart loading fallback
export function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div className="w-full animate-pulse" style={{ height }}>
      <Skeleton className="w-full h-full rounded-lg" />
    </div>
  );
}

// Type for all recharts exports
type RechartsModule = typeof RechartsTypes;

// Props for the lazy chart component
interface LazyChartProps {
  children: (recharts: RechartsModule) => React.ReactElement;
  height?: number;
  fallback?: ReactNode;
}

/**
 * LazyChart - Renders children only after recharts is loaded
 *
 * The children function receives all recharts exports as an argument,
 * allowing you to use any recharts component without static imports.
 */
export function LazyChart({ children, height = 300, fallback }: LazyChartProps) {
  const [recharts, setRecharts] = useState<RechartsModule | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    import("recharts")
      .then((module) => {
        if (mounted) {
          setRecharts(module);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err);
          console.error("Failed to load recharts:", err);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (error) {
    return (
      <div className="w-full flex items-center justify-center text-muted-foreground" style={{ height }}>
        Failed to load chart
      </div>
    );
  }

  if (!recharts) {
    return <>{fallback || <ChartSkeleton height={height} />}</>;
  }

  return <>{children(recharts)}</>;
}

/**
 * Convenience wrapper that includes ResponsiveContainer
 */
interface LazyResponsiveChartProps {
  children: (recharts: RechartsModule) => React.ReactElement;
  height?: number | string;
  width?: number | string;
  fallback?: ReactNode;
}

export function LazyResponsiveChart({
  children,
  height = 300,
  width = "100%",
  fallback,
}: LazyResponsiveChartProps) {
  return (
    <LazyChart height={typeof height === "number" ? height : 300} fallback={fallback}>
      {(recharts) => (
        <recharts.ResponsiveContainer width={width} height={height}>
          {children(recharts)}
        </recharts.ResponsiveContainer>
      )}
    </LazyChart>
  );
}
