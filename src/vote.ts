import './styles/tokens.css'
import './styles/base.css'
import './styles/vote.css'

import { initBallot } from './vote/ballot'

document.addEventListener('DOMContentLoaded', () => {
  initBallot()
})
