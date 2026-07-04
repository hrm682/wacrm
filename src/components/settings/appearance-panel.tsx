"use client";

import { Check, Moon, SunMoon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { MODES, type Mode } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { SettingsPanelHead } from "./settings-panel-head";
import { useLanguage } from "@/lib/i18n";

export function AppearancePanel() {
  const { mode, setMode } = useTheme();
  const { t } = useLanguage();

  return (
    <section className="max-w-3xl animate-in fade-in-50 duration-200">
      <SettingsPanelHead
        title={t("settings.appearance.title")}
        description={t("settings.appearance.description")}
      />

      <div className="space-y-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <SunMoon className="size-4 text-muted-foreground" />
          {t("settings.appearance.mode")}
        </h3>

        <div
          role="radiogroup"
          aria-label={t("settings.appearance.mode")}
          className="grid max-w-md grid-cols-2 gap-3"
        >
          {MODES.map((m) => (
            <ModeCard
              key={m}
              mode={m}
              isActive={m === mode}
              onPick={() => setMode(m)}
              t={t}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ModeCard({
  mode,
  isActive,
  onPick,
  t,
}: {
  mode: Mode;
  isActive: boolean;
  onPick: () => void;
  t: (key: string) => string;
}) {
  const isLight = mode === "light";
  const Icon = isLight ? Sun : Moon;
  const label = isLight ? t("settings.appearance.modes.light") : t("settings.appearance.modes.dark");

  return (
    <button
      type="button"
      role="radio"
      onClick={onPick}
      aria-checked={isActive}
      aria-label={`${t("settings.appearance.mode")}: ${label}`}
      className={cn(
        "flex items-center gap-3 rounded-lg border bg-card p-4 text-left transition-colors cursor-pointer",
        isActive
          ? "border-primary/60 ring-2 ring-primary/40"
          : "border-border hover:border-border hover:bg-muted/40",
      )}
    >
      <span
        aria-hidden
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-foreground"
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex-1 text-sm font-semibold text-foreground">
        {label}
      </span>
      {isActive && (
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary">
          <Check className="h-3 w-3" />
          {t("settings.appearance.active")}
        </span>
      )}
    </button>
  );
}
