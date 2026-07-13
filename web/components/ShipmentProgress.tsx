"use client";

import {
  isStepActive,
  isStepComplete,
  PROGRESS_STEPS,
  shipmentProgressPercent,
} from "@/lib/progress";
import type { ShipmentStatus } from "@/lib/types";

interface Props {
  status: ShipmentStatus | string;
  routeProgress?: number | null;
}

export default function ShipmentProgress({ status, routeProgress }: Props) {
  const percent = shipmentProgressPercent(status, routeProgress);
  const activeIdx = PROGRESS_STEPS.findIndex((s) => s.key === status);

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
            Delivery progress
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            {status === "pending"
              ? "Awaiting pickup — tracking will animate once the package moves."
              : status === "delivered"
                ? "Package delivered successfully."
                : "Live route progress updating…"}
          </p>
        </div>
        <p className="text-2xl font-bold tabular-nums text-primary">{percent}%</p>
      </div>

      <div className="relative h-3 overflow-hidden rounded-full bg-primary-100">
        <div
          className="progress-fill absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-primary-700"
          style={{ width: `${percent}%` }}
        />
        {status !== "pending" && status !== "delivered" && (
          <div
            className="progress-shimmer absolute inset-y-0 w-24"
            style={{ left: `calc(${percent}% - 3rem)` }}
          />
        )}
      </div>

      {/* Desktop / tablet stepper */}
      <div className="hidden sm:block">
        <div className="relative flex justify-between">
          <div className="absolute left-0 right-0 top-4 h-0.5 bg-border" />
          <div
            className="absolute left-0 top-4 h-0.5 bg-primary transition-all duration-700 ease-out"
            style={{
              width:
                activeIdx <= 0
                  ? "0%"
                  : `${(activeIdx / (PROGRESS_STEPS.length - 1)) * 100}%`,
            }}
          />
          {PROGRESS_STEPS.map((step) => {
            const done = isStepComplete(step.key, status);
            const active = isStepActive(step.key, status);
            return (
              <div key={step.key} className="relative z-10 flex w-16 flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-500 ${
                    done
                      ? "border-primary bg-primary text-white"
                      : active
                        ? "step-pulse border-primary bg-white text-primary"
                        : "border-border bg-white text-text-muted"
                  }`}
                >
                  {done ? "✓" : active ? "●" : ""}
                </div>
                <p
                  className={`mt-2 text-center text-[11px] font-medium leading-tight ${
                    done || active ? "text-text-primary" : "text-text-muted"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile compact steps */}
      <ol className="space-y-3 sm:hidden">
        {PROGRESS_STEPS.map((step) => {
          const done = isStepComplete(step.key, status);
          const active = isStepActive(step.key, status);
          return (
            <li key={step.key} className="flex items-center gap-3">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  done
                    ? "bg-primary text-white"
                    : active
                      ? "step-pulse bg-primary-100 text-primary ring-2 ring-primary"
                      : "bg-surface text-text-muted"
                }`}
              >
                {done ? "✓" : activeIdx >= 0 && PROGRESS_STEPS[activeIdx].key === step.key ? "●" : "·"}
              </span>
              <span
                className={`text-sm ${done || active ? "font-medium text-text-primary" : "text-text-muted"}`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
