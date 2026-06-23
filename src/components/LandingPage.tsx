import { Button } from './ui/Button'

interface LandingPageProps {
  onStart: () => void
}

const HOW_IT_WORKS = [
  { icon: '🎯', text: 'Pick a category that matches your meeting' },
  { icon: '🎤', text: 'Hit "Start Listening" and let the mic run in the background' },
  { icon: '✅', text: 'Squares fill automatically when buzzwords are detected' },
  { icon: '🎉', text: 'Get five in a row — BINGO!' },
]

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Hero */}
        <div className="space-y-3">
          <div className="text-6xl" aria-hidden="true">🎱</div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Meeting Bingo
          </h1>
          <p className="text-lg text-gray-600">
            Turn corporate buzzwords into a game. Auto-detects speech in real time.
          </p>
        </div>

        {/* CTA */}
        <Button size="lg" onClick={onStart} className="w-full text-lg py-4">
          New Game →
        </Button>

        {/* How it works */}
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4 text-left">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            How it works
          </h2>
          <ol className="space-y-3">
            {HOW_IT_WORKS.map(({ icon, text }, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0 mt-0.5" aria-hidden="true">{icon}</span>
                <span className="text-sm text-gray-700">{text}</span>
              </li>
            ))}
          </ol>
        </div>

        <p className="text-xs text-gray-400">
          🔒 Speech is processed locally in your browser — nothing is sent to a server.
        </p>
      </div>
    </div>
  )
}
