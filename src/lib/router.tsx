import { createContext, useCallback, useContext, useEffect, useMemo, useState, type AnchorHTMLAttributes, type ReactNode } from 'react'
import { DICTS, LOCALES, META, type Dict, type Locale } from './i18n'

// Minimal History API router. Paths look like /{locale}/{route}.
type Ctx = { locale: Locale; path: string; search: URLSearchParams; t: Dict; navigate: (to: string) => void }
const RouterCtx = createContext<Ctx>(null as unknown as Ctx)

function parse(): { locale: Locale; path: string; search: string } {
  const [first, ...rest] = location.pathname.split('/').filter(Boolean)
  const locale = (LOCALES as string[]).includes(first) ? (first as Locale) : 'fa'
  return { locale, path: (LOCALES as string[]).includes(first) ? rest.join('/') : [first, ...rest].filter(Boolean).join('/'), search: location.search }
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(parse)
  useEffect(() => {
    const on = () => setState(parse())
    addEventListener('popstate', on)
    return () => removeEventListener('popstate', on)
  }, [])
  // Bare "/" goes to the Persian home.
  useEffect(() => {
    const first = location.pathname.split('/').filter(Boolean)[0]
    if (!(LOCALES as string[]).includes(first)) history.replaceState(null, '', `/fa/${state.path}${location.search}`)
  }, [state.path])
  const navigate = useCallback((to: string) => {
    history.pushState(null, '', to)
    setState(parse())
    scrollTo(0, 0)
  }, [])
  const value = useMemo(() => ({ locale: state.locale, path: state.path, search: new URLSearchParams(state.search), t: DICTS[state.locale], navigate }), [state, navigate])
  return <RouterCtx.Provider value={value}>{children}</RouterCtx.Provider>
}

export const useRouter = () => useContext(RouterCtx)
export const href = (locale: Locale, path = '') => `/${locale}${path ? '/' + path : ''}`

export function Link({ to, locale, onClick, ...rest }: { to: string; locale?: Locale } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const r = useRouter()
  const url = href(locale ?? r.locale, to)
  return (
    <a
      {...rest}
      href={url}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        r.navigate(url)
      }}
    />
  )
}

export { META }
