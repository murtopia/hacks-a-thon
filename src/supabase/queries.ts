import { idealab } from './idealab-client'
import { hacksathon } from './hacksathon-client'

// ── IdeaLab Types ──

export interface IdeaLabIdea {
  id: string
  title: string
  pitch: string
  description: string | null
  submitter: string
  sparks: number
  status: 'idea_stage' | 'in_progress' | 'completed'
  project_url: string | null
  created_at: string
}

// ── Hacksathon Types ──

export interface Award {
  id: string
  category: string
  description: string | null
  winner_name: string | null
  project_title: string | null
  project_url: string | null
}

export interface Reflection {
  id: string
  participant_name: string
  question: string
  answer: string
  is_featured: boolean
}

// Seven2 organization ID in IdeaLab
const SEVEN2_ORG_ID = '16a200e8-7125-47f3-b694-063f5bf53479'

// ── IdeaLab Queries ──

export async function fetchIdeas(): Promise<IdeaLabIdea[]> {
  const { data, error } = await idealab
    .from('ideas')
    .select('id, title, pitch, description, submitter, sparks, status, project_url, created_at')
    .eq('organization_id', SEVEN2_ORG_ID)
    .order('created_at', { ascending: false })

  if (error) {
    console.warn('Failed to fetch ideas from IdeaLab:', error.message)
    return []
  }

  return data ?? []
}

// ── Hacksathon Queries ──

export async function fetchAwards(): Promise<Award[]> {
  if (!hacksathon) return []

  const { data, error } = await hacksathon
    .from('awards')
    .select('*')
    .order('id')

  if (error) {
    console.warn('Failed to fetch awards:', error.message)
    return []
  }

  return data ?? []
}

export async function fetchReflections(): Promise<Reflection[]> {
  if (!hacksathon) return []

  const { data, error } = await hacksathon
    .from('reflections')
    .select('*')
    .eq('is_featured', true)
    .order('created_at')

  if (error) {
    console.warn('Failed to fetch reflections:', error.message)
    return []
  }

  return data ?? []
}
