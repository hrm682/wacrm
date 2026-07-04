"use client";

import { ChevronDown } from "lucide-react";
import { useLanguage, LANGUAGES } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function LanguageSelector({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage();
  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-xs font-semibold text-foreground shadow-xs transition-colors hover:bg-muted hover:text-foreground outline-hidden cursor-pointer",
          className
        )}
      >
        <span className="flex h-4 w-5 items-center justify-center rounded bg-muted-foreground/15 text-[9px] font-bold text-muted-foreground uppercase">
          {currentLang.flag}
        </span>
        <span>{currentLang.name}</span>
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36 bg-card border border-border">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={cn(
              "flex items-center gap-2 px-2 py-1.5 cursor-pointer text-xs transition-colors hover:bg-muted rounded-md",
              lang.code === language && "bg-primary/10 font-bold text-primary focus:bg-primary/15"
            )}
          >
            <span className="flex h-4 w-5 shrink-0 items-center justify-center rounded bg-muted-foreground/15 text-[9px] font-bold text-muted-foreground uppercase">
              {lang.flag}
            </span>
            <span className="flex-1">{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
