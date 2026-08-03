"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";

const MODES = [
  { id: "road", label: "Road", base: 180, perKg: 1.8 },
  { id: "air", label: "Air", base: 320, perKg: 4.2 },
  { id: "sea", label: "Sea", base: 140, perKg: 0.9 },
  { id: "vehicle", label: "Vehicle", base: 650, perKg: 0 },
] as const;

const SPEEDS = [
  { id: "standard", label: "Standard (4 days)", mult: 1 },
  { id: "express", label: "Express (2 days)", mult: 1.35 },
  { id: "same", label: "Same day", mult: 1.9 },
] as const;

export default function EstimateCalculator() {
  const [mode, setMode] = useState<(typeof MODES)[number]["id"]>("road");
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]["id"]>("standard");
  const [weight, setWeight] = useState(25);
  const [distance, setDistance] = useState(800);
  const [insured, setInsured] = useState(true);
  const [revealed, setRevealed] = useState(false);

  const estimate = useMemo(() => {
    const m = MODES.find((x) => x.id === mode)!;
    const s = SPEEDS.find((x) => x.id === speed)!;
    const distanceFee = distance * 0.42;
    const weightFee = weight * m.perKg;
    const sub = (m.base + distanceFee + weightFee) * s.mult;
    const insurance = insured ? Math.max(45, sub * 0.08) : 0;
    const total = Math.round(sub + insurance);
    return { total, insurance: Math.round(insurance), days: speed === "same" ? 1 : speed === "express" ? 2 : 4 };
  }, [mode, speed, weight, distance, insured]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setRevealed(true);
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-large">
      <div className="grid lg:grid-cols-2">
        <form onSubmit={onSubmit} className="space-y-5 p-6 sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Estimate</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-text-primary sm:text-3xl">
              See a ballpark in seconds
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              Instant feedback keeps decisions light. Final quotes confirm after shipment details.
            </p>
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-medium text-text-primary">Mode</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setMode(m.id);
                    setRevealed(false);
                  }}
                  className={`rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${
                    mode === m.id
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-surface text-text-secondary hover:border-primary/40"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-text-primary">Weight (kg)</span>
            <input
              type="range"
              min={1}
              max={mode === "vehicle" ? 2500 : 500}
              value={weight}
              onChange={(e) => {
                setWeight(Number(e.target.value));
                setRevealed(false);
              }}
              className="w-full accent-primary"
            />
            <span className="mt-1 block text-sm font-semibold tabular-nums text-primary">{weight} kg</span>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-text-primary">Distance (miles)</span>
            <input
              type="range"
              min={50}
              max={3000}
              step={10}
              value={distance}
              onChange={(e) => {
                setDistance(Number(e.target.value));
                setRevealed(false);
              }}
              className="w-full accent-primary"
            />
            <span className="mt-1 block text-sm font-semibold tabular-nums text-primary">{distance} mi</span>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-text-primary">Speed</span>
            <select
              value={speed}
              onChange={(e) => {
                setSpeed(e.target.value as typeof speed);
                setRevealed(false);
              }}
              className="input-field px-3 py-2.5"
            >
              {SPEEDS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-3 text-sm text-text-secondary">
            <input
              type="checkbox"
              checked={insured}
              onChange={(e) => {
                setInsured(e.target.checked);
                setRevealed(false);
              }}
              className="h-4 w-4 accent-primary"
            />
            Include insurance cushion
          </label>

          <button type="submit" className="btn-primary w-full">
            Calculate estimate
          </button>
        </form>

        <div className="relative flex flex-col justify-between bg-secondary p-6 text-white sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Result</p>
            {!revealed ? (
              <div className="mt-6">
                <p className="font-display text-3xl font-bold text-white/35">$···</p>
                <p className="mt-3 text-sm text-white/55">
                  Adjust the sliders, then calculate. Small choices update the outcome.
                </p>
              </div>
            ) : (
              <div className="mt-6 animate-[reveal-up_0.55s_ease-out]">
                <p className="text-sm text-white/60">Estimated total</p>
                <p className="font-display text-5xl font-extrabold tabular-nums tracking-tight">
                  ${estimate.total}
                </p>
                <div className="mt-5 space-y-2 text-sm text-white/75">
                  <p>Typical window: about {estimate.days} day{estimate.days > 1 ? "s" : ""}</p>
                  <p>Insurance cushion: ${estimate.insurance}</p>
                  <p className="text-white/50">Indicative only. Final pricing confirms at booking.</p>
                </div>
              </div>
            )}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/track" className="btn-primary text-center">
              Track a shipment
            </Link>
            <Link href="/support" className="btn-on-dark text-center">
              Ask for a firm quote
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
