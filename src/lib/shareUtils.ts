import type { CategoryId } from '../types'
import { formatTime } from './utils'

const CATEGORY_NAMES: Record<CategoryId, string> = {
  agile: 'Agile & Scrum',
  corporate: 'Corporate Speak',
  tech: 'Tech & Engineering',
}

export function buildShareText(categoryId: CategoryId, timeMs: number | null): string {
  const cat = CATEGORY_NAMES[categoryId]
  const time = timeMs != null ? formatTime(timeMs) : null
  const timeStr = time ? ` in ${time}` : ''
  const url = (import.meta.env['VITE_APP_URL'] as string | undefined) ?? window.location.origin
  return `🎱 Got BINGO${timeStr} playing Meeting Bingo — ${cat} category! ${url}`
}

export async function shareResult(text: string): Promise<'shared' | 'copied' | 'failed'> {
  if (navigator.share) {
    try {
      await navigator.share({ text })
      return 'shared'
    } catch {
      // user cancelled — fall through to clipboard
    }
  }
  try {
    await navigator.clipboard.writeText(text)
    return 'copied'
  } catch {
    return 'failed'
  }
}
