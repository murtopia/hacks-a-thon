import { fetchReflections, type Reflection } from '../supabase/queries'

function escapeHtml(str: string): string {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

function renderQuote(reflection: Reflection): string {
  return `
    <blockquote class="reflection-quote fade-in">
      <p class="reflection-quote__text">${escapeHtml(reflection.answer)}</p>
      <footer class="reflection-quote__footer">
        <cite class="reflection-quote__author">${escapeHtml(reflection.participant_name)}</cite>
        <span class="reflection-quote__question">on "${escapeHtml(reflection.question)}"</span>
      </footer>
    </blockquote>
  `
}

export async function renderReflections(): Promise<void> {
  const container = document.getElementById('reflections-quotes')
  if (!container) return

  const reflections = await fetchReflections()
  if (reflections.length === 0) return

  container.innerHTML = reflections.map(renderQuote).join('')

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

  container.querySelectorAll('.fade-in').forEach((el) => observer.observe(el))
}
