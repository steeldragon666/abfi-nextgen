/**
 * Motion Components - Reusable animated wrappers
 * Built on Framer Motion for premium micro-interactions
 */

import { motion, AnimatePresence, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useEffect, forwardRef, type ReactNode, type ComponentPropsWithoutRef } from "react";
import {
  fadeIn,
  fadeInUp,
  fadeInDown,
  scaleIn,
  popIn,
  staggerContainer,
  staggerItem,
  staggerItemScale,
  cardHover,
  cardHoverSubtle,
  pageTransition,
  modalOverlay,
  modalContent,
  collapse,
  springSmooth,
  easeOut,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

// ============================================
// Page Wrapper - Full page transition
// ============================================
interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// Fade In - Simple opacity animation
// ============================================
interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
}

export function FadeIn({ children, className, delay = 0, duration = 0.5, once = true }: FadeInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration, delay, ease: easeOut }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// Fade In Up - Opacity + vertical slide
// ============================================
interface FadeInUpProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
  once?: boolean;
}

export function FadeInUp({ children, className, delay = 0, distance = 24, once = true }: FadeInUpProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: distance }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: distance }}
      transition={{ duration: 0.5, delay, ease: easeOut }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// Scale In - Opacity + scale
// ============================================
interface ScaleInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}

export function ScaleIn({ children, className, delay = 0, once = true }: ScaleInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay, ease: easeOut }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// Stagger Container - Stagger children
// ============================================
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  once?: boolean;
}

export function StaggerContainer({
  children,
  className,
  delay = 0.1,
  staggerDelay = 0.08,
  once = true
}: StaggerContainerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// Stagger Item - Child of StaggerContainer
// ============================================
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}

export function StaggerItemScale({ children, className }: StaggerItemProps) {
  return (
    <motion.div variants={staggerItemScale} className={className}>
      {children}
    </motion.div>
  );
}

// ============================================
// Hover Card - Card with hover lift effect
// ============================================
interface HoverCardProps {
  children: ReactNode;
  className?: string;
  subtle?: boolean;
}

export function HoverCard({ children, className, subtle = false }: HoverCardProps) {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      variants={subtle ? cardHoverSubtle : cardHover}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// Animated Counter - Number counting up
// ============================================
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export function AnimatedCounter({
  value,
  duration = 1.5,
  className,
  prefix = "",
  suffix = "",
  decimals = 0
}: AnimatedCounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    if (decimals > 0) {
      return latest.toFixed(decimals);
    }
    return Math.round(latest).toLocaleString();
  });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, {
        duration,
        ease: easeOut,
      });
      return controls.stop;
    }
  }, [isInView, value, duration, count]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

// ============================================
// Animated Progress - Circular or linear
// ============================================
interface AnimatedProgressProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  className?: string;
  trackClassName?: string;
  progressClassName?: string;
  duration?: number;
}

export function AnimatedCircularProgress({
  progress,
  size = 120,
  strokeWidth = 8,
  className,
  trackClassName = "stroke-muted",
  progressClassName = "stroke-primary",
  duration = 1.5,
}: AnimatedProgressProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const progressValue = useMotionValue(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const strokeDashoffset = useTransform(
    progressValue,
    [0, 100],
    [circumference, circumference * (1 - progress / 100)]
  );

  useEffect(() => {
    if (isInView) {
      const controls = animate(progressValue, progress, {
        duration,
        ease: easeOut,
      });
      return controls.stop;
    }
  }, [isInView, progress, duration, progressValue]);

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={cn("transform -rotate-90", className)}
    >
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        className={trackClassName}
      />
      {/* Progress */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className={progressClassName}
        style={{
          strokeDasharray: circumference,
          strokeDashoffset,
        }}
      />
    </svg>
  );
}

// ============================================
// Collapse - Expandable content
// ============================================
interface CollapseProps {
  isOpen: boolean;
  children: ReactNode;
  className?: string;
}

export function Collapse({ isOpen, children, className }: CollapseProps) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={collapse}
          className={cn("overflow-hidden", className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================
// Presence - AnimatePresence wrapper
// ============================================
interface PresenceProps {
  children: ReactNode;
  show: boolean;
  className?: string;
  variant?: "fade" | "scale" | "slideUp" | "slideDown";
}

const presenceVariants = {
  fade: fadeIn,
  scale: scaleIn,
  slideUp: fadeInUp,
  slideDown: fadeInDown,
};

export function Presence({ children, show, className, variant = "fade" }: PresenceProps) {
  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={presenceVariants[variant]}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================
// Shimmer - Skeleton loading effect
// ============================================
interface ShimmerProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function Shimmer({ className, width, height }: ShimmerProps) {
  return (
    <motion.div
      className={cn(
        "rounded-md bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]",
        className
      )}
      style={{ width, height }}
      animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
    />
  );
}

// ============================================
// Tap Scale - Simple tap feedback
// ============================================
interface TapScaleProps extends ComponentPropsWithoutRef<typeof motion.div> {
  children: ReactNode;
  scale?: number;
}

export const TapScale = forwardRef<HTMLDivElement, TapScaleProps>(
  ({ children, scale = 0.97, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      whileTap={{ scale }}
      transition={{ duration: 0.1 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
TapScale.displayName = "TapScale";

// ============================================
// Hover Scale - Simple hover feedback
// ============================================
interface HoverScaleProps extends ComponentPropsWithoutRef<typeof motion.div> {
  children: ReactNode;
  scale?: number;
}

export const HoverScale = forwardRef<HTMLDivElement, HoverScaleProps>(
  ({ children, scale = 1.02, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      whileHover={{ scale }}
      transition={springSmooth}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
HoverScale.displayName = "HoverScale";

// ============================================
// Floating - Continuous floating animation
// ============================================
interface FloatingProps {
  children: ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
}

export function Floating({ children, className, amplitude = 10, duration = 3 }: FloatingProps) {
  return (
    <motion.div
      animate={{ y: [-amplitude, amplitude, -amplitude] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// Pulse - Subtle pulsing effect
// ============================================
interface PulseProps {
  children: ReactNode;
  className?: string;
  scale?: number;
  duration?: number;
}

export function Pulse({ children, className, scale = 1.05, duration = 2 }: PulseProps) {
  return (
    <motion.div
      animate={{ scale: [1, scale, 1] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Re-export motion and AnimatePresence for convenience
export { motion, AnimatePresence };
