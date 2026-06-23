import { useCallback } from 'react'
import type { BingoCard, CategoryId, GameState, WinningLine } from '../types'
import { useLocalStorage } from './useLocalStorage'
import { generateCard } from '../lib/cardGenerator'
import { checkForBingo } from '../lib/bingoChecker'
import { detectWords } from '../lib/wordDetector'

const INITIAL_STATE: GameState = {
  status: 'idle',
  categoryId: null,
  card: null,
  winningLine: null,
  filledCount: 1,
  startedAt: null,
  completedAt: null,
}

function markWinningSquares(card: BingoCard, line: WinningLine): BingoCard {
  const winSet = new Set(line.squares.map(([r, c]) => `${r},${c}`))
  return card.map((row, ri) =>
    row.map((sq, ci) => (winSet.has(`${ri},${ci}`) ? { ...sq, isWinning: true } : sq)),
  )
}

export function useGame() {
  const [gameState, setGameState] = useLocalStorage<GameState>(
    'meeting-bingo-state',
    INITIAL_STATE,
  )

  const startGame = useCallback(
    (categoryId: CategoryId) => {
      const card = generateCard(categoryId)
      setGameState({
        status: 'playing',
        categoryId,
        card,
        winningLine: null,
        filledCount: 1, // FREE center pre-filled
        startedAt: Date.now(),
        completedAt: null,
      })
    },
    [setGameState],
  )

  const resetGame = useCallback(() => {
    setGameState(INITIAL_STATE)
  }, [setGameState])

  const newCard = useCallback(() => {
    setGameState(prev => {
      if (!prev.categoryId) return prev
      const card = generateCard(prev.categoryId)
      return {
        ...prev,
        card,
        winningLine: null,
        filledCount: 1,
        startedAt: Date.now(),
        completedAt: null,
        status: 'playing',
      }
    })
  }, [setGameState])

  const toggleSquare = useCallback(
    (row: number, col: number) => {
      setGameState(prev => {
        if (prev.status !== 'playing' || !prev.card) return prev
        const sq = prev.card[row][col]
        if (sq.isFree || sq.isAutoFilled) return prev

        const newCard = prev.card.map((r, ri) =>
          r.map((s, ci) =>
            ri === row && ci === col ? { ...s, isFilled: !s.isFilled } : s,
          ),
        )

        const filledCount = newCard.flat().filter(s => s.isFilled).length
        const winningLine = checkForBingo(newCard)

        return {
          ...prev,
          card: winningLine ? markWinningSquares(newCard, winningLine) : newCard,
          filledCount,
          winningLine,
          status: winningLine ? 'won' : 'playing',
          completedAt: winningLine ? Date.now() : null,
        }
      })
    },
    [setGameState],
  )

  // Returns the list of newly detected words (for toast notifications)
  const processTranscript = useCallback(
    (text: string): string[] => {
      let detected: string[] = []

      setGameState(prev => {
        if (prev.status !== 'playing' || !prev.card) return prev

        const unfilledWords = prev.card
          .flat()
          .filter(sq => !sq.isFilled && !sq.isFree)
          .map(sq => sq.word)

        detected = detectWords(text, unfilledWords)
        if (detected.length === 0) return prev

        let newCard = prev.card
        for (const word of detected) {
          for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
              if (newCard[r][c].word === word && !newCard[r][c].isFilled) {
                newCard = newCard.map((row, ri) =>
                  row.map((sq, ci) =>
                    ri === r && ci === c
                      ? { ...sq, isFilled: true, isAutoFilled: true }
                      : sq,
                  ),
                )
              }
            }
          }
        }

        const filledCount = newCard.flat().filter(s => s.isFilled).length
        const winningLine = checkForBingo(newCard)

        return {
          ...prev,
          card: winningLine ? markWinningSquares(newCard, winningLine) : newCard,
          filledCount,
          winningLine,
          status: winningLine ? 'won' : 'playing',
          completedAt: winningLine ? Date.now() : null,
        }
      })

      return detected
    },
    [setGameState],
  )

  return { gameState, startGame, resetGame, newCard, toggleSquare, processTranscript }
}
