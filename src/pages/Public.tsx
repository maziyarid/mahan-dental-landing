import type { ReactNode } from 'react'
import { Link, useRouter } from '../lib/router'
import { Badge, Breadcrumbs, Button, Card, Icon, ICONS, PausedNotice, Placeholder, Skeleton, Notice } from '../components/ui'
import { mapUrl, phoneDisplay, useHead, LogoTile } from '../components/Layout'
import { AddressCard } from './Home'
import { FACTS } from '../lib/i18n'
import { num } from '../lib/i18n'

export function PageShell({ title, desc, lead, crumbs, children, wide = false }: { title: string; desc: string; lead?: string; crumbs?: { label: string; to?: string }[]; children?: ReactNode; wide?: boolean }) {
  useHead(`${title} | ${useRouter().t.brand}`, desc)
  return (
    <>
      <section className="border-b border-brand-100 bg-brand-50">
        <div className={`mx-auto px-4 py-8 md:py-12 ${wide ? 'max-w-6xl' : 'max-w-6xl'}`}>
          <Breadcrumbs items={[...(crumbs ?? []), { label: title }]} />
          <h1 className="mt-4 text-3xl font-black text-brand-900 md:text-4xl">{title}</h1>
          {lead && <p className="mt-3 max-w-2xl text-lg leading-8 text-[#2c4a49]">{lead}</p>}
        </div>
      </section>
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">{children}</div>
    </>
  )
}

export function Services() {
  const { t } = useRouter()
  return (
    <PageShell title={t.services.title} desc={t.services.desc} lead={t.services.lead}>
      <ul className="grid gap-4 sm:grid-cols-2">
        {t.services.items.map((s) => (
          <li key={s.slug}><Link to={`services/${s.slug}`} className="flex h-full items-center gap-4 rounded-2xl border border-brand-100 bg-white p-5 shadow-[0_2px_14px_rgba(0,64,63,.06)] hover:border-brand-500 focus-visible:outline-3 focus-visible:outline-brand-700">
            <Icon d={ICONS.tooth} className="size-10 shrink-0 text-brand-700" />
            <span className="flex-1"><span className="block text-lg font-extrabold text-brand-900">{s.t}</span><span className="text-[#3d5a59]">{s.s}</span></span>
            <Icon d={ICONS.next} flip className="size-5 text-brand-700" />
          </Link></li>
        ))}
      </ul>
    </PageShell>
  )
}

export function ServiceDetail({ slug }: { slug: string }) {
  const { t } = useRouter()
  const s = t.services.items.find((i) => i.slug === slug)
  if (!s) return <PageShell title={t.errors[404][0]} desc={t.errors[404][1]} crumbs={[{ label: t.services.title, to: 'services' }]}><Notice tone="danger" title={t.services.notFound} action={<Button size="sm" to="services">{t.services.title}</Button>} /></PageShell>
  return (
    <PageShell title={s.t} desc={s.s} lead={s.s} crumbs={[{ label: t.services.title, to: 'services' }]}>
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          <Placeholder>{t.placeholder}</Placeholder>
          <Placeholder>{t.placeholder}</Placeholder>
        </div>
        <Card className="h-fit">
          <h2 className="text-lg font-extrabold text-brand-900">{t.services.detailBook}</h2>
          <p className="mt-2 leading-8 text-[#2c4a49]">{t.services.detailBody}</p>
          <div className="mt-4 flex flex-col gap-2"><Button to="contact">{t.nav.contact}</Button><Button variant="ghost" href={`tel:${FACTS.landline}`}><Icon d={ICONS.phone} />{t.ctaCall}</Button></div>
        </Card>
      </div>
      <section><h2 className="mb-3 text-xl font-extrabold text-brand-900">{t.services.related}</h2>
        <div className="flex flex-wrap gap-2">{t.services.items.filter((i) => i.slug !== slug).map((i) => <Button key={i.slug} variant="ghost" size="sm" to={`services/${i.slug}`}>{i.t}</Button>)}</div></section>
    </PageShell>
  )
}

export function How() {
  const { t, locale } = useRouter()
  return (
    <PageShell title={t.how.title} desc={t.how.desc} lead={t.how.lead}>
      <ol className="grid gap-4 md:grid-cols-2">
        {t.how.steps.map((s, i) => (
          <li key={i}><Card className="flex h-full gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-700 text-xl font-extrabold text-white">{num(locale, i + 1)}</span>
            <div><h2 className="text-lg font-extrabold text-brand-900">{s.t}</h2><p className="mt-1 leading-8 text-[#2c4a49]">{s.b}</p></div>
          </Card></li>
        ))}
      </ol>
      <PausedNotice />
    </PageShell>
  )
}

export function About() {
  const { t } = useRouter()
  return <PageShell title={t.about.title} desc={t.about.desc} lead={t.about.lead}><Placeholder>{t.about.body}</Placeholder></PageShell>
}
export function Story() {
  const { t } = useRouter()
  return <PageShell title={t.story.title} desc={t.story.desc} lead={t.story.lead}><Placeholder>{t.story.body}</Placeholder></PageShell>
}

export function Contact() {
  const { t, locale } = useRouter()
  const c = t.contactInfo
  const rows: [string, string, string, string?][] = [
    [c.landline, phoneDisplay(locale, FACTS.landline), `tel:${FACTS.landline}`, ICONS.phone],
    [c.mobile, phoneDisplay(locale, FACTS.mobile), `tel:${FACTS.mobile}`, ICONS.phone],
    [c.instagram, '@' + FACTS.instagram, `https://instagram.com/${FACTS.instagram}`, ICONS.insta],
    [c.website, FACTS.website, `https://${FACTS.website}`, ICONS.globe],
  ]
  return (
    <PageShell title={t.contact.title} desc={t.contact.desc} lead={t.contact.lead}>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <AddressCard />
          <Card>
            <h2 className="text-lg font-extrabold text-brand-900">{t.contact.channels}</h2>
            <ul className="mt-3 divide-y divide-brand-100">
              {rows.map(([l, v, h, ic]) => (
                <li key={l}><a href={h} className="flex min-h-12 items-center gap-3 py-2 hover:underline"><Icon d={ic!} className="size-5 text-brand-700" /><span className="flex-1 text-[#3d5a59]">{l}</span><span dir="ltr" className="font-bold text-brand-900">{v}</span></a></li>
              ))}
            </ul>
          </Card>
          <Placeholder>{t.contact.hours}</Placeholder>
        </div>
        <Card className="flex min-h-72 flex-col items-center justify-center gap-4 bg-brand-50 text-center">
          <Icon d={ICONS.pin} className="size-12 text-brand-700" />
          <p className="max-w-xs font-bold leading-8 text-brand-900">{c.addressValue}</p>
          <Button href={mapUrl}>{c.map}</Button>
        </Card>
      </div>
      <PausedNotice compact />
    </PageShell>
  )
}

export function Partners() {
  const { t } = useRouter()
  return <PageShell title={t.partners.title} desc={t.partners.desc} lead={t.partners.lead}>
    <Card className="py-10 text-center"><p className="font-bold text-brand-900">{t.partners.empty}</p><div className="mt-4"><Button variant="ghost" to="contact">{t.nav.contact}</Button></div></Card>
  </PageShell>
}

export function BrandResources() {
  const { t } = useRouter()
  const b = t.brandRes
  const colors: [string, string][] = [['#006D6B', 'Teal'], ['#004F4D', 'Dark teal'], ['#0A8F8C', 'Teal 500'], ['#FF8A1C', 'Orange'], ['#D96F00', 'Orange dark'], ['#00403F', 'Footer'], ['#EEF8F7', 'Mint'], ['#12302F', 'Text']]
  return (
    <PageShell title={b.title} desc={b.desc} lead={b.lead}>
      <Card className="flex flex-col items-center gap-3 py-8"><LogoTile size="size-24" /><p className="font-extrabold text-brand-900">{t.brand}</p><p className="text-sm text-[#3d5a59]">{b.logoNote}</p></Card>
      <section><h2 className="mb-3 text-xl font-extrabold text-brand-900">{b.colors}</h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {colors.map(([hex, n]) => (
            <li key={hex} className="overflow-hidden rounded-xl border border-brand-100 bg-white"><div className="h-16" style={{ background: hex }} /><div className="p-3"><p className="text-sm font-bold text-brand-900">{n}</p><p dir="ltr" className="text-start text-sm text-[#3d5a59]">{hex}</p></div></li>
          ))}
        </ul></section>
      <section><h2 className="mb-3 text-xl font-extrabold text-brand-900">{b.rules}</h2>
        <ul className="space-y-2">{b.rulesList.map((r) => <li key={r} className="flex gap-2 leading-8"><Icon d={ICONS.check} className="mt-2 size-5 shrink-0 text-brand-700" />{r}</li>)}</ul></section>
    </PageShell>
  )
}

export function StaticPage() {
  const { t } = useRouter()
  return <PageShell title={t.staticPage.title} desc={t.staticPage.desc} lead={t.staticPage.lead}>
    {t.staticPage.sections.map((s) => <section key={s}><h2 className="mb-2 text-xl font-extrabold text-brand-900">{s}</h2><Placeholder>{t.placeholderGeneric}</Placeholder></section>)}
  </PageShell>
}

export function MarketingPage() {
  const { t } = useRouter()
  return <PageShell title={t.marketing.title} desc={t.marketing.desc} lead={t.marketing.lead}>
    <Placeholder>{t.placeholderGeneric}</Placeholder>
    <div className="flex flex-wrap gap-3"><Button href={`tel:${FACTS.landline}`}><Icon d={ICONS.phone} />{t.marketing.cta}</Button><Button variant="ghost" to="">{t.homeLabel}</Button></div>
  </PageShell>
}

export function CmsPage({ slug }: { slug: string }) {
  const { t } = useRouter()
  return <PageShell title={t.cms.title} desc={t.cms.desc} lead={t.cms.lead}><Badge tone="accent">/{slug}</Badge><Placeholder>{t.placeholderGeneric}</Placeholder></PageShell>
}

export function RequestPaused() {
  const { t } = useRouter()
  return <PageShell title={t.request.title} desc={t.request.desc} lead={t.request.lead}><PausedNotice /><AddressCard /></PageShell>
}

export function Blog() {
  const { t, search } = useRouter()
  const state = search.get('state') ?? 'empty'
  const b = t.blog
  return (
    <PageShell title={b.title} desc={b.desc} lead={b.lead}>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="font-bold">{b.states}:</span>
        {(['loading', 'empty', 'error'] as const).map((s) => <Link key={s} to={`blog?state=${s}`} aria-current={state === s ? 'true' : undefined} className={`inline-flex min-h-11 items-center rounded-lg px-3 font-bold ${state === s ? 'bg-brand-700 text-white' : 'ring-1 ring-brand-200'}`}>{b.stateLabels[s]}</Link>)}
      </div>
      {state === 'loading' && (
        <div role="status" aria-label={b.loading} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => <Card key={i} className="space-y-3"><Skeleton className="h-36" /><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-full" /></Card>)}
        </div>
      )}
      {state === 'error' && <Notice tone="danger" title={b.error} action={<Button size="sm" variant="danger" to="blog?state=loading">{b.retry}</Button>} />}
      {state === 'empty' && <Card className="py-10 text-center"><p className="font-bold text-brand-900">{b.empty}</p><div className="mt-4"><Button variant="ghost" to="blog/article-template">{b.emptyAction}</Button></div></Card>}
    </PageShell>
  )
}

export function Article() {
  const { t } = useRouter()
  const a = t.blog.article
  return (
    <PageShell title={a.title} desc={t.blog.desc} crumbs={[{ label: t.blog.title, to: 'blog' }]}>
      <article className="mx-auto max-w-3xl space-y-8">
        <p className="text-sm text-[#3d5a59]">{a.byline}</p>
        <Placeholder>{t.placeholder}</Placeholder>
        {[1, 2].map((i) => (
          <section key={i} className="space-y-4">
            <h2 className="text-2xl font-extrabold text-brand-900">{a.section} {num(useRouter().locale, i)}</h2>
            <Placeholder>{t.placeholder}</Placeholder>
            <div className="flex min-h-40 items-center justify-center rounded-2xl border-2 border-dashed border-amber-600 bg-amber-50 p-4 text-center font-semibold text-amber-900">{a.info}</div>
          </section>
        ))}
        <section aria-labelledby="refs"><h2 id="refs" className="text-xl font-extrabold text-brand-900">{a.refs}</h2><p className="mt-2 text-[#2c4a49]">{a.refsNote}</p></section>
      </article>
    </PageShell>
  )
}
