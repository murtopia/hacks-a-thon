export function initChecklists(): void {
  const toggles = document.querySelectorAll<HTMLButtonElement>('.block-card__toggle')

  toggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true'
      const content = toggle.nextElementSibling as HTMLElement | null

      if (!content) return

      toggle.setAttribute('aria-expanded', String(!expanded))

      if (expanded) {
        content.hidden = true
      } else {
        content.hidden = false
      }
    })
  })
}
