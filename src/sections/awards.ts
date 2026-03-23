import { fetchAwards, type Award } from '../supabase/queries'
import { CATEGORIES } from '../shared/categories'

const AWARD_SLOTS: Record<string, string> = {}
CATEGORIES.forEach(c => { AWARD_SLOTS[c.name] = c.key })

export async function renderAwards(): Promise<void> {
  const awards = await fetchAwards()
  if (awards.length === 0) return

  awards.forEach((award: Award) => {
    const slot = AWARD_SLOTS[award.category]
    if (!slot) return

    const el = document.querySelector<HTMLElement>(`[data-award="${slot}"]`)
    if (!el) return

    if (award.winner_name) {
      el.textContent = award.winner_name
      el.classList.add('award-card__winner--announced')

      if (award.project_url) {
        const link = document.createElement('a')
        link.href = award.project_url
        link.target = '_blank'
        link.rel = 'noopener'
        link.className = 'project-card__link'
        link.textContent = 'View Project →'
        el.parentElement?.appendChild(link)
      }
    }
  })
}
