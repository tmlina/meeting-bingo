import { useCallback, useEffect, useState } from 'react'
import type { CategoryId, Toast } from '../types'
import { useGame } from '../hooks/useGame'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { getOneAwayLines } from '../lib/bingoChecker'
import { categories } from '../data/categories'
import { BingoCard } from './BingoCard'
import { TranscriptPanel } from './TranscriptPanel'
import { GameControls } from './GameControls'
import { ToastContainer } from './ui/Toast'

interface GameBoardProps {
  categoryId: CategoryId
  onWin: () => void
  onReset: () => void
}

let toastIdCounter = 0

export function GameBoard({ categoryId, onWin, onReset }: GameBoardProps) {
  const { gameState, toggleSquare, processTranscript, newCard, resetGame } = useGame()
  const [toasts, setToasts] = useState<Toast[]>([])

  const handleFinalTranscript = useCallback(
    (text: string) => {
      const detected = processTranscript(text)
      if (detected.length === 0) return
      // M11: cap concurrent toasts to 3 to avoid stacking storms
      setToasts(prev => [
        ...prev.slice(-2),
        ...detected.map(word => ({ id: String(++toastIdCounter), word })),
      ].slice(-3))
    },
    [processTranscript],
  )

  const { isListening, isSupported, transcript, interimTranscript, error, startListening, stopListening } =
    useSpeechRecognition(handleFinalTranscript)

  // Transition to win screen via effect, not during render
  useEffect(() => {
    if (gameState.status === 'won') {
      stopListening()
      onWin()
    }
  }, [gameState.status, stopListening, onWin])

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const handleStartStop = useCallback(() => {
    if (isListening) stopListening()
    else startListening()
  }, [isListening, startListening, stopListening])

  const handleReset = useCallback(() => {
    stopListening()
    resetGame()
    onReset()
  }, [stopListening, resetGame, onReset])

  const handleNewCard = useCallback(() => {
    stopListening()
    newCard()
  }, [stopListening, newCard])

  if (!gameState.card) return null

  const cat = categories.find(c => c.id === categoryId)
  const oneAwaySquares = getOneAwayLines(gameState.card)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">{cat?.icon}</span>
          <span className="font-semibold text-gray-800">{cat?.name}</span>
        </div>
        <span className="text-sm text-gray-500 tabular-nums">
          {gameState.filledCount} / 25
        </span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start p-4 gap-4 max-w-sm mx-auto w-full">
        <BingoCard
          card={gameState.card}
          oneAwaySquares={oneAwaySquares}
          onToggle={toggleSquare}
        />
        <div className="w-full space-y-3">
          <TranscriptPanel
            isListening={isListening}
            isSupported={isSupported}
            transcript={transcript}
            interimTranscript={interimTranscript}
            error={error}
          />
          <GameControls
            isListening={isListening}
            isSupported={isSupported}
            filledCount={gameState.filledCount}
            onStartStop={handleStartStop}
            onNewCard={handleNewCard}
            onReset={handleReset}
          />
        </div>
      </main>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
