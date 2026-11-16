import { useEffect, useId, useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react'
import { Link, useRouter } from '../lib/router'
import { num, type Locale } from '../lib/i18n'

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ')

export const Icon = ({ d, className = 'size-5', flip = false }: { d: string; className?: string; flip?: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={cx(className, flip && 'ltr:-scale-x-100')} aria-hidden="true">
    <path d={d} />
  </svg>
)
export const ICONS = {
  phone: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z',
  pin: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  // Points to the inline-end side in RTL (left); flip prop mirrors it for LTR.
  next: 'M19 12H5m7-7-7 7 7 7',
  chevron: 'm6 9 6 6 6-6',
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'M6 6l12 12M18 6 6 18',
  info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 16v-4 M12 8h.01',
  alert: 'M12 9v4 M12 17h.01 M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z',
  pause: 'M10 4H6v16h4z M18 4h-4v16h4z',
  insta: 'M3 3h18v18H3z M16 11.4a4 4 0 1 1-7.9 1.200 4 4 0 0 1 7.900-1.200z M17.500 6.500h.01',
  globe: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M2 12h20 M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z',
  check: 'M20 6 9 17l-5-5',
  tooth: 'M7 3c-2.500 0-4 2-4 4.500 0 2 1 3 1.500 5S5 21 7 21c1.500 0 1.500-4 3-6 .5-.7 1.500-.7 2 0 1.500 2 1.500 6 3 6 2 0 1.500-6.500 2.500-8.500S21 9.500 21 7.500C21 5 19.500 3 17 3c-2 0-3 1-5 1S9 3 7 3z',
}

type BtnProps = {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  to?: string
  locale?: Locale
  href?: string
  children: ReactNode
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

export function Button({ variant = 'primary', size = 'md', loading, to, locale, href, className, children, disabled, ...rest }: BtnProps) {
  const cls = cx(
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl font-bold transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
    size === 'sm' && 'px-3.5 text-sm',
    size === 'md' && 'px-5 text-base',
    size === 'lg' && 'min-h-13 px-7 text-lg',
    variant === 'primary' && 'bg-[#b85d00] text-white shadow-sm hover:bg-[#964a00]',
    variant === 'secondary' && 'bg-brand-700 text-white hover:bg-brand-900',
    variant === 'ghost' && 'bg-transparent text-brand-700 ring-1 ring-brand-200 hover:bg-brand-50',
    variant === 'danger' && 'bg-red-700 text-white hover:bg-red-800',
    className,
  )
  const body = (
    <>
      {loading && <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />}
      {children}
    </>
  )
  if (to !== undefined) return <Link to={to} locale={locale} className={cls}>{body}</Link>
  if (href) return <a href={href} className={cls}>{body}</a>
  return <button className={cls} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>{body}</button>
}

export function Field({ label, hint, error, ...rest }: { label: string; hint?: string; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold text-brand-900">{label}</label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error || hint ? id + '-d' : undefined}
        className={cx('h-12 w-full rounded-xl border bg-white px-3 text-base outline-none transition focus:border-brand-700 focus:ring-4 focus:ring-brand-100', error ? 'border-red-700' : 'border-[#9db5b3]')}
        {...rest}
      />
      {(error || hint) && (
        <p id={id + '-d'} className={cx('mt-1.5 flex items-center gap-1.5 text-sm', error ? 'font-semibold text-red-700' : 'text-[#4a6665]')}>
          {error && <Icon d={ICONS.alert} className="size-4 shrink-0" />}
          {error || hint}
        </p>
      )}
    </div>
  )
}

export const Card = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cx('rounded-2xl border border-brand-100 bg-white p-5 shadow-[0_2px_14px_rgba(0,64,63,.06)]', className)}>{children}</div>
)

export function Badge({ tone = 'brand', icon, children }: { tone?: 'brand' | 'accent' | 'warn' | 'danger'; icon?: string; children: ReactNode }) {
  const tones = { brand: 'bg-brand-100 text-brand-900', accent: 'bg-[#fff0dd] text-[#8a4600]', warn: 'bg-amber-100 text-amber-900', danger: 'bg-red-100 text-red-900' }
  return <span className={cx('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold', tones[tone])}>{icon && <Icon d={icon} className="size-4" />}{children}</span>
}

// A visibly marked placeholder so nobody mistakes it for final copy.
export function Placeholder({ children, className }: { children?: ReactNode; className?: string }) {
  const { t } = useRouter()
  return (
    <div role="note" className={cx('rounded-xl border-2 border-dashed border-amber-600 bg-amber-50 p-4 text-sm font-semibold text-amber-900', className)}>
      {children ?? t.placeholder}
    </div>
  )
}

export function Notice({ tone = 'info', title, children, action }: { tone?: 'info' | 'warn' | 'danger'; title: string; children?: ReactNode; action?: ReactNode }) {
  const tones = { info: 'border-brand-200 bg-brand-50 text-brand-900', warn: 'border-amber-400 bg-amber-50 text-amber-950', danger: 'border-red-300 bg-red-50 text-red-950' }
  return (
    <div role={tone === 'danger' ? 'alert' : 'status'} className={cx('flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center', tones[tone])}>
      <Icon d={tone === 'info' ? ICONS.info : tone === 'warn' ? ICONS.pause : ICONS.alert} className="size-6 shrink-0" />
      <div className="flex-1">
        <p className="font-extrabold">{title}</p>
        {children && <p className="mt-1 text-sm leading-7">{children}</p>}
      </div>
      {action}
    </div>
  )
}

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  const { t } = useRouter()
  return (
    <nav aria-label="breadcrumb" className="text-sm text-[#3d5a59]">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li><Link to="" className="font-semibold hover:underline">{t.homeLabel}</Link></li>
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <Icon d="m9 6 6 6-6 6" className="size-3.5 rtl:-scale-x-100" />
            {it.to !== undefined ? <Link to={it.to} className="font-semibold hover:underline">{it.label}</Link> : <span aria-current="page" className="font-bold text-brand-900">{it.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function Accordion({ items }: { items: { q: string; a: ReactNode }[] }) {
  const [open, setOpen] = useState<number | null>(0)
  const base = useId()
  return (
    <div className="divide-y divide-brand-100 overflow-hidden rounded-2xl border border-brand-100 bg-white">
      {items.map((it, i) => (
        <div key={i}>
          <h3>
            <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} aria-controls={`${base}-${i}`} className="flex min-h-14 w-full items-center justify-between gap-4 p-4 text-start font-bold text-brand-900 focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-brand-700">
              {it.q}
              <Icon d={ICONS.chevron} className={cx('size-5 shrink-0 transition-transform duration-200', open === i && 'rotate-180')} />
            </button>
          </h3>
          {open === i && <div id={`${base}-${i}`} className="px-4 pb-4 leading-8 text-[#2c4a49]">{it.a}</div>}
        </div>
      ))}
    </div>
  )
}

export const Skeleton = ({ className }: { className?: string }) => <div className={cx('animate-pulse rounded-lg bg-brand-100', className)} aria-hidden="true" />

export const Stat = ({ value, label }: { value: string; label: string }) => (
  <div><p className="text-3xl font-extrabold text-brand-700 tabular-nums">{value}</p><p className="text-sm text-[#3d5a59]">{label}</p></div>
)

// Deadline: 29 Esfand 1405 = 20 March 2027, end of day Tehran (UTC+3:30).
export const OFFER_DEADLINE = new Date('2027-03-20T20:29:59Z').getTime()

export function Countdown({ dark = false, deadline = OFFER_DEADLINE }: { dark?: boolean; deadline?: number }) {
  const { t, locale } = useRouter()
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const s = Math.max(0, Math.floor((deadline - now) / 1000))
  const cells: [number, string][] = [[Math.floor(s / 86400), t.offer.d], [Math.floor(s / 3600) % 24, t.offer.h], [Math.floor(s / 60) % 60, t.offer.m], [s % 60, t.offer.s]]
  return (
    <div role="timer" aria-label={t.offer.countdown} className="flex gap-1.5 sm:gap-2">
      {cells.map(([v, l]) => (
        <div key={l} className={cx('min-w-0 flex-1 rounded-xl py-2 sm:w-[4.25rem] sm:flex-none text-center', dark ? 'bg-white/12 text-white' : 'bg-brand-50 text-brand-900')}>
          <div className="text-2xl font-extrabold tabular-nums">{num(locale, String(v).padStart(2, '0'))}</div>
          <div className="text-xs">{l}</div>
        </div>
      ))}
    </div>
  )
}

export function PausedNotice({ compact = false }: { compact?: boolean }) {
  const { t } = useRouter()
  return (
    <Notice tone="warn" title={t.paused.title} action={<Button variant="secondary" size="sm" to="contact">{t.paused.action}</Button>}>
      {!compact && t.paused.body}
    </Notice>
  )
}
