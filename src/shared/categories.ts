export interface Category {
  key: string
  name: string
  description: string
}

export const CATEGORIES: Category[] = [
  { key: 'best-in-show', name: 'Best in Show', description: 'The overall standout' },
  { key: 'take-my-money', name: 'Shut Up and Take My Money', description: 'The one everyone actually wants to use' },
  { key: 'execution', name: 'Best Execution', description: 'Cleanest build quality and implementation' },
  { key: 'creative', name: 'Most Creative Idea', description: 'The idea that surprised everyone' },
  { key: 'shark-tank', name: 'Best Shark Tank Pitch', description: 'Best presentation and storytelling during demos' },
  { key: 'seven2-energy', name: 'Most Seven2 Energy', description: 'Creative, bold, and fun — pure Seven2 spirit' },
]
