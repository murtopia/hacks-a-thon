import { fetchIdeas, type IdeaLabIdea } from '../supabase/queries'
import {
  verifyVotePasscode,
  fetchExcludedProjectIds,
  fetchVotesForVoter,
  upsertVotes,
  type VoteSelection,
} from '../supabase/vote-queries'
import { CATEGORIES } from '../shared/categories'

let voterName = ''
const selections = new Map<string, { projectTitle: string; projectId: string }>()
let eligibleProjects: IdeaLabIdea[] = []
let deadline: string | null = null

function getApp(): HTMLElement {
  return document.getElementById('ballot-app')!
}

export async function initBallot(): Promise<void> {
  voterName = localStorage.getItem('hacky_voter_name') ?? ''
  renderGate()
}

function renderGate(): void {
  getApp().innerHTML = `
    <div class="gate">
      <h1 class="gate__title">Vote for the Hackies</h1>
      <p class="gate__subtitle">The Hacky Awards — Seven2 Hacks-a-Thon</p>
      <form class="gate__form" id="gate-form">
        <div class="gate__field">
          <label for="voter-name">Your Name</label>
          <input type="text" id="voter-name" placeholder="First Last" value="${escapeHtml(voterName)}" required autocomplete="name">
        </div>
        <div class="gate__field">
          <label for="passcode">Team Passcode</label>
          <input type="text" id="passcode" placeholder="Enter the team code" required autocomplete="off">
        </div>
        <button type="submit" class="gate__submit">Enter</button>
        <p class="gate__error" id="gate-error" hidden></p>
      </form>
    </div>
  `
  document.getElementById('gate-form')!.addEventListener('submit', handleGateSubmit)
}

async function handleGateSubmit(e: Event): Promise<void> {
  e.preventDefault()
  const nameInput = document.getElementById('voter-name') as HTMLInputElement
  const codeInput = document.getElementById('passcode') as HTMLInputElement
  const errorEl = document.getElementById('gate-error')!
  const btn = (e.target as HTMLFormElement).querySelector('button')!

  const name = nameInput.value.trim()
  const code = codeInput.value.trim()
  if (!name || !code) return

  btn.disabled = true
  btn.textContent = 'Checking…'
  errorEl.hidden = true

  const result = await verifyVotePasscode(code)

  if (!result.voting_open) {
    renderClosed(result.deadline)
    return
  }

  if (!result.valid) {
    errorEl.textContent = 'Wrong passcode. Try again.'
    errorEl.hidden = false
    btn.disabled = false
    btn.textContent = 'Enter'
    codeInput.value = ''
    codeInput.focus()
    return
  }

  voterName = name
  deadline = result.deadline
  localStorage.setItem('hacky_voter_name', voterName)

  await loadBallot()
}

function renderClosed(dl: string | null): void {
  getApp().innerHTML = `
    <div class="gate">
      <h1 class="gate__title">Voting Has Closed</h1>
      <p class="gate__subtitle">${dl ? `Voting ended ${escapeHtml(dl)}.` : 'The voting window has ended.'}</p>
      <p class="gate__subtitle">Winners will be announced on the main site.</p>
      <a href="/#awards" class="gate__submit" style="text-align:center;text-decoration:none;display:block">See the Hackies &rarr;</a>
    </div>
  `
}

async function loadBallot(): Promise<void> {
  getApp().innerHTML = '<div class="vote-loading">Loading ballot&hellip;</div>'

  const [allProjects, excludedIds, existingVotes] = await Promise.all([
    fetchIdeas(),
    fetchExcludedProjectIds(),
    fetchVotesForVoter(voterName),
  ])

  eligibleProjects = allProjects.filter(p => !excludedIds.has(p.id))

  existingVotes.forEach(v => {
    selections.set(v.category, { projectTitle: v.project_title, projectId: v.project_id ?? '' })
  })

  renderBallot()
}

function renderBallot(): void {
  const categoriesHtml = CATEGORIES.map(cat => {
    const selected = selections.get(cat.name)
    const projectItems = eligibleProjects.map(p => {
      const isSelected = selected?.projectId === p.id
      return `
        <button type="button"
                class="ballot-project ${isSelected ? 'ballot-project--selected' : ''}"
                data-category="${escapeAttr(cat.name)}"
                data-project-id="${escapeAttr(p.id)}"
                data-project-title="${escapeAttr(p.title)}">
          <span class="ballot-project__indicator"></span>
          <span class="ballot-project__title">${escapeHtml(p.title)}</span>
          <span class="ballot-project__author">${escapeHtml(p.submitter)}</span>
        </button>`
    }).join('')

    return `
      <div class="ballot-category">
        <div class="ballot-category__header">
          <h2 class="ballot-category__name">${escapeHtml(cat.name)}</h2>
          <p class="ballot-category__desc">${escapeHtml(cat.description)}</p>
        </div>
        <div class="ballot-category__projects">
          ${projectItems}
        </div>
      </div>`
  }).join('')

  const count = selections.size
  const deadlineHtml = deadline
    ? `<p class="ballot-deadline">Voting closes ${escapeHtml(deadline)}</p>`
    : ''

  getApp().innerHTML = `
    <div class="ballot">
      <div class="ballot__header">
        <h1 class="ballot__title">Your Ballot</h1>
        <p class="ballot__voter">Voting as <strong>${escapeHtml(voterName)}</strong></p>
        ${deadlineHtml}
      </div>
      <div class="ballot__categories">
        ${categoriesHtml}
      </div>
      <div class="ballot__footer">
        <button type="button" class="ballot__submit" id="submit-votes">
          Cast Your Votes (${count} of ${CATEGORIES.length})
        </button>
      </div>
    </div>
  `

  getApp().querySelectorAll('.ballot-project').forEach(btn => {
    btn.addEventListener('click', handleProjectSelect)
  })
  document.getElementById('submit-votes')!.addEventListener('click', handleSubmit)
}

function handleProjectSelect(e: Event): void {
  const btn = (e.currentTarget as HTMLElement)
  const category = btn.dataset.category!
  const projectId = btn.dataset.projectId!
  const projectTitle = btn.dataset.projectTitle!

  const current = selections.get(category)
  if (current?.projectId === projectId) {
    selections.delete(category)
  } else {
    selections.set(category, { projectTitle, projectId })
  }

  const container = btn.closest('.ballot-category__projects')!
  container.querySelectorAll('.ballot-project').forEach(b => {
    const bid = (b as HTMLElement).dataset.projectId
    b.classList.toggle('ballot-project--selected', bid === selections.get(category)?.projectId)
  })

  const count = selections.size
  const submitBtn = document.getElementById('submit-votes')!
  submitBtn.textContent = `Cast Your Votes (${count} of ${CATEGORIES.length})`
}

async function handleSubmit(): Promise<void> {
  if (selections.size === 0) return

  const submitBtn = document.getElementById('submit-votes')!
  submitBtn.setAttribute('disabled', '')
  submitBtn.textContent = 'Submitting…'

  const voteSelections: VoteSelection[] = []
  selections.forEach((val, category) => {
    voteSelections.push({
      category,
      projectTitle: val.projectTitle,
      projectId: val.projectId,
    })
  })

  const success = await upsertVotes(voterName, voteSelections)

  if (!success) {
    submitBtn.removeAttribute('disabled')
    submitBtn.textContent = 'Something went wrong — try again'
    return
  }

  renderConfirmation()
}

function renderConfirmation(): void {
  const summaryHtml = CATEGORIES.map(cat => {
    const pick = selections.get(cat.name)
    return `
      <div class="confirm-pick">
        <span class="confirm-pick__category">${escapeHtml(cat.name)}</span>
        <span class="confirm-pick__project">${pick ? escapeHtml(pick.projectTitle) : '—'}</span>
      </div>`
  }).join('')

  getApp().innerHTML = `
    <div class="confirm">
      <h1 class="confirm__title">Votes Recorded</h1>
      <p class="confirm__subtitle">Thanks, ${escapeHtml(voterName)}! Here's what you voted for:</p>
      <div class="confirm__summary">
        ${summaryHtml}
      </div>
      <div class="confirm__actions">
        <button type="button" class="confirm__change" id="change-votes">Change My Votes</button>
        <a href="/" class="confirm__back">Back to site &rarr;</a>
      </div>
    </div>
  `
  document.getElementById('change-votes')!.addEventListener('click', renderBallot)
}

function escapeHtml(str: string): string {
  const el = document.createElement('span')
  el.textContent = str
  return el.innerHTML
}

function escapeAttr(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
