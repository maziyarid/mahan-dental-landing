import { RouterProvider, useRouter } from './lib/router'
import { Layout } from './components/Layout'
import Home from './pages/Home'
import ErrorPage from './pages/Errors'
import DesignSystem from './pages/DesignSystem'
import MahanOffer from './pages/MahanOffer'
import { About, Article, Blog, BrandResources, CmsPage, Contact, How, MarketingPage, Partners, RequestPaused, ServiceDetail, Services, StaticPage, Story } from './pages/Public'
import { useEffect } from 'react'
import { META } from './lib/i18n'

function Routes() {
  const { path, locale } = useRouter()
  const seg = path.split('/')
  // The Mahan offer keeps its own full-page layout (Persian only until M2).
  useEffect(() => {
    if (seg[0] === 'mahan') { document.documentElement.lang = 'fa'; document.documentElement.dir = 'rtl'; document.title = 'پیشنهاد ویژه ایمپلنت | کلینیک ماهان' }
  }, [seg[0]])
  if (seg[0] === 'mahan') return <MahanOffer />
  const errCode = seg[0] === 'error' ? Number(seg[1]) : 0
  let page
  switch (seg[0]) {
    case '': page = <Home />; break
    case 'services': page = seg[1] ? <ServiceDetail slug={seg[1]} /> : <Services />; break
    case 'how-it-works': page = <How />; break
    case 'about': page = <About />; break
    case 'contact': page = <Contact />; break
    case 'blog': page = seg[1] ? <Article /> : <Blog />; break
    case 'partners': page = <Partners />; break
    case 'brand-resources': page = <BrandResources />; break
    case 'story': page = <Story />; break
    case 'static-page': page = <StaticPage />; break
    case 'marketing-page': page = <MarketingPage />; break
    case 'page': page = <CmsPage slug={seg[1] ?? ''} />; break
    case 'request': page = <RequestPaused />; break
    case 'design-system': page = <DesignSystem />; break
    case 'error': page = <ErrorPage code={[403, 404, 419, 422, 429, 500, 503].includes(errCode) ? errCode : 404} />; break
    default: page = <ErrorPage code={404} />
  }
  return <Layout key={META[locale].dir}>{page}</Layout>
}

export default function App() {
  return <RouterProvider><Routes /></RouterProvider>
}
