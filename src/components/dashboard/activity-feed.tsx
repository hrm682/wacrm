"use client"

import Link from 'next/link'
import { useState } from 'react'
import {
  MessageSquare,
  UserPlus,
  Briefcase,
  Radio,
  Zap,
  Inbox,
} from 'lucide-react'
import type { ComponentType } from 'react'
import type { ActivityItem, ActivityKind } from '@/lib/dashboard/types'
import { cn } from '@/lib/utils'
import { EmptyState } from './empty-state'
import { Skeleton } from './skeleton'
import { useLanguage } from '@/lib/i18n'

interface ActivityFeedProps {
  items: ActivityItem[] | null
  loading: boolean
}

const PAGE_SIZES = [5, 10, 20, 50] as const
type PageSize = (typeof PAGE_SIZES)[number]

interface KindTheme {
  icon: ComponentType<{ className?: string }>
  /** Tailwind classes for the round icon badge + label color. */
  badge: string
}

const KIND_THEME: Record<ActivityKind, KindTheme> = {
  message: { icon: MessageSquare, badge: 'bg-blue-500/10 text-blue-400' },
  contact: { icon: UserPlus, badge: 'bg-primary/10 text-primary' },
  deal: { icon: Briefcase, badge: 'bg-primary/10 text-primary' },
  broadcast: { icon: Radio, badge: 'bg-amber-500/10 text-amber-400' },
  automation: { icon: Zap, badge: 'bg-rose-500/10 text-rose-400' },
}

export function ActivityFeed({ items, loading }: ActivityFeedProps) {
  const { t } = useLanguage()
  // Start at 5 — a quick scan of the most recent events without
  // dominating vertical real estate. User expands explicitly via the
  // footer control when they want deeper history.
  const [pageSize, setPageSize] = useState<PageSize>(5)

  const totalLoaded = items?.length ?? 0
  const visible = items?.slice(0, pageSize) ?? []
  // A size option is "useful" if picking it would reveal rows the
  // smaller option doesn't already show. With PAGE_SIZES=[5,10,20,50]:
  // "10" is useful only once we've loaded ≥6 items, "20" once ≥11, etc.
  // The smallest option is always enabled.
  const isSizeUseful = (size: PageSize, i: number) =>
    i === 0 || totalLoaded > PAGE_SIZES[i - 1]

  return (
    <section className="rounded-xl border border-border bg-card">
      <header className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="text-sm font-semibold text-foreground">{t("dashboard.activity.title")}</h2>
        <Link
          href="/inbox"
          className="text-xs font-medium text-primary hover:text-primary/80"
        >
          {t("dashboard.activity.view_all")}
        </Link>
      </header>

      {loading || !items ? (
        <div className="space-y-2 p-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="p-5">
          <EmptyState
            icon={Inbox}
            title={t("dashboard.activity.no_activity")}
            hint={t("dashboard.activity.no_activity_hint")}
          />
        </div>
      ) : (
        <>
          <ul className="divide-y divide-border">
            {visible.map((it, i) => {
              const theme = KIND_THEME[it.kind]
              const Icon = theme.icon
              // Alternating row background for scanability. bg-muted/40
              // keeps the stripe visible in both light and dark modes
              // (bg-card/40 vanishes against a white card surface in light).
              const stripe = i % 2 === 0 ? 'bg-transparent' : 'bg-muted/40'
              const row = (
                <div className="flex items-center gap-3 px-5 py-2.5">
                  <span
                    className={cn(
                      'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full',
                      theme.badge,
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                    {getTranslatedText(it.text, t)}
                  </span>
                  <span className="flex-shrink-0 text-xs text-muted-foreground tabular-nums">
                    {relativeTime(it.at, t)}
                  </span>
                </div>
              )
              return (
                <li key={it.id} className={cn(stripe, 'transition-colors hover:bg-muted/40')}>
                  {it.href ? (
                    <Link href={it.href} className="block">
                      {row}
                    </Link>
                  ) : (
                    row
                  )}
                </li>
              )
            })}
          </ul>
          <footer className="flex items-center justify-between border-t border-border px-5 py-3 text-xs">
            <span className="text-muted-foreground tabular-nums">
              {t("dashboard.activity.showing")
                .replace("{visible}", visible.length.toString())
                .replace("{total}", totalLoaded.toString())}
              {totalLoaded === 50 ? '+' : ''}
            </span>
            <div className="flex items-center gap-1">
              <span className="mr-1 text-muted-foreground">{t("dashboard.activity.show")}</span>
              {PAGE_SIZES.map((size, i) => {
                const disabled = !isSizeUseful(size, i)
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setPageSize(size)}
                    disabled={disabled}
                    className={cn(
                      'rounded-md px-2 py-1 font-medium tabular-nums transition-colors cursor-pointer',
                      pageSize === size
                        ? 'bg-secondary text-secondary-foreground font-semibold'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      disabled && 'cursor-not-allowed opacity-40 hover:bg-transparent hover:text-muted-foreground',
                    )}
                  >
                    {size}
                  </button>
                )
              })}
            </div>
          </footer>
        </>
      )}
    </section>
  )
}

function relativeTime(iso: string, t: (key: string) => string): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const diffSec = Math.round((Date.now() - then) / 1000)
  if (diffSec < 60) {
    const val = Math.max(1, diffSec)
    return (t("dashboard.activity.time.seconds") || "{count}s ago").replace("{count}", val.toString())
  }
  if (diffSec < 3600) {
    const val = Math.floor(diffSec / 60)
    return (t("dashboard.activity.time.minutes") || "{count}m ago").replace("{count}", val.toString())
  }
  if (diffSec < 86400) {
    const val = Math.floor(diffSec / 3600)
    return (t("dashboard.activity.time.hours") || "{count}h ago").replace("{count}", val.toString())
  }
  if (diffSec < 2_592_000) {
    const val = Math.floor(diffSec / 86400)
    return (t("dashboard.activity.time.days") || "{count}d ago").replace("{count}", val.toString())
  }
  return new Date(iso).toLocaleDateString()
}

function getTranslatedText(text: string, t: (key: string) => string): string {
  // 1. Message
  if (text.startsWith("New message from ")) {
    const who = text.substring("New message from ".length);
    return (t("dashboard.activity.message_from") || "New message from {who}").replace("{who}", who);
  }
  // 2. Contact
  if (text.startsWith("New contact: ")) {
    const who = text.substring("New contact: ".length);
    return (t("dashboard.activity.new_contact") || "New contact: {who}").replace("{who}", who);
  }
  // 3. Deal stage
  // Deal "X" in Y
  const dealStageMatch = text.match(/^Deal "(.+)" in (.+)$/);
  if (dealStageMatch) {
    const [, title, stage] = dealStageMatch;
    return (t("dashboard.activity.deal_stage") || 'Deal "{title}" in {stage}').replace("{title}", title).replace("{stage}", stage);
  }
  // Deal "X" updated
  const dealUpdatedMatch = text.match(/^Deal "(.+)" updated$/);
  if (dealUpdatedMatch) {
    const [, title] = dealUpdatedMatch;
    return (t("dashboard.activity.deal_updated") || 'Deal "{title}" updated').replace("{title}", title);
  }
  // 4. Broadcast
  // Broadcast "X" sent to Y contacts
  const broadcastSentMatch = text.match(/^Broadcast "(.+)" sent to (\d+) contacts$/);
  if (broadcastSentMatch) {
    const [, name, count] = broadcastSentMatch;
    return (t("dashboard.activity.broadcast_sent") || 'Broadcast "{name}" sent to {count} contacts').replace("{name}", name).replace("{count}", count);
  }
  // Broadcast "X" status (count recipients)
  const broadcastStatusMatch = text.match(/^Broadcast "(.+)" (.+) \((\d+) recipients\)$/);
  if (broadcastStatusMatch) {
    const [, name, status, count] = broadcastStatusMatch;
    return (t("dashboard.activity.broadcast_status") || 'Broadcast "{name}" {status} ({count} recipients)').replace("{name}", name).replace("{status}", status).replace("{count}", count);
  }
  // 5. Automation
  // Automation "X" triggered for Y
  const autoTriggeredMatch = text.match(/^Automation "(.+)" triggered for (.+)$/);
  if (autoTriggeredMatch) {
    const [, name, who] = autoTriggeredMatch;
    return (t("dashboard.activity.automation_triggered") || 'Automation "{name}" triggered for {who}').replace("{name}", name).replace("{who}", who);
  }
  // Automation "X" failed for Y
  const autoFailedMatch = text.match(/^Automation "(.+)" failed for (.+)$/);
  if (autoFailedMatch) {
    const [, name, who] = autoFailedMatch;
    return (t("dashboard.activity.automation_failed") || 'Automation "{name}" failed for {who}').replace("{name}", name).replace("{who}", who);
  }

  return text;
}
