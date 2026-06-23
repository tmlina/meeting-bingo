import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'

const MAX_RETRIES = 3
const TRANSCRIPT_WINDOW = 600

function getSR(): typeof SpeechRecognition | undefined {
  if (typeof SpeechRecognition !== 'undefined') return SpeechRecognition
  if (typeof window !== 'undefined' && window.webkitSpeechRecognition)
    return window.webkitSpeechRecognition
  return undefined
}

export function useSpeechRecognition(onFinalTranscript: (text: string) => void) {
  const SR = getSR()
  const isSupported = SR != null

  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)

  // H5: refs for values read inside async callbacks to avoid stale closures
  const isListeningRef = useRef(false)
  const retryCountRef = useRef(0) // H8: circuit breaker
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const onFinalRef = useRef(onFinalTranscript)
  const createAndStartRef = useRef<() => void>(() => {})

  // Keep callback refs current without rendering — must be layout effect, not render
  useLayoutEffect(() => {
    onFinalRef.current = onFinalTranscript
  })

  const createAndStart = useCallback(() => {
    if (!SR) return

    const recognition = new SR()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognitionRef.current = recognition

    recognition.onstart = () => {
      retryCountRef.current = 0
      setIsListening(true)
      setError(null)
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          const text = result[0].transcript
          onFinalRef.current(text)
          setTranscript(prev => {
            const next = prev + ' ' + text.trim()
            return next.length > TRANSCRIPT_WINDOW ? next.slice(-TRANSCRIPT_WINDOW) : next
          })
        } else {
          interim += result[0].transcript
        }
      }
      setInterimTranscript(interim)
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'aborted') return
      setError(event.error)
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        isListeningRef.current = false
        setIsListening(false)
      }
    }

    recognition.onend = () => {
      setInterimTranscript('')
      if (!isListeningRef.current) return

      if (retryCountRef.current >= MAX_RETRIES) {
        setError('mic-unavailable')
        isListeningRef.current = false
        setIsListening(false)
        return
      }
      retryCountRef.current++
      // H8: call through ref to avoid forward-reference / stale-closure issues
      createAndStartRef.current()
    }

    recognition.start()
  }, [SR])

  // Keep createAndStart ref current after every render
  useLayoutEffect(() => {
    createAndStartRef.current = createAndStart
  })

  const startListening = useCallback(() => {
    if (!isSupported || isListeningRef.current) return
    isListeningRef.current = true
    retryCountRef.current = 0
    setError(null)
    createAndStart()
  }, [isSupported, createAndStart])

  const stopListening = useCallback(() => {
    isListeningRef.current = false
    recognitionRef.current?.stop()
    setIsListening(false)
    setInterimTranscript('')
  }, [])

  useEffect(() => {
    return () => {
      isListeningRef.current = false
      recognitionRef.current?.stop()
    }
  }, [])

  return {
    isListening,
    isSupported,
    transcript: transcript.trim(),
    interimTranscript,
    error,
    startListening,
    stopListening,
  }
}
