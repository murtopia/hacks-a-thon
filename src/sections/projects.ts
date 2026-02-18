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

let ideas: IdeaLabIdea[] = []

function escapeHtml(str: string): string {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

function renderProjectCard(idea: IdeaLabIdea, index: number): string {
  const statusLabel = STATUS_LABELS[idea.status] ?? idea.status
  const statusClass = STATUS_CLASSES[idea.status] ?? ''

  return `
    <button class="project-card fade-in" data-idea-index="${index}" type="button">
      <span class="project-card__status ${statusClass}">${statusLabel}</span>
      <h3 class="project-card__title">${escapeHtml(idea.title)}</h3>
      <p class="project-card__author">${escapeHtml(idea.submitter)}</p>
      <p class="project-card__desc">${escapeHtml(idea.pitch)}</p>
      <span class="project-card__cta mono-label">View Details</span>
    </button>
  `
}

function renderModal(idea: IdeaLabIdea): string {
  const statusLabel = STATUS_LABELS[idea.status] ?? idea.status
  const statusClass = STATUS_CLASSES[idea.status] ?? ''

  const descriptionHtml = idea.description
    ? `<div class="modal__section">
        <h4>Description</h4>
        <p>${escapeHtml(idea.description)}</p>
      </div>`
    : ''

  const projectLinkHtml = idea.project_url
    ? `<a href="${idea.project_url}" target="_blank" rel="noopener" class="modal__project-link">
        View Live Project →
      </a>`
    : ''

  const sparksHtml = idea.sparks > 0
    ? `<span class="modal__sparks">${idea.sparks} spark${idea.sparks !== 1 ? 's' : ''}</span>`
    : ''

  return `
    <div class="modal__header">
      <div class="modal__header-meta">
        <span class="project-card__status ${statusClass}">${statusLabel}</span>
        ${sparksHtml}
      </div>
      <button class="modal__close" aria-label="Close modal" type="button">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
    <h2 class="modal__title">${escapeHtml(idea.title)}</h2>
    <p class="modal__author">by ${escapeHtml(idea.submitter)}</p>
    <div class="modal__section">
      <h4>Pitch</h4>
      <p>${escapeHtml(idea.pitch)}</p>
    </div>
    ${descriptionHtml}
    ${projectLinkHtml}
  `
}

function openModal(idea: IdeaLabIdea): void {
  let overlay = document.getElementById('project-modal-overlay')
  let modal = document.getElementById('project-modal')

  if (!overlay) {
    overlay = document.createElement('div')
    overlay.id = 'project-modal-overlay'
    overlay.className = 'modal-overlay'
    document.body.appendChild(overlay)
  }

  if (!modal) {
    modal = document.createElement('div')
    modal.id = 'project-modal'
    modal.className = 'modal'
    modal.setAttribute('role', 'dialog')
    modal.setAttribute('aria-modal', 'true')
    document.body.appendChild(modal)
  }

  modal.innerHTML = renderModal(idea)
  modal.setAttribute('aria-label', idea.title)

  requestAnimationFrame(() => {
    overlay!.classList.add('is-open')
    modal!.classList.add('is-open')
    document.body.style.overflow = 'hidden'
  })

  const closeBtn = modal.querySelector('.modal__close')
  closeBtn?.addEventListener('click', closeModal)
  overlay.addEventListener('click', closeModal)
}

function closeModal(): void {
  const overlay = document.getElementById('project-modal-overlay')
  const modal = document.getElementById('project-modal')

  overlay?.classList.remove('is-open')
  modal?.classList.remove('is-open')
  document.body.style.overflow = ''
}

function handleKeydown(e: KeyboardEvent): void {
  if (e.key === 'Escape') closeModal()
}

export async function renderProjects(): Promise<void> {
  const grid = document.getElementById('projects-grid')
  if (!grid) return

  ideas = await fetchIdeas()

  if (ideas.length === 0) return

  grid.innerHTML = ideas.map(renderProjectCard).join('')

  grid.addEventListener('click', (e) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>('[data-idea-index]')
    if (!card) return
    const index = parseInt(card.dataset.ideaIndex ?? '', 10)
    if (!isNaN(index) && ideas[index]) {
      openModal(ideas[index])
    }
  })

  document.addEventListener('keydown', handleKeydown)

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
