export type CategoryId = 'agile' | 'corporate' | 'tech'

export interface Category {
  id: CategoryId
  name: string
  icon: string
  description: string
  words: string[]
}

export interface BingoSquare {
  word: string
  isFilled: boolean
  isAutoFilled: boolean
  isFree: boolean
  isWinning: boolean
}

export type BingoCard = BingoSquare[][]

export type GameStatus = 'idle' | 'playing' | 'won'

export interface WinningLine {
  type: 'row' | 'col' | 'diag'
  index: number
  squares: [number, number][]
}

export interface GameState {
  status: GameStatus
  categoryId: CategoryId | null
  card: BingoCard | null
  winningLine: WinningLine | null
  filledCount: number
  startedAt: number | null
  completedAt: number | null
}

export interface Toast {
  id: string
  word: string
}
