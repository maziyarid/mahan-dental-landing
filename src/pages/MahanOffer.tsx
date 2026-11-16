import { useEffect, useMemo, useState } from 'react'

const PHONE = '02188973510'
const MOBILE = '09123937219'
const DEADLINE = new Date('2027-03-20T20:29:59Z').getTime()
// Set to your CRM / Google Apps Script / webhook URL to receive leads.
const LEAD_ENDPOINT = (import.meta.env.VITE_LEAD_ENDPOINT as string | undefined) ?? ''
const MAP = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('تهران، جهاد، خیابان دکتر فاطمی، خیابان چهلستون')

const fa = (n: number | string) => String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d])
const en = (s: string) => s.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))

function validNationalCode(raw: string) {
  const c = en(raw)
  if (!/^\d{10}$/.test(c) || /^(\d)\1{9}$/.test(c)) return false
  const sum = [...c.slice(0, 9)].reduce((a, d, i) => a + +d * (10 - i), 0) % 11
  return +c[9] === (sum < 2 ? sum : 11 - sum)
}

const Icon = ({ d, className = 'size-6' }: { d: string; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d={d} /></svg>
)
const I = {
  phone: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z',
  pin: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  check: 'M20 6 9 17l-5-5',
  arrow: 'M19 12H5m7-7-7 7 7 7',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2',
  tooth: 'M7 3c-2.5 0-4 2-4 4.5 0 2 1 3 1.5 5S5 21 7 21c1.5 0 1.5-4 3-6 .5-.7 1.5-.7 2 0 1.5 2 1.5 6 3 6 2 0 1.5-6.500 2.5-8.500S21 9.500 21 7.500C21 5 19.500 3 17 3c-2 0-3 1-5 1S9 3 7 3z',
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  cal: 'M3 6h18v15H3z M3 10h18 M8 2v4 M16 2v4',
  gift: 'M20 12v10H4V12 M2 7h20v5H2z M12 22V7 M12 7H7.500a2.500 2.500 0 1 1 0-5C11 2 12 7 12 7z M12 7h4.500a2.500 2.500 0 1 0 0-5C13 2 12 7 12 7z',
}

function useCountdown() {
  const [now, setNow] = useState(Date.now())
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t) }, [])
  const s = Math.max(0, Math.floor((DEADLINE - now) / 1000))
  return { d: Math.floor(s / 86400), h: Math.floor(s / 3600) % 24, m: Math.floor(s / 60) % 60, s: s % 60 }
}

function Countdown({ dark = false }: { dark?: boolean }) {
  const t = useCountdown()
  const cells: [number, string][] = [[t.d, 'روز'], [t.h, 'ساعت'], [t.m, 'دقیقه'], [t.s, 'ثانیه']]
  return (
    <div role="timer" aria-label="زمان باقی مانده تا پایان مهلت" className="flex gap-2" dir="rtl">
      {cells.map(([v, l]) => (
        <div key={l} className={`w-16 rounded-xl py-2 text-center ${dark ? 'bg-white/10 text-white' : 'bg-brand-50 text-brand-900'}`}>
          <div className="text-2xl font-extrabold tabular-nums">{fa(String(v).padStart(2, '0'))}</div>
          <div className="text-xs opacity-70">{l}</div>
        </div>
      ))}
    </div>
  )
}

function LeadForm({ id, compact = false }: { id: string; compact?: boolean }) {
  const [v, setV] = useState({ name: '', mobile: '', nid: '', company: '' })
  const [err, setErr] = useState<Record<string, string>>({})
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'fail'>('idle')

  const validate = () => {
    const e: Record<string, string> = {}
    if (v.name.trim().length < 3) e.name = 'نام و نام خانوادگی را وارد کنید.'
    if (!/^09\d{9}$/.test(en(v.mobile).replace(/\s/g, ''))) e.mobile = 'شماره موبایل معتبر نیست (مثال: ۰۹۱۲۱۲۳۴۵۶۷).'
    if (!validNationalCode(v.nid)) e.nid = 'کد ملی ۱۰ رقمی معتبر وارد کنید.'
    setErr(e)
    return !Object.keys(e).length
  }

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (v.company || !validate()) return // honeypot / validation
    setState('sending')
    const payload = { name: v.name.trim(), mobile: en(v.mobile), nationalCode: en(v.nid), source: 'google-ads', page: location.href, at: new Date().toISOString() }
    try {
      if (LEAD_ENDPOINT) {
        const r = await fetch(LEAD_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(payload) })
        if (!r.ok) throw new Error('bad status')
      }
      // Conversion event for Google Tag Manager / gtag
      const w = window as unknown as { dataLayer?: unknown[] }
      ;(w.dataLayer ||= []).push({ event: 'generate_lead', form_id: id })
      setState('done')
    } catch {
      setState('fail')
    }
  }

  if (state === 'done')
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-xl" role="status">
        <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-brand-700 text-white"><Icon d={I.check} /></div>
        <h3 className="text-xl font-extrabold text-brand-900">درخواست شما ثبت شد</h3>
        <p className="mt-2 text-sm leading-7 text-slate-600">تیم مرکز برای هماهنگی جلسه بررسی با شما تماس می گیرد. برای تماس سریع تر:</p>
        <a href={`tel:${PHONE}`} className="mt-4 inline-block font-bold text-brand-700" dir="ltr">{fa('021 8897 3510')}</a>
      </div>
    )

  const field = (k: 'name' | 'mobile' | 'nid', label: string, icon: string, props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <div>
      <label htmlFor={`${id}-${k}`} className="mb-1.5 block text-sm font-semibold text-brand-900">{label}</label>
      <div className="relative">
        <Icon d={icon} className="pointer-events-none absolute end-3 top-1/2 size-5 -translate-y-1/2 text-brand-500" />
        <input id={`${id}-${k}`} value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} aria-invalid={!!err[k]} aria-describedby={err[k] ? `${id}-${k}-e` : undefined}
          className={`h-12 w-full rounded-xl border bg-brand-50/60 ps-10 pe-3 text-base outline-none transition focus:border-brand-700 focus:bg-white focus:ring-4 focus:ring-brand-100 ${err[k] ? 'border-red-500' : 'border-brand-100'}`} {...props} />
      </div>
      {err[k] && <p id={`${id}-${k}-e`} className="mt-1 text-xs text-red-600">{err[k]}</p>}
    </div>
  )

  return (
    <form onSubmit={submit} noValidate className="space-y-4 rounded-2xl bg-white p-6 shadow-xl ring-1 ring-brand-100 sm:p-8">
      <div>
        <h2 className="text-xl font-extrabold text-brand-900">{compact ? 'ثبت درخواست رایگان' : 'ثبت درخواست'}</h2>
        <p className="mt-1 text-sm text-slate-600">اطلاعات خود را وارد کنید تا تیم مرکز با شما تماس بگیرد.</p>
      </div>
      <input tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" value={v.company} onChange={(e) => setV({ ...v, company: e.target.value })} name="company" />
      {field('name', 'نام و نام خانوادگی', I.user, { autoComplete: 'name', placeholder: 'مثلا: علی رضایی' })}
      {field('mobile', 'شماره موبایل', I.phone, { type: 'tel', inputMode: 'tel', autoComplete: 'tel', placeholder: '۰۹۱۲۱۲۳۴۵۶۷', dir: 'ltr', style: { textAlign: 'right' } })}
      {field('nid', 'کد ملی', I.shield, { inputMode: 'numeric', maxLength: 10, placeholder: '۱۰ رقم', dir: 'ltr', style: { textAlign: 'right' } })}
      <button disabled={state === 'sending'} className="pulse-cta flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-accent text-lg font-extrabold text-brand-900 transition hover:bg-accent-dark hover:text-white disabled:opacity-60">
        {state === 'sending' ? 'در حال ارسال...' : <>ثبت درخواست <Icon d={I.arrow} className="size-5" /></>}
      </button>
      {state === 'fail' && <p className="text-sm text-red-600" role="alert">ارسال انجام نشد. لطفا دوباره تلاش کنید یا تماس بگیرید: {fa('021 8897 3510')}</p>}
      <p className="flex items-start gap-2 text-xs leading-6 text-slate-500"><Icon d={I.shield} className="mt-1 size-4 shrink-0 text-brand-700" />اطلاعات شما فقط برای تماس مرکز با شما استفاده می شود و به هیچ شخص دیگری داده نمی شود.</p>
    </form>
  )
}

const faqs = [
  ['بعد از ثبت درخواست چه اتفاقی می افتد؟', 'درخواست شما برای مرکز ارسال می شود و تیم مرکز برای هماهنگی جلسه بررسی با شما تماس می گیرد.'],
  ['چرا کد ملی لازم است؟', 'کد ملی برای شناسایی درخواست شما در مرکز استفاده می شود. این اطلاعات فقط در اختیار مرکز قرار می گیرد.'],
  ['آیا قیمت ۱۲۵ میلیون تومان قطعی است؟', 'مبلغ این پیشنهاد ۱۲۵ میلیون تومان است. جزئیات کامل و شرایط نهایی پس از معاینه و در جلسه بررسی مشخص می شود.'],
  ['مهلت این پیشنهاد تا کی است؟', 'مهلت این پیشنهاد تا ۲۹ اسفند ۱۴۰۵ است. شمارش معکوس بالای صفحه، زمان باقی مانده را نشان می دهد.'],
  ['آدرس مرکز کجاست؟', 'تهران، جهاد، خیابان دکتر فاطمی، خیابان چهلستون.'],
  ['چطور با مرکز تماس بگیرم؟', 'تلفن ثابت مرکز ۰۲۱۸۸۹۷۳۵۱۰ و موبایل مرکز ۰۹۱۲۳۹۳۷۲۱۹ است. در اینستاگرام هم با نشانی @mahan__dental در دسترس هستیم.'],
]

export default function MahanOffer() {
  useEffect(() => {
    document.documentElement.lang = 'fa'
    document.documentElement.dir = 'rtl'
    document.title = 'دندان دار شدن ثابت با ۴ ایمپلنت کره ای، ۱۲۵ میلیون تومان | دندانپزشکی ماهان'
    const m = document.querySelector('meta[name="description"]') ?? Object.assign(document.head.appendChild(document.createElement('meta')), { name: 'description' })
    m.setAttribute('content', 'دندان دار شدن ثابت با ۴ ایمپلنت کره ای، ۱۲۵ میلیون تومان، در دندانپزشکی ماهان تهران. درخواست ثبت کنید تا تیم مرکز با شما تماس بگیرد.')
    const ic = document.querySelector('link[rel="icon"]') ?? Object.assign(document.head.appendChild(document.createElement('link')), { rel: 'icon' })
    ic.setAttribute('href', '/favicon.png')
  }, [])
  const [open, setOpen] = useState<number | null>(0)
  const remaining = useMemo(() => 200, [])
  const btn = 'inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 font-bold transition'

  return (
    <div className="pb-20 lg:pb-0">
      <header className="sticky top-0 z-40 border-b border-brand-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
          <a href="#top" className="flex items-center gap-3">
            <img src="/brand-icon.png" alt="رویا درمان" width="40" height="38" className="h-9 w-auto" />
            <span className="hidden h-7 w-px bg-brand-100 sm:block" />
            <img src="/wordmark.webp" alt="دندانپزشکی ماهان" width="110" height="36" className="hidden h-8 w-auto sm:block" />
          </a>
          <nav className="me-auto hidden gap-6 text-sm font-semibold text-brand-900 md:flex" aria-label="بخش های صفحه">
            {[['#offer', 'پیشنهاد'], ['#steps', 'مراحل'], ['#faq', 'سوالات متداول'], ['#contact', 'تماس']].map(([h, l]) => <a key={h} href={h} className="hover:text-accent-dark">{l}</a>)}
          </nav>
          <a href={`tel:${PHONE}`} className="me-auto flex items-center gap-2 text-sm font-bold text-brand-700 md:me-0" dir="ltr"><Icon d={I.phone} className="size-5" />{fa('021 8897 3510')}</a>
          <a href="#form" className={`${btn} hidden h-10 bg-brand-700 px-5 text-sm text-white hover:bg-brand-900 sm:inline-flex`}>ثبت درخواست</a>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="relative overflow-hidden bg-brand-700 text-white">
          <div className="absolute -start-32 -top-32 size-[28rem] rounded-full bg-brand-500/40 blur-3xl" />
          <div className="absolute -bottom-40 end-0 size-[30rem] rounded-full bg-accent/20 blur-3xl" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 lg:grid-cols-[1.15fr_1fr] lg:py-20">
            <div className="rise">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold ring-1 ring-white/25"><span className="size-2 rounded-full bg-accent" />پیشنهاد ویژه دندانپزشکی ماهان · تا ۲۹ اسفند ۱۴۰۵</p>
              <h1 className="mt-5 text-4xl font-black leading-[1.35] sm:text-5xl">دندان دار شدن ثابت و مادام العمر با <span className="text-accent">۴ ایمپلنت کره ای</span></h1>
              <div className="mt-6 flex flex-wrap items-baseline gap-3">
                <span className="text-4xl font-black text-accent sm:text-5xl">۱۲۵ میلیون تومان</span>
                <span className="text-brand-100">برای ۴ ایمپلنت کره ای</span>
              </div>
              <p className="mt-5 max-w-xl leading-8 text-brand-50/90">اگر دندان های خود را از دست داده اید، همین حالا درخواست ثبت کنید. تیم مرکز پس از بررسی درخواست با شما تماس می گیرد و شرایط را در جلسه بررسی توضیح می دهد.</p>
              <ul className="mt-6 grid gap-2 text-sm font-semibold sm:grid-cols-2">
                {['جلسه بررسی حضوری', 'مرکز مشخص در تهران', 'تماس مستقیم با مرکز', 'ثبت درخواست در کمتر از یک دقیقه'].map((t) => <li key={t} className="flex items-center gap-2"><span className="grid size-5 place-items-center rounded-full bg-accent text-brand-900"><Icon d={I.check} className="size-3.5" /></span>{t}</li>)}
              </ul>
              <div className="mt-8 rounded-2xl bg-black/15 p-4 ring-1 ring-white/15">
                <p className="mb-3 flex items-center gap-2 text-sm font-semibold"><Icon d={I.clock} className="size-5 text-accent" />تا پایان مهلت</p>
                <Countdown dark />
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs"><span>{fa(remaining)} نفر از {fa(200)} نفر باقی مانده</span><span className="text-brand-100">با هر ثبت نام جدید، این عدد کم می شود.</span></div>
                  <div className="h-2 rounded-full bg-white/15"><div className="h-2 w-full rounded-full bg-accent" /></div>
                </div>
              </div>
            </div>
            <div id="form" className="rise [animation-delay:.15s] lg:sticky lg:top-24"><LeadForm id="hero" compact /></div>
          </div>
        </section>

        {/* AT A GLANCE */}
        <section className="mx-auto -mt-0 grid max-w-6xl gap-4 px-4 py-10 sm:grid-cols-3">
          {[[I.tooth, '۴ ایمپلنت', 'دندان دار شدن ثابت'], [I.gift, '۱۲۵ میلیون تومان', 'مبلغ پیشنهاد'], [I.cal, '۲۹ اسفند ۱۴۰۵', 'پایان مهلت']].map(([ic, a, b]) => (
            <div key={a} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-brand-100">
              <div className="grid size-12 place-items-center rounded-xl bg-brand-50 text-brand-700"><Icon d={ic} /></div>
              <div><div className="text-lg font-extrabold text-brand-900">{a}</div><div className="text-sm text-slate-500">{b}</div></div>
            </div>
          ))}
        </section>

        {/* OFFER */}
        <section id="offer" className="mx-auto max-w-6xl px-4 py-12">
          <p className="font-bold text-accent-dark">این پیشنهاد چیست؟</p>
          <h2 className="mt-2 max-w-2xl text-3xl font-black leading-snug text-brand-900">پیشنهاد دندانپزشکی ماهان برای کسانی که دندان های خود را از دست داده اند</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[['۰۱', '۴ ایمپلنت', 'این پیشنهاد برای دندان دار شدن ثابت با ۴ ایمپلنت است.'], ['۰۲', 'ایمپلنت کره ای', 'ایمپلنت های این پیشنهاد کره ای هستند.'], ['۰۳', '۱۲۵ میلیون تومان', 'مبلغ این پیشنهاد ۱۲۵ میلیون تومان است. جزئیات کامل در جلسه بررسی توضیح داده می شود.']].map(([n, t, d]) => (
              <article key={n} className="group rounded-2xl bg-white p-7 ring-1 ring-brand-100 transition hover:-translate-y-1 hover:shadow-xl">
                <span className="text-4xl font-black text-brand-100 transition group-hover:text-accent">{n}</span>
                <h3 className="mt-3 text-xl font-extrabold text-brand-900">{t}</h3>
                <p className="mt-2 leading-8 text-slate-600">{d}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 rounded-xl bg-brand-50 p-4 text-sm leading-7 text-brand-900">قیمت و شرایط نهایی پس از معاینه و در جلسه بررسی مشخص می شود. اطلاعات این صفحه تشخیص پزشکی یا تضمین نتیجه نیست.</p>
        </section>

        {/* STEPS */}
        <section id="steps" className="bg-brand-50 py-14">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-center text-3xl font-black text-brand-900">سه قدم تا شروع</h2>
            <div className="relative mt-10 grid gap-6 md:grid-cols-3">
              <div className="absolute inset-x-[16%] top-7 hidden border-t-2 border-dashed border-brand-200 md:block" />
              {[['۱', 'درخواست ثبت کنید', 'نام، شماره موبایل و کد ملی خود را در فرم وارد کنید.'], ['۲', 'تماس از مرکز', 'تیم مرکز برای هماهنگی جلسه بررسی با شما تماس می گیرد.'], ['۳', 'جلسه بررسی', 'در جلسه بررسی، شرایط شما بررسی و جزئیات کامل توضیح داده می شود.']].map(([n, t, d]) => (
                <div key={n} className="relative text-center">
                  <div className="relative mx-auto grid size-14 place-items-center rounded-full bg-brand-700 text-2xl font-black text-white ring-8 ring-brand-50">{n}</div>
                  <h3 className="mt-4 text-lg font-extrabold text-brand-900">{t}</h3>
                  <p className="mx-auto mt-2 max-w-xs leading-8 text-slate-600">{d}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center"><a href="#form" className={`${btn} bg-accent text-brand-900 hover:bg-accent-dark hover:text-white`}>ثبت درخواست <Icon d={I.arrow} className="size-5" /></a></div>
          </div>
        </section>

        {/* CTA BAND */}
        <section className="bg-brand-900 py-12 text-white">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 md:flex-row">
            <div>
              <h2 className="text-2xl font-black">فرصت ثبت درخواست تا ۲۹ اسفند ۱۴۰۵</h2>
              <p className="mt-2 text-brand-100">همین حالا درخواست ثبت کنید یا مستقیم با مرکز تماس بگیرید.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <a href={`tel:${PHONE}`} className={`${btn} bg-white text-brand-900 hover:bg-brand-100`} dir="ltr"><Icon d={I.phone} className="size-5" />{fa('021 8897 3510')}</a>
              <a href="#form" className={`${btn} bg-accent text-brand-900 hover:bg-accent-dark hover:text-white`}>ثبت درخواست</a>
            </div>
          </div>
        </section>

        {/* FAQ + FORM */}
        <section id="faq" className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="text-3xl font-black text-brand-900">سوالات متداول</h2>
            <p className="mt-2 text-slate-600">اطلاعات بیشتر به شما کمک می کند قدم بعدی را با اطمینان بردارید.</p>
            <div className="mt-6 space-y-3">
              {faqs.map(([q, a], i) => (
                <div key={q} className="rounded-xl bg-white ring-1 ring-brand-100">
                  <h3><button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-4 p-5 text-start font-bold text-brand-900">
                    {q}<span className={`grid size-7 shrink-0 place-items-center rounded-full bg-brand-50 text-xl text-brand-700 transition ${open === i ? 'rotate-45' : ''}`}>+</span></button></h3>
                  {open === i && <p className="px-5 pb-5 leading-8 text-slate-600">{a}</p>}
                </div>
              ))}
            </div>
          </div>
          <div className="lg:sticky lg:top-24 lg:self-start"><LeadForm id="bottom" /></div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="bg-brand-50 py-14">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-3xl font-black text-brand-900">تماس با مرکز</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-4">
              {[['آدرس', 'تهران، جهاد، خیابان دکتر فاطمی، خیابان چهلستون', null], ['تلفن ثابت', fa('021 8897 3510'), `tel:${PHONE}`], ['موبایل', fa(MOBILE), `tel:${MOBILE}`], ['اینستاگرام', '@mahan__dental', 'https://www.instagram.com/mahan__dental']].map(([t, v, h]) => (
                <div key={t as string} className="rounded-2xl bg-white p-5 ring-1 ring-brand-100">
                  <div className="text-sm text-slate-500">{t}</div>
                  {h ? <a href={h} className="mt-1 block font-extrabold text-brand-900 hover:text-accent-dark" dir="auto">{v}</a> : <div className="mt-1 font-bold leading-7 text-brand-900">{v}</div>}
                </div>
              ))}
            </div>
            <a href={MAP} target="_blank" rel="noreferrer" className={`${btn} mt-6 bg-brand-700 text-white hover:bg-brand-900`}><Icon d={I.pin} className="size-5" />مشاهده در نقشه</a>
          </div>
        </section>
      </main>

      <footer className="bg-brand-900 py-8 text-center text-sm text-brand-100">
        <img src="/brand-icon.png" alt="" className="mx-auto mb-3 h-10 w-auto" />
        <p className="font-bold text-white">رویا درمان · با شما در هر قدم</p>
        <p className="mt-1">مراقبت دندان: ماهان · هماهنگی: رویا درمان</p>
        <p className="mt-3 text-xs opacity-70">© 2026 رویا درمان · صفحه معرفی پیشنهاد دندانپزشکی ماهان، تهران، ایران. برای اورژانس پزشکی، با خدمات اورژانس محلی تماس بگیرید.</p>
      </footer>

      {/* Mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 border-t border-brand-100 bg-white p-3 lg:hidden">
        <a href={`tel:${PHONE}`} className="flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-700 font-bold text-white"><Icon d={I.phone} className="size-5" />تماس</a>
        <a href="#form" className="flex h-12 items-center justify-center rounded-xl bg-accent font-extrabold text-brand-900">ثبت درخواست</a>
      </div>
    </div>
  )
}
