import { fetchIdeas, type IdeaLabIdea } from '../supabase/queries'
import {
  verifyAdminPasscode,
  getVotingConfig,
  fetchExcludedProjectIds,
  fetchAllVotes,
  toggleExclusion,
  toggleVoting,
  setVotingDeadline,
  updateVotePasscode,
  updateAdminPasscode,
  announceWinner,
  type VoteRecord,
  type VotingConfigResult,
} from '../supabase/vote-queries'
import { CATEGORIES } from '../shared/categories'

let adminCode = ''
let allProjects: IdeaLabIdea[] = []
let excludedIds: Set<string> = new Set()
let allVotes: VoteRecord[] = []
let config: VotingConfigResult = { valid: false }

function getApp(): HTMLElement {
  return document.getElementById('admin-app')!
}

export function initDashboard(): void {
  renderGate()
}

function renderGate(): void {
  getApp().innerHTML = `
    <div class="admin-gate">
      <h1 class="admin-gate__title">Admin Access</h1>
      <form class="admin-gate__form" id="admin-gate-form">
        <div class="admin-gate__field">
          <label for="admin-code">Admin Passcode</label>
          <input type="password" id="admin-code" placeholder="Enter admin code" required autocomplete="off">
        </div>
        <button type="submit" class="admin-gate__submit">Enter</button>
        <p class="admin-gate__error" id="admin-gate-error" hidden></p>
      </form>
    </div>
  `
  document.getElementById('admin-gate-form')!.addEventListener('submit', handleAdminGate)
}

async function handleAdminGate(e: Event): Promise<void> {
  e.preventDefault()
  const input = document.getElementById('admin-code') as HTMLInputElement
  const errorEl = document.getElementById('admin-gate-error')!
  const btn = (e.target as HTMLFormElement).querySelector('button')!
  const code = input.value.trim()
  if (!code) return

  btn.disabled = true
  btn.textContent = 'Checking…'
  errorEl.hidden = true

  const valid = await verifyAdminPasscode(code)
  if (!valid) {
    errorEl.textContent = 'Invalid admin passcode.'
    errorEl.hidden = false
    btn.disabled = false
    btn.textContent = 'Enter'
    input.value = ''
    input.focus()
    return
  }

  adminCode = code
  await loadDashboard()
}

async function loadDashboard(): Promise<void> {
  getApp().innerHTML = '<div class="admin-loading">Loading dashboard&hellip;</div>'

  const [projects, excluded, votes, cfg] = await Promise.all([
    fetchIdeas(),
    fetchExcludedProjectIds(),
    fetchAllVotes(),
    getVotingConfig(adminCode),
  ])

  allProjects = projects
  excludedIds = excluded
  allVotes = votes
  config = cfg

  renderDashboard()
}

function renderDashboard(): void {
  getApp().innerHTML = `
    <div class="dashboard">
      <div class="dashboard__section" id="section-settings">
        <h2 class="dashboard__heading">Voting Settings</h2>
        ${renderSettings()}
      </div>
      <div class="dashboard__section" id="section-eligibility">
        <h2 class="dashboard__heading">Project Eligibility</h2>
        <p class="dashboard__desc">Toggle projects off the ballot. Ineligible projects won't appear to voters.</p>
        ${renderEligibility()}
      </div>
      <div class="dashboard__section" id="section-voters">
        <h2 class="dashboard__heading">Voter Roll Call</h2>
        ${renderVoterList()}
      </div>
      <div class="dashboard__section" id="section-results">
        <h2 class="dashboard__heading">Results by Category</h2>
        ${renderResults()}
      </div>
      <div class="dashboard__section" id="section-announce">
        <h2 class="dashboard__heading">Announce Winners</h2>
        <p class="dashboard__desc">Click "Announce" to write the winner to the main site. This is immediate.</p>
        ${renderAnnounce()}
      </div>
    </div>
  `
  bindSettings()
  bindEligibility()
  bindAnnounce()
}

// ── Settings ──

function renderSettings(): string {
  const isOpen = config.voting_open ?? false
  const passcode = config.vote_passcode ?? ''
  const dl = config.voting_deadline ?? ''

  return `
    <div class="settings-grid">
      <div class="settings-card">
        <h3>Voting Status</h3>
        <p class="settings-card__status ${isOpen ? 'settings-card__status--open' : ''}">
          ${isOpen ? 'OPEN' : 'CLOSED'}
        </p>
        <button class="settings-btn" id="toggle-voting-btn">
          ${isOpen ? 'Close Voting' : 'Open Voting'}
        </button>
      </div>
      <div class="settings-card">
        <h3>Deadline</h3>
        <form class="settings-inline" id="deadline-form">
          <input type="text" id="deadline-input" value="${esc(dl)}" placeholder="e.g. Friday March 7 at 5pm">
          <button type="submit" class="settings-btn">Set</button>
        </form>
      </div>
      <div class="settings-card">
        <h3>Vote Passcode</h3>
        <p class="settings-card__value">${esc(passcode)}</p>
        <form class="settings-inline" id="vote-passcode-form">
          <input type="text" id="new-vote-passcode" placeholder="New passcode">
          <button type="submit" class="settings-btn">Update</button>
        </form>
      </div>
      <div class="settings-card">
        <h3>Admin Passcode</h3>
        <form class="settings-inline" id="admin-passcode-form">
          <input type="password" id="new-admin-passcode" placeholder="New admin passcode">
          <button type="submit" class="settings-btn">Update</button>
        </form>
      </div>
    </div>
  `
}

function bindSettings(): void {
  document.getElementById('toggle-voting-btn')!.addEventListener('click', async () => {
    const btn = document.getElementById('toggle-voting-btn') as HTMLButtonElement
    btn.disabled = true
    const newState = !(config.voting_open ?? false)
    const ok = await toggleVoting(adminCode, newState)
    if (ok) {
      config = { ...config, voting_open: newState }
      await loadDashboard()
    } else {
      btn.disabled = false
      btn.textContent = 'Failed — try again'
    }
  })

  document.getElementById('deadline-form')!.addEventListener('submit', async (e) => {
    e.preventDefault()
    const input = document.getElementById('deadline-input') as HTMLInputElement
    await setVotingDeadline(adminCode, input.value.trim())
    await loadDashboard()
  })

  document.getElementById('vote-passcode-form')!.addEventListener('submit', async (e) => {
    e.preventDefault()
    const input = document.getElementById('new-vote-passcode') as HTMLInputElement
    const val = input.value.trim()
    if (!val) return
    await updateVotePasscode(adminCode, val)
    await loadDashboard()
  })

  document.getElementById('admin-passcode-form')!.addEventListener('submit', async (e) => {
    e.preventDefault()
    const input = document.getElementById('new-admin-passcode') as HTMLInputElement
    const val = input.value.trim()
    if (!val) return
    const ok = await updateAdminPasscode(adminCode, val)
    if (ok) {
      adminCode = val
      await loadDashboard()
    }
  })
}

// ── Eligibility ──

function renderEligibility(): string {
  const rows = allProjects.map(p => {
    const excluded = excludedIds.has(p.id)
    return `
      <div class="eligibility-row ${excluded ? 'eligibility-row--excluded' : ''}">
        <div class="eligibility-row__info">
          <span class="eligibility-row__title">${esc(p.title)}</span>
          <span class="eligibility-row__author">${esc(p.submitter)}</span>
        </div>
        <button class="eligibility-row__toggle"
                data-project-id="${esc(p.id)}"
                data-project-title="${esc(p.title)}"
                data-excluded="${excluded}">
          ${excluded ? 'Ineligible' : 'Eligible'}
        </button>
      </div>`
  }).join('')

  const eligible = allProjects.length - excludedIds.size
  return `
    <p class="dashboard__count">${eligible} eligible / ${allProjects.length} total</p>
    <div class="eligibility-list">${rows}</div>
  `
}

function bindEligibility(): void {
  document.querySelectorAll('.eligibility-row__toggle').forEach(btn => {
    btn.addEventListener('click', async () => {
      const el = btn as HTMLButtonElement
      el.disabled = true
      const pid = el.dataset.projectId!
      const ptitle = el.dataset.projectTitle!
      const currentlyExcluded = el.dataset.excluded === 'true'
      const ok = await toggleExclusion(adminCode, pid, ptitle, !currentlyExcluded)
      if (ok) {
        if (currentlyExcluded) {
          excludedIds.delete(pid)
        } else {
          excludedIds.add(pid)
        }
        const section = document.getElementById('section-eligibility')!
        section.querySelector('.dashboard__desc')!.insertAdjacentHTML('afterend', '')
        section.innerHTML = `<h2 class="dashboard__heading">Project Eligibility</h2>
          <p class="dashboard__desc">Toggle projects off the ballot. Ineligible projects won't appear to voters.</p>
          ${renderEligibility()}`
        bindEligibility()
      } else {
        el.disabled = false
        el.textContent = 'Error'
      }
    })
  })
}

// ── Voter List ──

function renderVoterList(): string {
  const voterNames = [...new Set(allVotes.map(v => v.voter_name))].sort()
  const count = voterNames.length
  const totalVotes = allVotes.length

  if (count === 0) {
    return '<p class="dashboard__empty">No votes cast yet.</p>'
  }

  const rows = voterNames.map(name => {
    const votes = allVotes.filter(v => v.voter_name === name)
    return `
      <div class="voter-row">
        <span class="voter-row__name">${esc(name)}</span>
        <span class="voter-row__count">${votes.length} of ${CATEGORIES.length} categories</span>
      </div>`
  }).join('')

  return `
    <p class="dashboard__count">${count} voters &middot; ${totalVotes} total votes</p>
    <div class="voter-list">${rows}</div>
  `
}

// ── Results ──

function renderResults(): string {
  const voterCount = new Set(allVotes.map(v => v.voter_name)).size

  if (allVotes.length === 0) {
    return '<p class="dashboard__empty">No votes to show yet.</p>'
  }

  const sections = CATEGORIES.map(cat => {
    const catVotes = allVotes.filter(v => v.category === cat.name)
    const tally = new Map<string, { title: string; id: string; voters: string[] }>()

    catVotes.forEach(v => {
      const key = v.project_title
      if (!tally.has(key)) {
        tally.set(key, { title: v.project_title, id: v.project_id ?? '', voters: [] })
      }
      tally.get(key)!.voters.push(v.voter_name)
    })

    const sorted = [...tally.values()].sort((a, b) => b.voters.length - a.voters.length)
    const topCount = sorted[0]?.voters.length ?? 0

    const rows = sorted.map(entry => {
      const pct = voterCount > 0 ? Math.round((entry.voters.length / voterCount) * 100) : 0
      const isTied = entry.voters.length === topCount && topCount > 0
      return `
        <div class="result-row ${isTied ? 'result-row--leader' : ''}">
          <div class="result-row__bar" style="width: ${pct}%"></div>
          <div class="result-row__content">
            <span class="result-row__title">${esc(entry.title)}</span>
            <span class="result-row__count">${entry.voters.length} vote${entry.voters.length !== 1 ? 's' : ''} (${pct}%)</span>
          </div>
          <div class="result-row__voters">${entry.voters.map(n => esc(n)).join(', ')}</div>
        </div>`
    }).join('')

    return `
      <div class="result-category">
        <h3 class="result-category__name">${esc(cat.name)}</h3>
        <p class="result-category__total">${catVotes.length} votes</p>
        <div class="result-list">${rows || '<p class="dashboard__empty">No votes in this category.</p>'}</div>
      </div>`
  }).join('')

  return `
    <p class="dashboard__count">${voterCount} voters across ${CATEGORIES.length} categories</p>
    ${sections}
  `
}

// ── Announce Winners ──

function renderAnnounce(): string {
  const sections = CATEGORIES.map(cat => {
    const catVotes = allVotes.filter(v => v.category === cat.name)
    const tally = new Map<string, { title: string; id: string; submitter: string; voters: string[]; url: string }>()

    catVotes.forEach(v => {
      const key = v.project_title
      if (!tally.has(key)) {
        const project = allProjects.find(p => p.id === v.project_id)
        tally.set(key, {
          title: v.project_title,
          id: v.project_id ?? '',
          submitter: project?.submitter ?? 'Unknown',
          voters: [],
          url: project?.project_url ?? '',
        })
      }
      tally.get(key)!.voters.push(v.voter_name)
    })

    const sorted = [...tally.values()].sort((a, b) => b.voters.length - a.voters.length)
    const topCount = sorted[0]?.voters.length ?? 0
    const leaders = sorted.filter(e => e.voters.length === topCount && topCount > 0)

    if (leaders.length === 0) {
      return `
        <div class="announce-category">
          <h3>${esc(cat.name)}</h3>
          <p class="dashboard__empty">No votes yet.</p>
        </div>`
    }

    const leaderHtml = leaders.map(l => `
      <div class="announce-leader">
        <div class="announce-leader__info">
          <strong>${esc(l.title)}</strong> by ${esc(l.submitter)} &mdash; ${l.voters.length} vote${l.voters.length !== 1 ? 's' : ''}
        </div>
        <button class="announce-btn"
                data-category="${esc(cat.name)}"
                data-winner="${esc(l.submitter)}"
                data-project="${esc(l.title)}"
                data-url="${esc(l.url)}">
          Announce Winner
        </button>
      </div>`).join('')

    return `
      <div class="announce-category">
        <h3>${esc(cat.name)}</h3>
        ${leaders.length > 1 ? `<p class="announce-tie">Tie! Both can be announced.</p>` : ''}
        ${leaderHtml}
      </div>`
  }).join('')

  return sections
}

function bindAnnounce(): void {
  document.querySelectorAll('.announce-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const el = btn as HTMLButtonElement
      const category = el.dataset.category!
      const winner = el.dataset.winner!
      const project = el.dataset.project!
      const url = el.dataset.url!

      el.disabled = true
      el.textContent = 'Announcing…'

      const ok = await announceWinner(adminCode, category, winner, project, url)
      if (ok) {
        el.textContent = 'Announced!'
        el.classList.add('announce-btn--done')
      } else {
        el.disabled = false
        el.textContent = 'Failed — try again'
      }
    })
  })
}

function esc(str: string): string {
  const el = document.createElement('span')
  el.textContent = str
  return el.innerHTML
}
