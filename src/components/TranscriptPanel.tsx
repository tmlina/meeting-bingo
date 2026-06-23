interface TranscriptPanelProps {
  isListening: boolean
  isSupported: boolean
  transcript: string
  interimTranscript: string
  error: string | null
}

function MicPermissionHelp({ error }: { error: string }) {
  const isPolicy = error === 'service-not-allowed'

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-3 space-y-2">
      <p className="text-xs font-semibold text-red-700">
        {isPolicy
          ? 'Microphone blocked by browser policy'
          : 'Microphone access denied'}
      </p>
      <p className="text-xs text-red-600">To enable it:</p>
      <ol className="text-xs text-red-600 space-y-1 list-decimal list-inside">
        <li>
          Click the <strong>lock 🔒</strong> or <strong>info ⓘ</strong> icon in your browser's
          address bar
        </li>
        <li>
          Find <strong>Microphone</strong> and change it to <strong>Allow</strong>
        </li>
        <li>Reload the page, then try again</li>
      </ol>
      {isPolicy && (
        <p className="text-xs text-red-500 mt-1">
          If this is a managed device, your organisation may need to allow microphone access for
          this site.
        </p>
      )}
    </div>
  )
}

function ErrorMessage({ error }: { error: string }) {
  if (error === 'not-allowed' || error === 'service-not-allowed') {
    return <MicPermissionHelp error={error} />
  }

  const MESSAGES: Record<string, string> = {
    'mic-unavailable': 'Mic disconnected or unavailable after 3 retries. Check your hardware and reload.',
    'network': 'Network error — speech recognition requires an internet connection.',
    'no-speech': 'No speech detected. Try speaking more clearly or check your mic.',
  }

  return (
    <p className="text-xs text-red-600">
      {MESSAGES[error] ?? `Speech error: ${error}`}
    </p>
  )
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

      {error && <ErrorMessage error={error} />}

      {!error && isListening && !transcript && !interimTranscript && (
        <p className="text-xs text-gray-400 italic">Waiting for speech…</p>
      )}

      {(transcript || interimTranscript) && (
        <div className="text-xs leading-relaxed">
          {displayTranscript && <span className="text-gray-700">{displayTranscript}</span>}
          {interimTranscript && (
            <span className="text-gray-500 italic"> {interimTranscript}</span>
          )}
        </div>
      )}
    </div>
  )
}
