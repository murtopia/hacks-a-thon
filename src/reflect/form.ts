import {
  verifyReflectPasscode,
  fetchReflectionsByParticipant,
  submitReflections,
  type ReflectionRecord,
} from '../supabase/vote-queries'
import { REFLECTION_QUESTIONS } from '../shared/questions'

let participantName = ''
const answers = new Map<string, string>()

function getApp(): HTMLElement {
  return document.getElementById('reflect-app')!
}

export function initReflectForm(): void {
  participantName = localStorage.getItem('hacky_reflect_name') ?? ''
  renderGate()
}

function renderGate(): void {
  getApp().innerHTML = `
    <div class="rgate">
      <h1 class="rgate__title">Share Your Reflections</h1>
      <p class="rgate__subtitle">The Seven2 Hacks-a-Thon</p>
      <form class="rgate__form" id="rgate-form">
        <div class="rgate__field">
          <label for="participant-name">Your Name</label>
          <input type="text" id="participant-name" placeholder="First Last" value="${escapeHtml(participantName)}" required autocomplete="name">
        </div>
        <div class="rgate__field">
          <label for="reflect-code">Passcode</label>
          <input type="text" id="reflect-code" placeholder="Enter the passcode" required autocomplete="off">
        </div>
        <button type="submit" class="rgate__submit">Enter</button>
        <p class="rgate__error" id="rgate-error" hidden></p>
      </form>
    </div>
  `
  document.getElementById('rgate-form')!.addEventListener('submit', handleGateSubmit)
}

async function handleGateSubmit(e: Event): Promise<void> {
  e.preventDefault()
  const nameInput = document.getElementById('participant-name') as HTMLInputElement
  const codeInput = document.getElementById('reflect-code') as HTMLInputElement
  const errorEl = document.getElementById('rgate-error')!
  const btn = (e.target as HTMLFormElement).querySelector('button')!

  const name = nameInput.value.trim()
  const code = codeInput.value.trim()
  if (!name || !code) return

  btn.disabled = true
  btn.textContent = 'Checking…'
  errorEl.hidden = true

  const result = await verifyReflectPasscode(code)
  if (!result.valid) {
    errorEl.textContent = 'Wrong passcode. Try again.'
    errorEl.hidden = false
    btn.disabled = false
    btn.textContent = 'Enter'
    codeInput.value = ''
    codeInput.focus()
    return
  }

  participantName = name
  localStorage.setItem('hacky_reflect_name', participantName)
  await loadForm()
}

async function loadForm(): Promise<void> {
  getApp().innerHTML = '<div class="reflect-loading">Loading your reflections&hellip;</div>'

  const existing = await fetchReflectionsByParticipant(participantName)
  existing.forEach((r: ReflectionRecord) => {
    answers.set(r.question, r.answer)
  })

  renderForm()
}

function renderForm(): void {
  const questionsHtml = REFLECTION_QUESTIONS.map((q, i) => {
    const num = String(i + 1).padStart(2, '0')
    const existing = answers.get(q) ?? ''
    return `
      <div class="rform-question">
        <label class="rform-question__label" for="q-${i}">
          <span class="rform-question__num">${num}</span>
          ${escapeHtml(q)}
        </label>
        <textarea class="rform-question__input"
                  id="q-${i}"
                  data-question="${escapeAttr(q)}"
                  rows="3"
                  placeholder="Your answer…">${escapeHtml(existing)}</textarea>
      </div>`
  }).join('')

  getApp().innerHTML = `
    <div class="rform">
      <div class="rform__header">
        <h1 class="rform__title">Your Reflections</h1>
        <p class="rform__participant">Responding as <strong>${escapeHtml(participantName)}</strong></p>
      </div>
      <div class="rform__questions">
        ${questionsHtml}
      </div>
      <div class="rform__footer">
        <button type="button" class="rform__submit" id="submit-reflections">Submit Reflections</button>
        <p class="rform__hint">You can come back and update your answers anytime.</p>
      </div>
    </div>
  `

  document.getElementById('submit-reflections')!.addEventListener('click', handleSubmit)
}

async function handleSubmit(): Promise<void> {
  const btn = document.getElementById('submit-reflections') as HTMLButtonElement
  btn.disabled = true
  btn.textContent = 'Submitting…'

  const payload: { question: string; answer: string }[] = []
  document.querySelectorAll<HTMLTextAreaElement>('.rform-question__input').forEach(textarea => {
    const question = textarea.dataset.question!
    const answer = textarea.value.trim()
    if (answer) {
      payload.push({ question, answer })
      answers.set(question, answer)
    }
  })

  if (payload.length === 0) {
    btn.disabled = false
    btn.textContent = 'Please answer at least one question'
    setTimeout(() => { btn.textContent = 'Submit Reflections' }, 2000)
    return
  }

  const ok = await submitReflections(participantName, payload)
  if (!ok) {
    btn.disabled = false
    btn.textContent = 'Something went wrong — try again'
    return
  }

  renderConfirmation()
}

function renderConfirmation(): void {
  const summaryHtml = REFLECTION_QUESTIONS.map((q, i) => {
    const num = String(i + 1).padStart(2, '0')
    const answer = answers.get(q)
    if (!answer) return ''
    return `
      <div class="rconfirm-answer">
        <p class="rconfirm-answer__question"><span class="rconfirm-answer__num">${num}</span> ${escapeHtml(q)}</p>
        <p class="rconfirm-answer__text">${escapeHtml(answer)}</p>
      </div>`
  }).join('')

  getApp().innerHTML = `
    <div class="rconfirm">
      <h1 class="rconfirm__title">Reflections Submitted</h1>
      <p class="rconfirm__subtitle">Thanks, ${escapeHtml(participantName)}!</p>
      <div class="rconfirm__summary">
        ${summaryHtml}
      </div>
      <div class="rconfirm__actions">
        <button type="button" class="rconfirm__edit" id="edit-reflections">Edit My Answers</button>
        <a href="/" class="rconfirm__back">Back to site &rarr;</a>
      </div>
    </div>
  `
  document.getElementById('edit-reflections')!.addEventListener('click', renderForm)
}

function escapeHtml(str: string): string {
  const el = document.createElement('span')
  el.textContent = str
  return el.innerHTML
}

function escapeAttr(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
