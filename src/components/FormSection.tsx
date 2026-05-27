import { useState, type ReactNode } from "react";

interface FormSectionProps {
  step: number;
  title: string;
  description?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  collapsible?: boolean;
}

export const FormSection = ({
  step,
  title,
  description,
  children,
  defaultOpen = true,
  collapsible = false,
}: FormSectionProps) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl border border-ink/8 bg-white">
      <button
        type="button"
        onClick={() => collapsible && setOpen((current) => !current)}
        className={`flex w-full items-start gap-3 px-4 py-4 text-left transition ${
          collapsible ? "cursor-pointer hover:bg-sand/30" : "cursor-default"
        }`}
        aria-expanded={collapsible ? open : undefined}
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
          {step}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-ink">{title}</p>
          {description ? (
            <p className="mt-0.5 text-sm leading-5 text-ink/60">{description}</p>
          ) : null}
        </div>
        {collapsible ? (
          <svg
            viewBox="0 0 20 20"
            aria-hidden="true"
            className={`mt-0.5 h-5 w-5 shrink-0 stroke-ink/40 stroke-2 fill-none transition ${
              open ? "rotate-180" : ""
            }`}
          >
            <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : null}
      </button>
      {open ? <div className="border-t border-ink/6 px-4 pb-4 pt-3">{children}</div> : null}
    </div>
  );
};
