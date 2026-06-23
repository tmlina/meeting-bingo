import type { BingoCard, WinningLine } from '../types'

export function checkForBingo(card: BingoCard): WinningLine | null {
  // Rows
  for (let row = 0; row < 5; row++) {
    if (card[row].every(sq => sq.isFilled)) {
      return {
        type: 'row',
        index: row,
        squares: card[row].map((_, col) => [row, col] as [number, number]),
      }
    }
  }

  // Columns
  for (let col = 0; col < 5; col++) {
    if (card.every(row => row[col].isFilled)) {
      return {
        type: 'col',
        index: col,
        squares: card.map((_, row) => [row, col] as [number, number]),
      }
    }
  }

  // Main diagonal (top-left → bottom-right)
  if (card.every((row, i) => row[i].isFilled)) {
    return {
      type: 'diag',
      index: 0,
      squares: card.map((_, i) => [i, i] as [number, number]),
    }
  }

  // Anti-diagonal (top-right → bottom-left)
  if (card.every((row, i) => row[4 - i].isFilled)) {
    return {
      type: 'diag',
      index: 1,
      squares: card.map((_, i) => [i, 4 - i] as [number, number]),
    }
  }

  return null
}

export function getOneAwayLines(card: BingoCard): Set<string> {
  const oneAway = new Set<string>()

  for (let row = 0; row < 5; row++) {
    const unfilled = card[row].filter(sq => !sq.isFilled).length
    if (unfilled === 1) {
      card[row].forEach((sq, col) => {
        if (!sq.isFilled) oneAway.add(`${row},${col}`)
      })
    }
  }

  for (let col = 0; col < 5; col++) {
    const unfilled = card.filter(row => !row[col].isFilled).length
    if (unfilled === 1) {
      card.forEach((row, ri) => {
        if (!row[col].isFilled) oneAway.add(`${ri},${col}`)
      })
    }
  }

  const mainDiagUnfilled = card.filter((row, i) => !row[i].isFilled)
  if (mainDiagUnfilled.length === 1) {
    card.forEach((row, i) => {
      if (!row[i].isFilled) oneAway.add(`${i},${i}`)
    })
  }

  const antiDiagUnfilled = card.filter((row, i) => !row[4 - i].isFilled)
  if (antiDiagUnfilled.length === 1) {
    card.forEach((row, i) => {
      if (!row[4 - i].isFilled) oneAway.add(`${i},${4 - i}`)
    })
  }

  return oneAway
}
