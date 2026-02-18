export function initNav(): void {
  const toggle = document.querySelector<HTMLButtonElement>('.nav__toggle')
  const links = document.querySelector<HTMLElement>('.nav__links')

  if (!toggle || !links) return

  toggle.addEventListener('click', () => {
    links.classList.toggle('is-open')
  })

  links.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', () => {
      links.classList.remove('is-open')
    })
  })

  // Highlight active section on scroll
  const sections = document.querySelectorAll<HTMLElement>('.section, .hero')
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav__link')

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id
          navLinks.forEach((link) => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`)
          })
        }
      })
    },
    { threshold: 0.2, rootMargin: '-56px 0px -50% 0px' }
  )

  sections.forEach((section) => observer.observe(section))
}
