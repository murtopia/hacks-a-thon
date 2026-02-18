import './styles/tokens.css'
import './styles/base.css'
import './styles/grid.css'
import './styles/typography.css'
import './styles/components.css'
import './styles/sections.css'
import './styles/animations.css'

import { initScrollAnimations } from './utils/scroll'
import { initChecklists } from './utils/expand'
import { initNav } from './utils/nav'
import { renderProjects } from './sections/projects'
import { renderAwards } from './sections/awards'
import { renderReflections } from './sections/reflections'

document.addEventListener('DOMContentLoaded', () => {
  initNav()
  initChecklists()
  initScrollAnimations()

  renderProjects()
  renderAwards()
  renderReflections()
})
