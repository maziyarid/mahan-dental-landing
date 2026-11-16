import { Link, useRouter } from '../lib/router'
import { Button, Card, Countdown, Icon, ICONS, PausedNotice, Placeholder, Badge } from '../components/ui'
import { mapUrl, phoneDisplay, useHead } from '../components/Layout'
import { FACTS, num } from '../lib/i18n'

export function AddressCard() {
  const { t, locale } = useRouter()
  const c = t.contactInfo
  return (
    <Card>
      <h2 className="text-lg font-extrabold text-brand-900">{c.address}</h2>
      <p className="mt-2 flex gap-2 leading-8"><Icon d={ICONS.pin} className="mt-2 size-5 shrink-0 text-brand-700" />{c.addressValue}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="ghost" size="sm" href={mapUrl}>{c.map}</Button>
        <Button variant="secondary" size="sm" href={`tel:${FACTS.landline}`}><Icon d={ICONS.phone} className="size-4" /><span dir="ltr">{phoneDisplay(locale, FACTS.landline)}</span></Button>
        <Button variant="secondary" size="sm" href={`tel:${FACTS.mobile}`}><Icon d={ICONS.phone} className="size-4" /><span dir="ltr">{phoneDisplay(locale, FACTS.mobile)}</span></Button>
      </div>
    </Card>
  )
}

export function OfferBanner() {
  const { t, locale } = useRouter()
  const o = t.offer
  return (
    <section aria-labelledby="offer-h" className="overflow-hidden rounded-3xl bg-linear-to-br from-brand-900 to-brand-700 p-6 text-white md:p-10">
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="min-w-0">
          <span className="inline-block rounded-full bg-accent px-3 py-1 text-sm font-extrabold text-brand-900">{o.badge}</span>
          <h2 id="offer-h" className="mt-4 text-2xl font-black md:text-3xl">{o.title}</h2>
          <p className="mt-3 text-3xl font-black leading-snug text-accent md:text-5xl">{o.price}</p>
          <p className="mt-3 font-bold">{o.until}</p>
          <p className="mt-2 max-w-xl text-sm leading-7 text-white/90">{o.boundary}</p>
        </div>
        <div className="min-w-0 rounded-2xl bg-white/10 p-4 sm:p-5">
          <p className="mb-3 text-sm font-bold">{o.countdown}</p>
          <div dir="ltr"><Countdown dark /></div>
          <Button to="mahan" locale="fa" className="mt-5 w-full">{o.cta}<Icon d={ICONS.next} flip className="size-5" /></Button>
          {locale !== 'fa' && <p className="mt-2 text-xs text-white/85">{o.lang}</p>}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const { t, locale } = useRouter()
  useHead(t.home.title, t.home.desc)
  const h = t.home
  return (
    <>
      <section className="bg-linear-to-b from-brand-50 to-[#f8fbfa]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:py-16 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <h1 className="text-3xl font-black leading-snug text-brand-900 md:text-5xl md:leading-snug">{h.h1}</h1>
            <p className="mt-4 max-w-xl text-lg leading-8 text-[#2c4a49]">{h.lead}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="lg" to="request">{t.ctaRequest}</Button>
              <Button size="lg" variant="ghost" href={`tel:${FACTS.landline}`}><Icon d={ICONS.phone} />{t.ctaCall}</Button>
            </div>
          </div>
          <AddressCard />
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-12 px-4 py-10">
        <div id="paused"><PausedNotice /></div>
        <OfferBanner />

        <section aria-labelledby="steps-h">
          <h2 id="steps-h" className="text-2xl font-extrabold text-brand-900">{h.stepsTitle}</h2>
          <ol className="mt-5 grid gap-4 md:grid-cols-3">
            {h.steps.map((s, i) => (
              <li key={i}><Card className="h-full">
                <span className="flex size-10 items-center justify-center rounded-full bg-brand-700 text-lg font-extrabold text-white">{num(locale, i + 1)}</span>
                <h3 className="mt-3 text-lg font-extrabold text-brand-900">{s.t}</h3>
                <p className="mt-1 leading-8 text-[#2c4a49]">{s.b}</p>
              </Card></li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="trust-h">
          <h2 id="trust-h" className="text-2xl font-extrabold text-brand-900">{h.trustTitle}</h2>
          <Placeholder className="mt-4">{h.trust}</Placeholder>
        </section>

        <section aria-labelledby="svc-h">
          <div className="flex items-end justify-between gap-4">
            <h2 id="svc-h" className="text-2xl font-extrabold text-brand-900">{h.servicesTitle}</h2>
            <Link to="services" className="flex items-center gap-1 font-bold text-brand-700 hover:underline">{h.servicesAll}<Icon d={ICONS.next} flip className="size-4" /></Link>
          </div>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.services.items.map((s) => (
              <li key={s.slug}><Link to={`services/${s.slug}`} className="block h-full rounded-2xl border border-brand-100 bg-white p-5 shadow-[0_2px_14px_rgba(0,64,63,.06)] transition hover:border-brand-500 focus-visible:outline-3 focus-visible:outline-brand-700">
                <Icon d={ICONS.tooth} className="size-8 text-brand-700" />
                <h3 className="mt-3 font-extrabold text-brand-900">{s.t}</h3>
                <p className="mt-1 text-sm text-[#3d5a59]">{s.s}</p>
              </Link></li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="map-h" className="grid gap-4 lg:grid-cols-2">
          <Card>
            <h2 id="map-h" className="text-xl font-extrabold text-brand-900">{h.mapTitle}</h2>
            <p className="mt-1 text-[#2c4a49]">{h.mapIntro}</p>
            <div className="mt-4 flex min-h-40 items-center justify-center rounded-xl border-2 border-dashed border-brand-200 bg-brand-50 p-4 text-center font-semibold text-brand-900">{h.mapEmpty}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="ghost" size="sm" to="services">{h.mapNext[0]}</Button>
              <Button variant="ghost" size="sm" to="contact">{h.mapNext[1]}</Button>
            </div>
          </Card>
          <Card>
            <h2 className="text-xl font-extrabold text-brand-900">{h.finderTitle}</h2>
            <p className="mt-2 leading-8 text-[#2c4a49]">{h.finderBody}</p>
            <div className="mt-3"><Badge tone="accent">{t.placeholderGeneric}</Badge></div>
          </Card>
        </section>
      </div>
    </>
  )
}
