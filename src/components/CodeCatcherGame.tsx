import { useCallback, useEffect, useRef, useState } from 'react'
import type { IconType } from 'react-icons'
import { FaBrain } from 'react-icons/fa6'
import { SiDocker, SiFastapi, SiGit, SiGooglecloud, SiJavascript, SiKubernetes, SiNodedotjs, SiPostgresql, SiPython, SiReact, SiTypescript } from 'react-icons/si'

type ItemKind = 'tech' | 'innovation' | 'bug'
type FallingItem = { id: number; label: string; tech?: { name: string; icon: IconType; color: string }; kind: ItemKind; x: number; y: number }
type Feedback = { id: number; text: string; x: number; bad?: boolean }

const technologies: { name: string; icon: IconType; color: string }[] = [
  { name: 'React', icon: SiReact, color: '#149eca' }, { name: 'Python', icon: SiPython, color: '#3776ab' }, { name: 'JavaScript', icon: SiJavascript, color: '#d6a600' },
  { name: 'TypeScript', icon: SiTypescript, color: '#3178c6' }, { name: 'Docker', icon: SiDocker, color: '#2496ed' }, { name: 'Git', icon: SiGit, color: '#f05032' },
  { name: 'Node.js', icon: SiNodedotjs, color: '#5a9b48' }, { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169a1' }, { name: 'FastAPI', icon: SiFastapi, color: '#009688' },
  { name: 'Kubernetes', icon: SiKubernetes, color: '#326ce5' }, { name: 'Google Cloud', icon: SiGooglecloud, color: '#4285f4' }, { name: 'Artificial intelligence', icon: FaBrain, color: '#a97913' },
]
const bugs = ['BUG', 'ERROR', '404', 'NULL', '500', 'EXCEPTION']
const milestones: Record<number, string> = {
  100: 'Developer Mode Activated ⚡',
  250: 'Building Something Powerful...',
  500: 'ABCX Engineer Level 🚀',
  1000: 'Innovation Unlocked 🏆',
}

function readHighScore() {
  return Number(window.localStorage.getItem('abcx-code-catcher-high-score') || 0)
}

export function CodeCatcherGame({ onClose }: { onClose: () => void }) {
  const gameRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef(50)
  const heldKeys = useRef(new Set<string>())
  const itemsRef = useRef<FallingItem[]>([])
  const scoreRef = useRef(0)
  const livesRef = useRef(3)
  const elapsedRef = useRef(0)
  const spawnRef = useRef(0)
  const itemId = useRef(0)
  const previousRef = useRef(0)
  const milestonesReached = useRef(new Set<number>())
  const [items, setItems] = useState<FallingItem[]>([])
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [highScore, setHighScore] = useState(readHighScore)
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [milestone, setMilestone] = useState('')
  const [gameOver, setGameOver] = useState(false)
  const [shaking, setShaking] = useState(false)

  const restart = useCallback(() => {
    itemsRef.current = []; scoreRef.current = 0; livesRef.current = 3; elapsedRef.current = 0; spawnRef.current = 0
    playerRef.current = 50; itemId.current = 0; milestonesReached.current.clear()
    setItems([]); setScore(0); setLives(3); setFeedback([]); setMilestone(''); setGameOver(false); setShaking(false)
  }, [])

  const movePlayer = useCallback((clientX: number) => {
    const rect = gameRef.current?.getBoundingClientRect()
    if (!rect) return
    playerRef.current = Math.max(11, Math.min(89, ((clientX - rect.left) / rect.width) * 100))
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); heldKeys.current.add(event.key) }
    }
    const onKeyUp = (event: KeyboardEvent) => heldKeys.current.delete(event.key)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => { window.removeEventListener('keydown', onKeyDown); window.removeEventListener('keyup', onKeyUp) }
  }, [onClose])

  useEffect(() => {
    if (gameOver) return
    let frame = 0
    const tick = (now: number) => {
      const delta = Math.min((now - previousRef.current) / 1000 || 0, .045)
      previousRef.current = now
      elapsedRef.current += delta
      const rect = gameRef.current?.getBoundingClientRect()
      if (!rect) { frame = requestAnimationFrame(tick); return }
      const level = 1 + Math.min(2.3, elapsedRef.current / 38)
      const direction = (heldKeys.current.has('ArrowRight') ? 1 : 0) - (heldKeys.current.has('ArrowLeft') ? 1 : 0)
      if (direction) playerRef.current = Math.max(11, Math.min(89, playerRef.current + direction * delta * 62))
      spawnRef.current += delta
      const interval = Math.max(.48, 1.18 - elapsedRef.current / 105)
      if (spawnRef.current >= interval) {
        spawnRef.current = 0
        const roll = Math.random()
        const kind: ItemKind = roll < .18 ? 'bug' : roll < .25 ? 'innovation' : 'tech'
        const tech = kind === 'tech' ? technologies[Math.floor(Math.random() * technologies.length)] : undefined
        itemsRef.current.push({ id: itemId.current++, kind, x: 8 + Math.random() * 84, y: -38, tech, label: kind === 'bug' ? bugs[Math.floor(Math.random() * bugs.length)] : kind === 'innovation' ? '⚡ INNOVATION' : tech!.name })
      }
      const next: FallingItem[] = []
      for (const item of itemsRef.current) {
        item.y += delta * (92 + elapsedRef.current * 1.5) * level
        const caught = item.y >= rect.height - 76 && item.y <= rect.height - 46 && Math.abs(item.x - playerRef.current) < 14
        if (caught) {
          const feedbackId = Date.now() + item.id
          if (item.kind === 'bug') {
            livesRef.current -= 1; setLives(livesRef.current); setShaking(true); setTimeout(() => setShaking(false), 340)
            setFeedback(current => [...current, { id: feedbackId, text: 'BUG!', x: item.x, bad: true }])
          } else {
            const points = item.kind === 'innovation' ? 50 : 10
            scoreRef.current += points; setScore(scoreRef.current)
            if (scoreRef.current > highScore) { setHighScore(scoreRef.current); window.localStorage.setItem('abcx-code-catcher-high-score', String(scoreRef.current)) }
            setFeedback(current => [...current, { id: feedbackId, text: `+${points}`, x: item.x }])
            for (const [at, message] of Object.entries(milestones)) {
              const threshold = Number(at)
              if (scoreRef.current >= threshold && !milestonesReached.current.has(threshold)) { milestonesReached.current.add(threshold); setMilestone(message); setTimeout(() => setMilestone(''), 2600) }
            }
          }
          setTimeout(() => setFeedback(current => current.filter(note => note.id !== feedbackId)), 850)
          continue
        }
        if (item.y < rect.height + 45) next.push(item)
      }
      itemsRef.current = next
      setItems([...next])
      if (livesRef.current <= 0) { setGameOver(true); return }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [gameOver, highScore])

  return (
    <div className="game-overlay" role="dialog" aria-modal="true" aria-label="ABCX Code Catcher game">
      <section className="game-modal">
        <button className="game-close" onClick={onClose} aria-label="Close game">×</button>
        <header className="game-header"><p>ABCX CODE CATCHER</p><h2>Catch the technologies. Avoid the bugs.</h2></header>
        <div className="game-stats"><span>Score: <b>{score}</b></span><i /> <span>High Score: <b>{highScore}</b></span><i /> <span aria-label={`${lives} lives remaining`}>{Array.from({ length: 3 }, (_, index) => <b className={index < lives ? 'heart' : 'heart heart-empty'} key={index}>♥</b>)}</span></div>
        <div className="game-area" ref={gameRef} onPointerMove={event => movePlayer(event.clientX)} onPointerDown={event => movePlayer(event.clientX)}>
          <div className="game-grid" aria-hidden="true" />
          {milestone && <p className="milestone">{milestone}</p>}
          {items.map(item => {
            const TechnologyIcon = item.tech?.icon
            return <div key={item.id} className={`falling-item ${item.kind}`} style={{ left: `${item.x}%`, top: item.y, color: item.tech?.color }} title={item.label} aria-label={item.label}>{TechnologyIcon ? <TechnologyIcon aria-hidden="true" /> : item.label}</div>
          })}
          {feedback.map(note => <span key={note.id} className={`score-feedback ${note.bad ? 'bad' : ''}`} style={{ left: `${note.x}%` }}>{note.text}</span>)}
          <div className={`catcher ${shaking ? 'shaking' : ''}`} style={{ left: `${playerRef.current}%` }} aria-label="ABCX catcher">
            <img src="/abcx-logo-transparent.png" alt="" draggable="false" />
          </div>
          {gameOver && <div className="game-over"><p>GAME OVER</p><strong>Your Score: {score}</strong><span>High Score: {highScore}</span><em>Great products are built one line at a time.</em><div><button onClick={restart}>Play Again</button><button className="secondary" onClick={onClose}>Back to Coming Soon</button></div></div>}
        </div>
        <p className="game-controls"><kbd>←</kbd><kbd>→</kbd> Move your catcher <span>•</span> Drag or tap on mobile</p>
      </section>
    </div>
  )
}
