import { Link } from "react-router";
import {
  ArrowRightIcon,
  SparklesIcon,
  ShieldCheckIcon,
  HeadsetIcon,
  ZapIcon,
} from "lucide-react";

const FEATURES = [
  {
    icon: ShieldCheckIcon,
    title: "Secure checkout",
    desc: "Encrypted payments",
  },
  {
    icon: HeadsetIcon,
    title: "Priority support",
    desc: "Chat on paid orders",
  },
  {
    icon: ZapIcon,
    title: "Fast everything",
    desc: "Curated, ready to ship",
  },
];

export function HomeHero({ categories, loadingCategories }) {
  return (
    <section className="relative overflow-hidden rounded-box border border-base-300 bg-linear-to-br from-base-100 via-base-100 to-primary/5 shadow-lg">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-secondary/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-size-[36px_36px]"
        aria-hidden
      />

      <div className="relative grid gap-10 p-8 md:grid-cols-[1.1fr_0.9fr] md:items-center md:p-12 lg:p-14">
        <div className="text-left">

          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-base-content md:text-5xl lg:text-6xl">
            Hardware &amp; workspace,
            <span className="block bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              ready to ship
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-base-content/70">
            Audio, wearables, workspace, and travel essentials—curated for work and home. Secure
            checkout, and after payment your order page unlocks support chat and video.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#catalog"
              className="btn btn-primary gap-2 shadow-md transition hover:shadow-lg hover:shadow-primary/20"
            >
              Shop catalog
              <ArrowRightIcon className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
            </a>

            <Link to="/cart" className="btn btn-ghost border border-base-300 hover:border-primary/40">
              View cart
            </Link>
          </div>

          <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-base-200 pt-6">
            <div>
              <dt className="text-xs uppercase tracking-wide text-base-content/50">Categories</dt>
              <dd className="text-xl font-bold tabular-nums text-base-content">
                {loadingCategories ? (
                  <span className="skeleton inline-block h-6 w-8 rounded align-middle" aria-hidden />
                ) : (
                  categories.length
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-base-content/50">Checkout</dt>
              <dd className="text-xl font-bold text-base-content">Secure</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-base-content/50">Support</dt>
              <dd className="text-xl font-bold text-base-content">Priority</dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div className="rounded-box border border-base-300 bg-base-100/70 p-6 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-base-content">Why shop here</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-success">
                <span className="size-2 animate-pulse rounded-full bg-success" aria-hidden />
                Live catalog
              </span>
            </div>

            <ul className="mt-5 space-y-3">
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <li
                  key={title}
                  className="flex items-center gap-3 rounded-box border border-base-200 bg-base-100 px-4 py-3 transition hover:border-primary/30"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-box bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-base-content">{title}</span>
                    <span className="block text-xs text-base-content/60">{desc}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex items-center gap-2 rounded-box border border-dashed border-primary/30 bg-primary/5 px-4 py-3 text-sm text-base-content">
              <SparklesIcon className="size-4 shrink-0 text-primary" aria-hidden />
              <span>Priority support on every paid order</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
