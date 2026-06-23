import { useState } from 'react'
import type { CategoryId } from './types'
import { useGame } from './hooks/useGame'
import { LandingPage } from './components/LandingPage'
import { CategorySelect } from './components/CategorySelect'
import { GameBoard } from './components/GameBoard'
import { WinScreen } from './components/WinScreen'

type Screen = 'landing' | 'category' | 'game' | 'win'

export default function App() {
  const { gameState, startGame, resetGame } = useGame()
  const [screen, setScreen] = useState<Screen>(() => {
    // Resume in-progress or completed game from localStorage on refresh
    if (gameState.status === 'playing') return 'game'
    if (gameState.status === 'won') return 'win'
    return 'landing'
  })

  const handleSelectCategory = (categoryId: CategoryId) => {
    startGame(categoryId)
    setScreen('game')
  }

  const handleWin = () => setScreen('win')

  const handlePlayAgain = () => {
    if (gameState.categoryId) {
      startGame(gameState.categoryId)
      setScreen('game')
    }
  }

  const handleReset = () => {
    resetGame()
    setScreen('landing')
  }

  if (screen === 'landing') {
    return <LandingPage onStart={() => setScreen('category')} />
  }

  if (screen === 'category') {
    return <CategorySelect onSelect={handleSelectCategory} onBack={() => setScreen('landing')} />
  }

  if (screen === 'game' && gameState.categoryId) {
    return (
      <GameBoard
        categoryId={gameState.categoryId}
        onWin={handleWin}
        onReset={handleReset}
      />
    )
  }

  if (screen === 'win' && gameState.categoryId) {
    return (
      <WinScreen
        gameState={gameState}
        categoryId={gameState.categoryId}
        onPlayAgain={handlePlayAgain}
        onReset={handleReset}
      />
    )
  }

  return <LandingPage onStart={() => setScreen('category')} />
}
