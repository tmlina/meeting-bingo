interface TranscriptPanelProps {
  isListening: boolean
  isSupported: boolean
  transcript: string
  interimTranscript: string
  error: string | null
}

const ERROR_MESSAGES: Record<string, string> = {
  'not-allowed': 'Microphone access denied. Allow mic access and try again.',
  'service-not-allowed': 'Microphone access denied by policy.',
  'mic-unavailable': 'Mic disconnected or unavailable. Please check your hardware.',
  'network': 'Network error — speech recognition needs an internet connection.',
  'no-speech': 'No speech detected.',
}

export function TranscriptPanel({
  isListening,
  isSupported,
  transcript,
  interimTranscript,
  error,
}: TranscriptPanelProps) {
  if (!isSupported) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        <strong>Voice detection not supported.</strong> Your browser doesn't support the Web Speech
        API. Use Google Chrome or Microsoft Edge for auto-detection, or mark squares manually.
      </div>
    )
  }

  const displayTranscript = transcript.slice(-100)

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-1.5">
      <div className="flex items-center gap-2">
        {/* H11: ARIA label on pulsing mic dot */}
        <span
          aria-label={isListening ? 'Microphone active' : 'Microphone inactive'}
          className={
            isListening
              ? 'inline-block w-2.5 h-2.5 rounded-full bg-red-500 motion-safe:animate-pulse'
              : 'inline-block w-2.5 h-2.5 rounded-full bg-gray-300'
          }
        />
        <span className="text-xs font-medium text-gray-500">
          {isListening ? 'Listening…' : 'Not listening'}
        </span>
      </div>

      {error && (
        <p className="text-xs text-red-600">{ERROR_MESSAGES[error] ?? `Error: ${error}`}</p>
      )}

      {/* M13: empty/silence state */}
      {!error && isListening && !transcript && !interimTranscript && (
        <p className="text-xs text-gray-400 italic">Waiting for speech…</p>
      )}

      {(transcript || interimTranscript) && (
        <div className="text-xs leading-relaxed">
          {displayTranscript && (
            <span className="text-gray-700">{displayTranscript}</span>
          )}
          {/* M14: interim text — use gray-500 (≥4.5:1 on white) not gray-400 */}
          {interimTranscript && (
            <span className="text-gray-500 italic"> {interimTranscript}</span>
          )}
        </div>
      )}
    </div>
  )
}
