import { useState } from 'react'
import { useRouter } from '../lib/router'
import { Accordion, Badge, Button, Card, Countdown, Field, Notice, Skeleton, Stat } from '../components/ui'
import { PageShell } from './Public'
import { num } from '../lib/i18n'

export default function DesignSystem() {
  const { t, locale } = useRouter()
  const d = t.ds
  const [v, setV] = useState('')
  const [touched, setTouched] = useState(false)
  return (
    <PageShell title={d.title} desc={d.desc} lead={d.lead}>
      <section className="space-y-3"><h2 className="text-xl font-extrabold text-brand-900">{d.buttons}</h2>
        <div className="flex flex-wrap gap-3">
          <Button>{d.primary}</Button><Button variant="secondary">{d.secondary}</Button><Button variant="ghost">{d.ghost}</Button><Button variant="danger">{d.danger}</Button>
          <Button disabled>{d.disabled}</Button><Button loading>{d.loading}</Button><Button size="sm">sm</Button><Button size="lg">lg</Button>
        </div></section>
      <section className="space-y-3"><h2 className="text-xl font-extrabold text-brand-900">{d.fields}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={d.label} hint={d.hint} value={v} onChange={(e) => setV(e.target.value)} onBlur={() => setTouched(true)} error={touched && !v ? d.error : undefined} />
          <Field label={d.label} defaultValue="—" disabled />
        </div></section>
      <section className="space-y-3"><h2 className="text-xl font-extrabold text-brand-900">{d.badges}</h2>
        <div className="flex flex-wrap gap-2"><Badge>brand</Badge><Badge tone="accent">accent</Badge><Badge tone="warn">warn</Badge><Badge tone="danger">danger</Badge></div>
        <div className="grid grid-cols-3 gap-4"><Card><Stat value={num(locale, 200)} label="Stat" /></Card></div></section>
      <section className="space-y-3"><h2 className="text-xl font-extrabold text-brand-900">{d.states}</h2>
        <Notice title={t.paused.title}>{t.paused.body}</Notice>
        <Notice tone="danger" title={d.error} />
        <div dir="ltr" className="w-fit"><Countdown /></div>
        <div className="space-y-2" role="status" aria-label={d.skeleton}><Skeleton className="h-5 w-1/2" /><Skeleton className="h-5 w-full" /></div></section>
      <section className="space-y-3"><h2 className="text-xl font-extrabold text-brand-900">{d.faq}</h2><Accordion items={[{ q: d.q, a: d.a }, { q: d.q, a: d.a }]} /></section>
    </PageShell>
  )
}
