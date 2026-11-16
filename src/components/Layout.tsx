import { useEffect, useState, type ReactNode } from 'react'
import { FACTS, LOCALES, META, num, type Locale } from '../lib/i18n'
import { Link, href, useRouter } from '../lib/router'
import { Button, Icon, ICONS } from './ui'

export const LogoTile = ({ size = 'size-11' }: { size?: string }) => (
  <span className={`flex ${size} shrink-0 items-center justify-center rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-[#DDE2DD]`}>
    <img src="/brand-icon.png" alt="" className="size-full object-contain" />
  </span>
)

export const phoneDisplay = (l: Locale, p: string) => num(l, `${p.slice(0, 3)} ${p.slice(3, 7)} ${p.slice(7)}`)
export const mapUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(FACTS.mapQuery)

// Keeps <html lang/dir>, title, description and hreflang alternates in sync with the screen.
export function useHead(title: string, desc: string) {
  const { locale, path } = useRouter()
  useEffect(() => {
    const h = document.documentElement
    h.lang = META[locale].html
    h.dir = META[locale].dir
    document.title = title
    let m = document.querySelector<HTMLMetaElement>('meta[name=description]')
    if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.append(m) }
    m.content = desc
    document.querySelectorAll('link[data-alt]').forEach((n) => n.remove())
    for (const l of LOCALES) {
      const a = document.createElement('link')
      a.rel = 'alternate'; a.hreflang = l; a.href = location.origin + href(l, path); a.dataset.alt = '1'
      document.head.append(a)
    }
  }, [title, desc, locale, path])
}

function LangSwitch() {
  const { locale, path } = useRouter()
  const { t } = useRouter()
  return (
    <nav aria-label={t.language} className="flex flex-wrap gap-1">
      {LOCALES.map((l) => (
        <Link key={l} locale={l} to={path} lang={META[l].html} hrefLang={l} aria-current={l === locale ? 'true' : undefined} aria-label={META[l].name} title={META[l].name}
          className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg px-2.5 text-sm font-bold focus-visible:outline-3 focus-visible:outline-brand-700 ${l === locale ? 'bg-brand-700 text-white' : 'text-brand-900 hover:bg-brand-100'}`}>
          {l.toUpperCase()}
        </Link>
      ))}
    </nav>
  )
}

export function Layout({ children }: { children: ReactNode }) {
  const { t, locale, path } = useRouter()
  const [open, setOpen] = useState(false)
  useEffect(() => setOpen(false), [path, locale])
  const nav: [string, string][] = [['', t.nav.home], ['services', t.nav.services], ['how-it-works', t.nav.how], ['about', t.nav.about], ['blog', t.nav.blog], ['contact', t.nav.contact]]
  const active = (p: string) => (p === '' ? path === '' : path === p || path.startsWith(p + '/'))
  return (
    <div className="flex min-h-dvh flex-col pb-20 md:pb-0">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:start-2 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-white focus:p-3 focus:font-bold">{t.skip}</a>
      <header className="sticky top-0 z-40 border-b border-brand-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
          <Link to="" className="flex items-center gap-2.5" aria-label={t.brand}>
            <LogoTile />
            <span className="text-lg font-extrabold text-brand-900">{t.brand}</span>
          </Link>
          <nav className="mx-auto hidden items-center gap-1 lg:flex" aria-label="main">
            {nav.map(([p, l]) => (
              <Link key={p} to={p} aria-current={active(p) ? 'page' : undefined} className={`rounded-lg px-3 py-2 text-sm font-bold whitespace-nowrap ${active(p) ? 'bg-brand-100 text-brand-900' : 'text-[#2c4a49] hover:bg-brand-50'}`}>{l}</Link>
            ))}
          </nav>
          <div className="ms-auto hidden lg:block"><LangSwitch /></div>
          <Button size="sm" to="request" className="max-lg:hidden">{t.ctaRequest}</Button>
          <button onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? t.close : t.menu}
            className="ms-auto flex size-11 items-center justify-center rounded-xl text-brand-900 ring-1 ring-brand-200 focus-visible:outline-3 focus-visible:outline-brand-700 lg:hidden">
            <Icon d={open ? ICONS.close : ICONS.menu} className="size-6" />
          </button>
        </div>
        {open && (
          <div id="mobile-menu" className="border-t border-brand-100 bg-white px-4 pb-4 lg:hidden">
            <nav className="flex flex-col py-2" aria-label="main">
              {nav.map(([p, l]) => (
                <Link key={p} to={p} aria-current={active(p) ? 'page' : undefined} className={`flex min-h-12 items-center rounded-lg px-3 font-bold ${active(p) ? 'bg-brand-100 text-brand-900' : 'text-[#2c4a49]'}`}>{l}</Link>
              ))}
              <Link to="mahan" className="flex min-h-12 items-center rounded-lg px-3 font-bold text-[#8a4600]">{t.nav.offer}</Link>
            </nav>
            <LangSwitch />
          </div>
        )}
      </header>

      <main id="main" className="flex-1">{children}</main>

      <footer className="bg-brand-900 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5"><LogoTile /><span className="text-lg font-extrabold">{t.brand}</span></div>
            <p className="mt-3 text-sm leading-7 text-white/85">{t.footer.tag}</p>
            <p className="mt-3 text-sm leading-7 text-white/85">{t.footer.note}</p>
          </div>
          <div>
            <h2 className="font-extrabold">{t.footer.links}</h2>
            <ul className="mt-3 space-y-1">
              {[...nav, ['mahan', t.nav.offer], ['partners', t.partners.title], ['story', t.story.title], ['brand-resources', t.brandRes.title]].map(([p, l]) => (
                <li key={p}><Link to={p} className="inline-block py-1.5 text-sm text-white/90 hover:underline">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-extrabold">{t.footer.contact}</h2>
            <address className="mt-3 space-y-2 text-sm not-italic leading-7 text-white/90">
              <p className="flex gap-2"><Icon d={ICONS.pin} className="mt-1.5 size-4 shrink-0" /><a href={mapUrl} target="_blank" rel="noreferrer" className="hover:underline">{t.contactInfo.addressValue}</a></p>
              <p className="flex gap-2"><Icon d={ICONS.phone} className="mt-1.5 size-4 shrink-0" /><a dir="ltr" href={`tel:${FACTS.landline}`} className="hover:underline">{phoneDisplay(locale, FACTS.landline)}</a></p>
              <p className="flex gap-2"><Icon d={ICONS.phone} className="mt-1.5 size-4 shrink-0" /><a dir="ltr" href={`tel:${FACTS.mobile}`} className="hover:underline">{phoneDisplay(locale, FACTS.mobile)}</a></p>
              <p className="flex gap-2"><Icon d={ICONS.insta} className="mt-1.5 size-4 shrink-0" /><a dir="ltr" href={`https://instagram.com/${FACTS.instagram}`} target="_blank" rel="noreferrer" className="hover:underline">@{FACTS.instagram}</a></p>
              <p className="flex gap-2"><Icon d={ICONS.globe} className="mt-1.5 size-4 shrink-0" /><a dir="ltr" href={`https://${FACTS.website}`} target="_blank" rel="noreferrer" className="hover:underline">{FACTS.website}</a></p>
            </address>
          </div>
        </div>
      </footer>

      {/* Sticky mobile bar: teal call + orange request (request currently shows the paused state). */}
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-brand-100 bg-white p-2.5 md:hidden">
        <Button variant="secondary" href={`tel:${FACTS.landline}`}><Icon d={ICONS.phone} />{t.ctaCall}</Button>
        <Button to="request">{t.ctaRequest}</Button>
      </div>
    </div>
  )
}
