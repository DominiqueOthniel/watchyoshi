import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image: string;
  imageAlt: string;
  actions?: ReactNode;
}

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  imageAlt,
  actions,
}: Props) {
  return (
    <section className="relative min-h-[52vh] overflow-hidden bg-secondary text-white sm:min-h-[58vh]">
      <div className="absolute inset-0">
        <Image src={image} alt={imageAlt} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/80 to-secondary/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/85 via-transparent to-secondary/25" />
      </div>
      <div className="relative mx-auto flex min-h-[52vh] max-w-7xl flex-col justify-end px-4 pb-12 pt-24 sm:min-h-[58vh] sm:px-6 sm:pb-16 lg:px-8">
        <p className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
          CargoWatch
        </p>
        {eyebrow && (
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
        )}
        <h1 className="mt-2 max-w-3xl font-display text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
          {title}
        </h1>
        {subtitle && <p className="mt-3 max-w-2xl text-base text-white/75 sm:text-lg">{subtitle}</p>}
        {actions && <div className="mt-7 flex flex-col gap-3 sm:flex-row">{actions}</div>}
      </div>
    </section>
  );
}
