"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

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
    return {
      total,
      insurance: Math.round(insurance),
      days: speed === "same" ? 1 : speed === "express" ? 2 : 4,
    };
  }, [mode, speed, weight, distance, insured]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setRevealed(true);
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-secondary shadow-large">
      <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
        <form onSubmit={onSubmit} className="space-y-5 p-6 text-white sm:p-8 lg:p-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              Affordable transport
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold leading-tight sm:text-3xl">
              Clear rates.
              <span className="block text-accent">Efficient service.</span>
            </h2>
            <p className="mt-3 text-sm text-white/65">
              Adjust the options, hit calculate, and get a calm ballpark before you book.
            </p>
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-medium text-white/85">Delivery mode</legend>
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
                      ? "border-accent bg-accent text-white"
                      : "border-white/15 bg-white/5 text-white/75 hover:border-white/35"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-white/85">Weight (kg)</span>
            <input
              type="range"
              min={1}
              max={mode === "vehicle" ? 2500 : 500}
              value={weight}
              onChange={(e) => {
                setWeight(Number(e.target.value));
                setRevealed(false);
              }}
              className="w-full accent-accent"
            />
            <span className="mt-1 block text-sm font-semibold tabular-nums text-accent">{weight} kg</span>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-white/85">Distance (miles)</span>
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
              className="w-full accent-accent"
            />
            <span className="mt-1 block text-sm font-semibold tabular-nums text-accent">{distance} mi</span>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-white/85">Delivery speed</span>
            <select
              value={speed}
              onChange={(e) => {
                setSpeed(e.target.value as typeof speed);
                setRevealed(false);
              }}
              className="w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2.5 text-white outline-none focus:border-accent"
            >
              {SPEEDS.map((s) => (
                <option key={s.id} value={s.id} className="text-text-primary">
                  {s.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-3 text-sm text-white/70">
            <input
              type="checkbox"
              checked={insured}
              onChange={(e) => {
                setInsured(e.target.checked);
                setRevealed(false);
              }}
              className="h-4 w-4 accent-accent"
            />
            Include insurance cushion
          </label>

          <button
            type="submit"
            className="w-full rounded-lg bg-accent py-3.5 text-sm font-bold text-white transition hover:brightness-110"
          >
            Calculate
          </button>

          <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-white/50">Estimated cost</p>
            {!revealed ? (
              <p className="mt-1 font-display text-2xl font-bold text-white/40">$0</p>
            ) : (
              <div className="mt-1 animate-[reveal-up_0.45s_ease-out]">
                <p className="font-display text-3xl font-extrabold tabular-nums text-white">
                  ${estimate.total}
                </p>
                <p className="mt-1 text-xs text-white/55">
                  About {estimate.days} day{estimate.days > 1 ? "s" : ""} · insurance ${estimate.insurance}
                </p>
              </div>
            )}
          </div>
        </form>

        <div className="relative min-h-[420px] overflow-hidden bg-[#0a1628] lg:min-h-full">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_30%,rgba(255,107,26,0.22),transparent_55%)]" />
          <Image
            src="/images/brand-courier-avatar.png"
            alt="CargoWatch courier ready to deliver your package"
            fill
            className="object-cover object-[center_15%] sm:object-[center_20%]"
            sizes="(max-width: 1024px) 100vw, 45vw"
            priority
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-secondary via-secondary/70 to-transparent p-6 pt-24">
            <p className="font-display text-lg font-bold text-white">Your move, our watch</p>
            <p className="mt-1 text-sm text-white/70">
              Friendly handoff energy, professional tracking behind it.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Link href="/track" className="btn-primary text-center text-sm">
                Track a shipment
              </Link>
              <Link href="/support" className="btn-on-dark text-center text-sm">
                Ask for a firm quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
