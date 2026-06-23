import type { BingoCard, CategoryId } from '../types'
import { categories } from '../data/categories'

export function generateCard(categoryId: CategoryId): BingoCard {
  const category = categories.find(c => c.id === categoryId)!
  const words = [...category.words]

  // Fisher-Yates shuffle
  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[words[i], words[j]] = [words[j], words[i]]
  }

  const selected = words.slice(0, 24)
  let wordIdx = 0

  const card: BingoCard = []
  for (let row = 0; row < 5; row++) {
    card[row] = []
    for (let col = 0; col < 5; col++) {
      const isFree = row === 2 && col === 2
      card[row][col] = {
        word: isFree ? 'FREE' : selected[wordIdx++],
        isFilled: isFree,
        isAutoFilled: false,
        isFree,
        isWinning: false,
      }
    }
  }

  return card
}
