import { useRouter } from '../lib/router'
import { Button, Icon, ICONS } from '../components/ui'
import { useHead } from '../components/Layout'
import { FACTS, num } from '../lib/i18n'

export default function ErrorPage({ code }: { code: number }) {
  const { t, locale } = useRouter()
  const e = (t.errors as unknown as Record<number, string[]>)[code] ?? t.errors[404]
  useHead(`${e[0]} | ${t.brand}`, e[1])
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-16 text-center md:py-24">
      <p aria-label={t.errors.code} className="text-7xl font-black text-brand-700 tabular-nums" dir="ltr">{num(locale, code)}</p>
      <h1 className="mt-4 text-3xl font-black text-brand-900">{e[0]}</h1>
      <p className="mt-3 text-lg leading-8 text-[#2c4a49]">{e[1]}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button to="">{t.errors.home}</Button>
        {(code === 500 || code === 503 || code === 429 || code === 419 || code === 422) && <Button variant="ghost" onClick={() => location.reload()}>{t.errors.retry}</Button>}
        <Button variant="ghost" href={`tel:${FACTS.landline}`}><Icon d={ICONS.phone} />{t.errors.contact}</Button>
      </div>
    </section>
  )
}
