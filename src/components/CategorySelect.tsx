import { categories } from '../data/categories'
import type { CategoryId } from '../types'

interface CategorySelectProps {
  onSelect: (categoryId: CategoryId) => void
  onBack: () => void
}

export function CategorySelect({ onSelect, onBack }: CategorySelectProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-1">
          <button
            onClick={onBack}
            className="text-sm text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            aria-label="Go back to landing page"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Choose a Category</h1>
          <p className="text-sm text-gray-500">Pick the one that fits your meeting best</p>
        </div>

        <div className="space-y-3">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className="w-full text-left bg-white rounded-2xl p-5 shadow-sm border border-transparent hover:border-blue-300 hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl" aria-hidden="true">{cat.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900">{cat.name}</div>
                  <div className="text-sm text-gray-500 mt-0.5">{cat.description}</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {cat.words.slice(0, 5).map(w => (
                      <span
                        key={w}
                        className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full"
                      >
                        {w}
                      </span>
                    ))}
                    <span className="text-xs text-gray-400">+{cat.words.length - 5} more</span>
                  </div>
                </div>
                <span className="text-gray-300 text-xl" aria-hidden="true">›</span>
              </div>
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400">
          Each game draws 24 random words from the category
        </p>
      </div>
    </div>
  )
}
