import { useEffect, useRef } from 'react'
import type { Toast as ToastType } from '../../types'

interface ToastProps {
  toasts: ToastType[]
  onDismiss: (id: string) => void
}

const DISMISS_MS = 3000

export function ToastContainer({ toasts, onDismiss }: ToastProps) {
  return (
    // H10: ARIA live region so screen readers announce detections
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-4 right-4 flex flex-col gap-2 z-50 pointer-events-none"
    >
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onDismiss }: { toast: ToastType; onDismiss: (id: string) => void }) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    timerRef.current = setTimeout(() => onDismiss(toast.id), DISMISS_MS)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [toast.id, onDismiss])

  return (
    <div
      role="status"
      className="pointer-events-auto bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-lg animate-[fadeIn_0.2s_ease-in]"
    >
      ✓ <span className="font-bold">{toast.word}</span> detected
    </div>
  )
}
