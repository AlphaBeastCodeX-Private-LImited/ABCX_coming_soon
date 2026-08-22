import { lazy, Suspense, useEffect, useState } from 'react'
import { Footer } from './Footer'
import { Logo } from './Logo'

const CodeCatcherGame = lazy(() => import('./CodeCatcherGame').then(({ CodeCatcherGame }) => ({ default: CodeCatcherGame })))

export function ComingSoonPage() {
  const [gameOpen, setGameOpen] = useState(false)
  const [visitorIp, setVisitorIp] = useState<string | null>(null)

  useEffect(() => {
    fetch('/.netlify/functions/ip')
      .then((response) => response.ok ? response.json() : Promise.reject(response))
      .then(({ ip }: { ip: string | null }) => setVisitorIp(ip))
      .catch(() => setVisitorIp(null))
  }, [])

  return (
    <main className="coming-soon">
      <div className="ambient ambient-gold" aria-hidden="true" />
      <div className="ambient ambient-slate" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <header className="brand">
        <Logo className="logo" />
      </header>

      <section className="announcement" aria-labelledby="coming-soon-heading">
        <div className="eyebrow" aria-hidden="true"><span /> Digital experience <span /></div>
        <h1 id="coming-soon-heading">Coming Soon!</h1>
        <p className="mission">Building Intelligent Solutions for Tomorrow.</p>
        <p className="supporting">Something powerful is taking shape. Stay close — the reveal is on its way.</p>
        {visitorIp && <p className="visitor-ip">Your IP address: <code>{visitorIp}</code></p>}
        <div className="game-invite"><span>While you wait, play a quick game.</span><button onClick={() => setGameOpen(true)}>🎮 <b>Play Code Catcher</b></button></div>
      </section>

      <Footer />
      {gameOpen && <Suspense fallback={<div className="game-overlay" role="status" aria-label="Loading Code Catcher" />}><CodeCatcherGame onClose={() => setGameOpen(false)} /></Suspense>}
    </main>
  )
}
