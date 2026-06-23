import type { KeyboardEvent } from 'react'
import { cn } from '../lib/utils'
import type { BingoSquare as BingoSquareType } from '../types'

interface BingoSquareProps {
  square: BingoSquareType
  row: number
  col: number
  isOneAway: boolean
  onToggle: (row: number, col: number) => void
  tabIndex: number
  onKeyDown: (e: KeyboardEvent, row: number, col: number) => void
}

export function BingoSquare({
  square,
  row,
  col,
  isOneAway,
  onToggle,
  tabIndex,
  onKeyDown,
}: BingoSquareProps) {
  const { word, isFilled, isFree, isWinning, isAutoFilled } = square

  const label = isFree
    ? 'Free space, filled'
    : `${word}${isFilled ? ', filled' : ''}${isOneAway ? ', one away from bingo' : ''}`

  return (
    <button
      role="gridcell"
      aria-label={label}
      aria-pressed={isFilled}
      tabIndex={tabIndex}
      onClick={() => onToggle(row, col)}
      onKeyDown={e => onKeyDown(e, row, col)}
      disabled={isFree}
      className={cn(
        'relative flex items-center justify-center text-center p-1 rounded-md text-xs font-medium leading-tight select-none transition-all duration-150 w-full aspect-square',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-500',
        isWinning && 'bg-green-500 text-white ring-2 ring-green-300 shadow-md scale-105',
        isFree && !isWinning && 'bg-amber-400 text-amber-900 cursor-default',
        isFilled && !isFree && !isWinning && isAutoFilled && 'bg-blue-500 text-white ring-1 ring-blue-300',
        isFilled && !isFree && !isWinning && !isAutoFilled && 'bg-blue-600 text-white',
        !isFilled && !isWinning && 'bg-white border border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300 cursor-pointer',
        isOneAway && !isFilled && 'ring-2 ring-indigo-400',
      )}
    >
      {/* C7: mic icon distinguishes auto-filled from manual */}
      {isAutoFilled && isFilled && !isWinning && (
        <span className="absolute top-0.5 right-0.5 text-[8px] opacity-60" aria-hidden="true">
          🎤
        </span>
      )}
      {isFree ? (
        <span className="text-lg" aria-hidden="true">★</span>
      ) : (
        <span className="block">{word}</span>
      )}
    </button>
  )
}
