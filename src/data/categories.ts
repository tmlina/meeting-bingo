import type { Category } from '../types'

export const categories: Category[] = [
  {
    id: 'agile',
    name: 'Agile & Scrum',
    icon: '🔄',
    description: 'Sprints, standups, and story points',
    words: [
      'Sprint', 'Backlog', 'Velocity', 'Burndown', 'Retrospective',
      'Stand-up', 'Story points', 'User story', 'Epic', 'Sprint planning',
      'Definition of done', 'Technical debt', 'Refactoring', 'MVP', 'Spike',
      'Iteration', 'Increment', 'Product owner', 'Scrum master', 'Daily scrum',
      'Sprint review', 'Acceptance criteria', 'Agile', 'Blockers', 'Action items',
      'Deliverables', 'Bandwidth', 'Capacity', 'Prioritize', 'Roadmap',
      'OKRs', 'KPIs', 'Alignment', 'Stakeholder', 'Dependencies',
      'Definition of ready', 'Release train', 'Scrum of scrums', 'Swimlane', 'Parking lot',
    ],
  },
  {
    id: 'corporate',
    name: 'Corporate Speak',
    icon: '💼',
    description: 'Synergies, pivots, and paradigm shifts',
    words: [
      'Synergy', 'Leverage', 'Paradigm shift', 'Circle back', 'Touch base',
      'Move the needle', 'Low-hanging fruit', 'Deep dive', 'Pivot', 'Scalable',
      'Disruptive', 'Value-add', 'Holistic', 'Ideate', 'Learnings',
      'Actionable', 'Buy-in', 'Going forward', 'Best practices', 'Streamline',
      'Core competency', 'In the weeds', 'Drill down', 'Robust', 'Ecosystem',
      'Empower', 'Proactive', 'Transparency', 'Win-win', 'Bandwidth',
      'Take offline', 'Boil the ocean', 'Think outside the box', 'Net-net', 'Optics',
      'At the end of the day', 'Ballpark', 'Unpack', 'Double-click', 'Socialize',
    ],
  },
  {
    id: 'tech',
    name: 'Tech & Engineering',
    icon: '⚙️',
    description: 'Deploys, PRs, and production incidents',
    words: [
      'Deploy', 'Refactor', 'Technical debt', 'Pull request', 'Code review',
      'CI/CD', 'Kubernetes', 'Microservices', 'API', 'Latency',
      'Scalability', 'Infrastructure', 'DevOps', 'Serverless', 'Container',
      'Observability', 'Monitoring', 'SLA', 'On-call', 'Incident',
      'Postmortem', 'Migration', 'Abstraction', 'Dependency', 'Architecture',
      'Distributed', 'Load balancer', 'Cache', 'Async', 'Framework',
      'Regression', 'Test coverage', 'Feature flag', 'Rate limiting', 'Idempotent',
      'Eventual consistency', 'Deadlock', 'Race condition', 'Rollback', 'Blue-green',
    ],
  },
]
