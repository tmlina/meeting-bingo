import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import type { CategoryId, GameState } from '../types'
import { categories } from '../data/categories'
import { formatTime } from '../lib/utils'
import { buildShareText, shareResult } from '../lib/shareUtils'
import { BingoCard } from './BingoCard'
import { Button } from './ui/Button'

interface WinScreenProps {
  gameState: GameState
  categoryId: CategoryId
  onPlayAgain: () => void
  onReset: () => void
}

export function WinScreen({ gameState, categoryId, onPlayAgain, onReset }: WinScreenProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  // C9: move focus to heading on mount so keyboard/SR users aren't stranded
  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  // H12: gate confetti on prefers-reduced-motion
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const end = Date.now() + 2500
    const frame = () => {
      confetti({ particleCount: 6, spread: 80, origin: { y: 0.6 }, angle: 60 })
      confetti({ particleCount: 6, spread: 80, origin: { y: 0.6 }, angle: 120 })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [])

  const cat = categories.find(c => c.id === categoryId)
  const elapsed =
    gameState.startedAt && gameState.completedAt
      ? gameState.completedAt - gameState.startedAt
      : null

  const handleShare = async () => {
    const text = buildShareText(categoryId, elapsed)
    const result = await shareResult(text)
    if (result === 'copied') alert('Copied to clipboard!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-sm w-full space-y-6 text-center">
        {/* C9: tabIndex so programmatic focus works on a non-interactive element */}
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-5xl font-extrabold text-green-700 tracking-tight focus-visible:outline-none animate-[bounceIn_0.5s_ease-out]"
        >
          BINGO! 🎉
        </h1>

        {/* Stats */}
        <div className="flex justify-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800 tabular-nums">
              {elapsed != null ? formatTime(elapsed) : '—'}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wide mt-0.5">
              Time to Bingo
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{cat?.icon}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide mt-0.5">
              {cat?.name}
            </div>
          </div>
        </div>

        {/* Winning card */}
        {gameState.card && (
          <BingoCard
            card={gameState.card}
            oneAwaySquares={new Set()}
            onToggle={() => {}}
          />
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button size="lg" onClick={handleShare} className="w-full">
            Share Result 📤
          </Button>
          <Button size="lg" variant="secondary" onClick={onPlayAgain} className="w-full">
            Play Again
          </Button>
          <Button variant="ghost" size="sm" onClick={onReset} className="w-full">
            Change Category
          </Button>
        </div>
      </div>
    </div>
  )
}
