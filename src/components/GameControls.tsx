import { Button } from './ui/Button'

interface GameControlsProps {
  isListening: boolean
  isSupported: boolean
  filledCount: number
  onStartStop: () => void
  onNewCard: () => void
  onReset: () => void
}

export function GameControls({
  isListening,
  isSupported,
  filledCount,
  onStartStop,
  onNewCard,
  onReset,
}: GameControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        {isSupported && (
          <Button
            variant={isListening ? 'secondary' : 'primary'}
            onClick={onStartStop}
            aria-pressed={isListening}
          >
            {isListening ? '⏹ Stop Listening' : '🎤 Start Listening'}
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={onNewCard}>
          New Card
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500 tabular-nums">
          {filledCount} / 25
        </span>
        <Button variant="ghost" size="sm" onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  )
}
