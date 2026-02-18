import { fetchIdeas, type IdeaLabIdea } from '../supabase/queries'

const STATUS_LABELS: Record<string, string> = {
  idea_stage: 'Ideating',
  in_progress: 'Building',
  completed: 'Complete',
}

const STATUS_CLASSES: Record<string, string> = {
  idea_stage: 'project-card__status--ideating',
  in_progress: 'project-card__status--building',
  completed: 'project-card__status--complete',
}

function renderProjectCard(idea: IdeaLabIdea): string {
  const statusLabel = STATUS_LABELS[idea.status] ?? idea.status
  const statusClass = STATUS_CLASSES[idea.status] ?? ''

  const linkHtml = idea.project_url
    ? `<a href="${idea.project_url}" target="_blank" rel="noopener" class="project-card__link">View Project →</a>`
    : ''

  return `
    <div class="project-card fade-in">
      <span class="project-card__status ${statusClass}">${statusLabel}</span>
      <h3 class="project-card__title">${escapeHtml(idea.title)}</h3>
      <p class="project-card__author">${escapeHtml(idea.submitter)}</p>
      <p class="project-card__desc">${escapeHtml(idea.pitch)}</p>
      ${linkHtml}
    </div>
  `
}

function escapeHtml(str: string): string {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

export async function renderProjects(): Promise<void> {
  const grid = document.getElementById('projects-grid')
  if (!grid) return

  const ideas = await fetchIdeas()

  if (ideas.length === 0) return

  grid.innerHTML = ideas.map(renderProjectCard).join('')

  // Re-observe new elements for scroll animation
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  )

  grid.querySelectorAll('.fade-in').forEach((el) => observer.observe(el))
}
