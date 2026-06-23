import { useState, useCallback } from 'react'
import type { KeyboardEvent } from 'react'
import type { BingoCard as BingoCardType } from '../types'
import { BingoSquare } from './BingoSquare'

const HEADERS = ['B', 'I', 'N', 'G', 'O']

interface BingoCardProps {
  card: BingoCardType
  oneAwaySquares: Set<string>
  onToggle: (row: number, col: number) => void
}

export function BingoCard({ card, oneAwaySquares, onToggle }: BingoCardProps) {
  // C8: roving tabindex — track which cell owns tabIndex=0
  const [focusedCell, setFocusedCell] = useState<[number, number]>([0, 0])

  const moveFocus = useCallback((row: number, col: number) => {
    setFocusedCell([row, col])
    const cell = document.querySelector<HTMLElement>(`[data-cell="${row}-${col}"] button`)
    cell?.focus()
  }, [])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent, row: number, col: number) => {
      const moves: Record<string, [number, number]> = {
        ArrowUp: [row - 1, col],
        ArrowDown: [row + 1, col],
        ArrowLeft: [row, col - 1],
        ArrowRight: [row, col + 1],
      }
      const next = moves[e.key]
      if (!next) return
      const [nr, nc] = next
      if (nr < 0 || nr > 4 || nc < 0 || nc > 4) return
      e.preventDefault()
      moveFocus(nr, nc)
    },
    [moveFocus],
  )

  return (
    <div role="grid" aria-label="Bingo card" className="w-full max-w-sm mx-auto select-none">
      <div className="grid grid-cols-5 gap-1 mb-1" role="row">
        {HEADERS.map(h => (
          <div
            key={h}
            role="columnheader"
            className="flex items-center justify-center h-8 text-lg font-bold text-blue-700"
          >
            {h}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-1">
        {card.map((row, ri) =>
          row.map((sq, ci) => (
            <div key={`${ri}-${ci}`} data-cell={`${ri}-${ci}`}>
              <BingoSquare
                square={sq}
                row={ri}
                col={ci}
                isOneAway={oneAwaySquares.has(`${ri},${ci}`)}
                onToggle={onToggle}
                tabIndex={focusedCell[0] === ri && focusedCell[1] === ci ? 0 : -1}
                onKeyDown={handleKeyDown}
              />
            </div>
          )),
        )}
      </div>
    </div>
  )
}
