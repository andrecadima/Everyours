import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "quiet" | "onDark";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm font-semibold whitespace-nowrap transition-[background-color,color,box-shadow,transform] duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-55 select-none";

const variants: Record<Variant, string> = {
  primary: "bg-monte text-paper hover:bg-monte-deep shadow-[0_1px_0_rgb(255_255_255/0.08)_inset,0_1px_2px_rgb(22_54_40/0.3)]",
  secondary: "border border-line-strong/70 bg-surface text-ink hover:border-ink-2 hover:bg-white",
  quiet: "text-ink hover:bg-ink/5",
  onDark: "bg-paper text-monte-deep hover:bg-white",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-13 px-6 text-base",
};
