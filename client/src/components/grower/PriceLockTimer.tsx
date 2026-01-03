/**
 * PriceLockTimer - 48-hour price lock countdown component
 *
 * Spec requirement: "48-hour price lock mechanism with countdown timer"
 * Design: Color-coded urgency (green > 24h, amber 12-24h, red < 12h)
 */

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Lock, AlertTriangle, CheckCircle2, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

interface PriceLockTimerProps {
  /** Price per tonne in AUD */
  pricePerTonne: number;
  /** Volume in tonnes */
  volumeTonnes: number;
  /** When the price lock was initiated */
  lockStartTime?: Date;
  /** Lock duration in hours (default 48) */
  lockDurationHours?: number;
  /** Callback when lock expires */
  onExpire?: () => void;
  /** Callback when user accepts the locked price */
  onAccept?: () => void;
  /** Whether the price is already locked */
  isLocked?: boolean;
  /** Callback to initiate price lock */
  onLockPrice?: () => void;
}

interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  percentRemaining: number;
}

export function PriceLockTimer({
  pricePerTonne,
  volumeTonnes,
  lockStartTime,
  lockDurationHours = 48,
  onExpire,
  onAccept,
  isLocked = false,
  onLockPrice,
}: PriceLockTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  const calculateTimeRemaining = useCallback((): TimeRemaining | null => {
    if (!lockStartTime) return null;

    const now = new Date();
    const lockEnd = new Date(lockStartTime.getTime() + lockDurationHours * 60 * 60 * 1000);
    const diff = lockEnd.getTime() - now.getTime();

    if (diff <= 0) {
      return null;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const percentRemaining = (diff / (lockDurationHours * 60 * 60 * 1000)) * 100;

    return { hours, minutes, seconds, totalSeconds, percentRemaining };
  }, [lockStartTime, lockDurationHours]);

  useEffect(() => {
    if (!lockStartTime || !isLocked) return;

    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining();
      if (remaining) {
        setTimeRemaining(remaining);
      } else {
        setIsExpired(true);
        setTimeRemaining(null);
        onExpire?.();
        clearInterval(timer);
      }
    }, 1000);

    // Initial calculation
    const initial = calculateTimeRemaining();
    if (initial) {
      setTimeRemaining(initial);
    } else {
      setIsExpired(true);
    }

    return () => clearInterval(timer);
  }, [lockStartTime, isLocked, calculateTimeRemaining, onExpire]);

  // Determine urgency color based on time remaining
  const getUrgencyColor = () => {
    if (!timeRemaining) return "bg-gray-100 text-gray-600";

    const hoursLeft = timeRemaining.hours;
    if (hoursLeft >= 24) {
      return "bg-green-50 border-green-200 text-green-700";
    } else if (hoursLeft >= 12) {
      return "bg-amber-50 border-amber-200 text-amber-700";
    } else {
      return "bg-red-50 border-red-200 text-red-700";
    }
  };

  const getProgressColor = () => {
    if (!timeRemaining) return "bg-gray-300";

    const hoursLeft = timeRemaining.hours;
    if (hoursLeft >= 24) return "bg-green-500";
    if (hoursLeft >= 12) return "bg-amber-500";
    return "bg-red-500";
  };

  const formatTime = (value: number) => value.toString().padStart(2, "0");

  const totalValue = pricePerTonne * volumeTonnes;

  // Not locked yet - show lock price button
  if (!isLocked) {
    return (
      <Card className="border-2 border-dashed border-gray-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lock className="h-5 w-5 text-gray-400" />
            Price Lock Available
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Current Price</span>
              <span className="text-2xl font-bold text-gray-900">
                ${pricePerTonne.toFixed(2)}/t
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Volume: {volumeTonnes.toLocaleString()} tonnes</span>
              <span className="font-semibold text-gray-900">
                Total: ${totalValue.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Timer className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Lock this price for 48 hours
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Guaranteed rate while you complete your decision. Price won't change during lock period.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={onLockPrice}
            className="w-full bg-[#D4AF37] text-[#1E3A5A] hover:bg-[#D4AF37]/90"
          >
            <Lock className="h-4 w-4 mr-2" />
            Lock Price for 48 Hours
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Expired state
  if (isExpired) {
    return (
      <Card className="border-2 border-red-200 bg-red-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            Price Lock Expired
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-red-600">
            Your locked price has expired. Request a new price lock to secure current market rates.
          </p>
          <div className="bg-white rounded-lg p-4 border border-red-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Previous Locked Price</span>
              <span className="text-xl font-bold text-gray-400 line-through">
                ${pricePerTonne.toFixed(2)}/t
              </span>
            </div>
          </div>
          <Button
            onClick={onLockPrice}
            variant="outline"
            className="w-full"
          >
            Request New Price Lock
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Active countdown
  return (
    <Card className={cn("border-2", getUrgencyColor())}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Price Locked
          </CardTitle>
          <Badge
            variant="outline"
            className={cn(
              "font-mono",
              timeRemaining && timeRemaining.hours < 12 && "animate-pulse"
            )}
          >
            <Clock className="h-3 w-3 mr-1" />
            {timeRemaining && (
              <>
                {formatTime(timeRemaining.hours)}:
                {formatTime(timeRemaining.minutes)}:
                {formatTime(timeRemaining.seconds)}
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Price Display */}
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Locked Price</span>
            <span className="text-2xl font-bold text-[#1E3A5A]">
              ${pricePerTonne.toFixed(2)}/t
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Volume: {volumeTonnes.toLocaleString()} tonnes</span>
            <span className="font-semibold text-[#1E3A5A]">
              Total: ${totalValue.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Countdown Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Time Remaining</span>
            <span>
              {timeRemaining && (
                <>
                  {timeRemaining.hours}h {timeRemaining.minutes}m remaining
                </>
              )}
            </span>
          </div>
          <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={cn("h-full transition-all duration-1000", getProgressColor())}
              style={{ width: `${timeRemaining?.percentRemaining || 0}%` }}
            />
          </div>
        </div>

        {/* Urgency Message */}
        {timeRemaining && timeRemaining.hours < 12 && (
          <div className="bg-red-100 border border-red-300 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">
                Less than {timeRemaining.hours} hours remaining
              </p>
              <p className="text-xs text-red-600 mt-1">
                Accept now to secure this rate before it expires.
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={onAccept}
            className="flex-1 bg-[#D4AF37] text-[#1E3A5A] hover:bg-[#D4AF37]/90"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Accept & Proceed
          </Button>
        </div>

        {/* Trust Badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2 border-t">
          <Lock className="h-3 w-3" />
          <span>7-day payment guarantee with NAB processing</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default PriceLockTimer;
