// Maps canonical word → alternate forms that should trigger it
const ALIASES: Record<string, string[]> = {
  'ci/cd': ['ci cd', 'cicd', 'continuous integration continuous delivery'],
  'mvp': ['minimum viable product'],
  'roi': ['return on investment'],
  'kpi': ['key performance indicator', 'kpis'],
  'okrs': ['objectives and key results', 'okr'],
  'api': ['application programming interface', 'apis'],
  'ux': ['user experience'],
  'ui': ['user interface'],
  'pull request': ['pr', 'prs'],
  'sla': ['service level agreement', 'slas'],
  'devops': ['dev ops'],
  'postmortem': ['post mortem', 'post-mortem'],
  'on-call': ['on call', 'oncall'],
  'blue-green': ['blue green deployment'],
  'tl;dr': ['tldr'],
}

function normalize(text: string): string {
  return text.toLowerCase().trim()
}

function escapedWordBoundaryRegex(word: string): RegExp {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(?<![a-z])${escaped}(?![a-z])`, 'i')
}

function matchesWord(haystack: string, needle: string): boolean {
  // Use word-boundary-style regex for single words to avoid "sprint" matching "sprinting"
  if (!needle.includes(' ')) {
    return escapedWordBoundaryRegex(needle).test(haystack)
  }
  // Phrase: substring match is fine (full phrases won't be partial in practice)
  return haystack.includes(needle)
}

export function detectWords(transcript: string, words: string[]): string[] {
  const norm = normalize(transcript)
  const detected: string[] = []

  for (const word of words) {
    const normWord = normalize(word)

    if (matchesWord(norm, normWord)) {
      detected.push(word)
      continue
    }

    // Check aliases in both directions
    const aliasTargets = ALIASES[normWord]
    if (aliasTargets?.some(alias => matchesWord(norm, normalize(alias)))) {
      detected.push(word)
      continue
    }

    // Also check if this word is itself an alias target for something
    for (const [canonical, aliases] of Object.entries(ALIASES)) {
      if (aliases.includes(normWord) && matchesWord(norm, canonical)) {
        detected.push(word)
        break
      }
    }
  }

  return detected
}
