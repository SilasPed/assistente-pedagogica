import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  className,
  children,
  id,
}: {
  className?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className={cn("panel p-4 md:p-5", className)}>
      {children}
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-sm font-medium text-muted">{children}</p>;
}

export function controlClassName() {
  return "h-11 w-full min-w-0 rounded-md border border-line bg-card px-3 text-base text-fg";
}

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "quiet" }) {
  return (
    <button
      type={type}
      className={cn(
        "press inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium disabled:opacity-40",
        variant === "primary" && "h-11 bg-primary px-4 text-primary-fg",
        variant === "ghost" && "h-11 border border-line bg-card px-4 text-fg",
        variant === "quiet" && "text-muted",
        className,
      )}
      {...props}
    />
  );
}
