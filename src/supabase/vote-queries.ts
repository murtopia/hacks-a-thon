import { hacksathon } from './hacksathon-client'

export interface VotePasscodeResult {
  valid: boolean
  voting_open: boolean
  deadline: string | null
}

export interface VotingConfigResult {
  valid: boolean
  voting_open?: boolean
  vote_passcode?: string
  voting_deadline?: string | null
}

export interface VoteRecord {
  id: string
  voter_name: string
  category: string
  project_title: string
  project_id: string | null
  created_at: string
}

export interface VoteSelection {
  category: string
  projectTitle: string
  projectId: string
}

export async function verifyVotePasscode(code: string): Promise<VotePasscodeResult> {
  if (!hacksathon) return { valid: false, voting_open: false, deadline: null }
  const { data, error } = await hacksathon.rpc('verify_vote_passcode', { code })
  if (error) {
    console.warn('Failed to verify passcode:', error.message)
    return { valid: false, voting_open: false, deadline: null }
  }
  return data as VotePasscodeResult
}

export async function verifyAdminPasscode(code: string): Promise<boolean> {
  if (!hacksathon) return false
  const { data, error } = await hacksathon.rpc('verify_admin_passcode', { code })
  if (error) return false
  return data === true
}

export async function getVotingConfig(adminCode: string): Promise<VotingConfigResult> {
  if (!hacksathon) return { valid: false }
  const { data, error } = await hacksathon.rpc('get_voting_config', { admin_code: adminCode })
  if (error) return { valid: false }
  return data as VotingConfigResult
}

export async function fetchExcludedProjectIds(): Promise<Set<string>> {
  if (!hacksathon) return new Set()
  const { data, error } = await hacksathon.from('excluded_projects').select('project_id')
  if (error) return new Set()
  return new Set((data ?? []).map((r: { project_id: string }) => r.project_id))
}

export async function fetchVotesForVoter(voterName: string): Promise<VoteRecord[]> {
  if (!hacksathon) return []
  const { data, error } = await hacksathon
    .from('votes')
    .select('*')
    .eq('voter_name', voterName)
  if (error) return []
  return data ?? []
}

export async function fetchAllVotes(): Promise<VoteRecord[]> {
  if (!hacksathon) return []
  const { data, error } = await hacksathon
    .from('votes')
    .select('*')
    .order('created_at')
  if (error) return []
  return data ?? []
}

export async function upsertVotes(voterName: string, selections: VoteSelection[]): Promise<boolean> {
  if (!hacksathon) return false
  const rows = selections.map(s => ({
    voter_name: voterName,
    category: s.category,
    project_title: s.projectTitle,
    project_id: s.projectId,
  }))
  const { error } = await hacksathon
    .from('votes')
    .upsert(rows, { onConflict: 'voter_name,category' })
  if (error) {
    console.warn('Failed to upsert votes:', error.message)
    return false
  }
  return true
}

export async function toggleExclusion(
  adminCode: string,
  projectId: string,
  projectTitle: string,
  exclude: boolean
): Promise<boolean> {
  if (!hacksathon) return false
  const { data, error } = await hacksathon.rpc('toggle_exclusion', {
    admin_code: adminCode,
    p_project_id: projectId,
    p_project_title: projectTitle,
    p_exclude: exclude,
  })
  if (error) return false
  return data === true
}

export async function toggleVoting(adminCode: string, isOpen: boolean): Promise<boolean> {
  if (!hacksathon) return false
  const { data, error } = await hacksathon.rpc('toggle_voting', {
    admin_code: adminCode,
    is_open: isOpen,
  })
  if (error) return false
  return data === true
}

export async function setVotingDeadline(adminCode: string, deadline: string): Promise<boolean> {
  if (!hacksathon) return false
  const { data, error } = await hacksathon.rpc('set_voting_deadline', {
    admin_code: adminCode,
    deadline,
  })
  if (error) return false
  return data === true
}

export async function updateVotePasscode(adminCode: string, newPasscode: string): Promise<boolean> {
  if (!hacksathon) return false
  const { data, error } = await hacksathon.rpc('update_vote_passcode', {
    admin_code: adminCode,
    new_passcode: newPasscode,
  })
  if (error) return false
  return data === true
}

export async function updateAdminPasscode(adminCode: string, newPasscode: string): Promise<boolean> {
  if (!hacksathon) return false
  const { data, error } = await hacksathon.rpc('update_admin_passcode', {
    admin_code: adminCode,
    new_passcode: newPasscode,
  })
  if (error) return false
  return data === true
}

export async function announceWinner(
  adminCode: string,
  categoryName: string,
  winnerName: string,
  projectTitle: string,
  projectUrl: string
): Promise<boolean> {
  if (!hacksathon) return false
  const { data, error } = await hacksathon.rpc('announce_winner', {
    admin_code: adminCode,
    category_name: categoryName,
    winner: winnerName,
    project: projectTitle,
    url: projectUrl,
  })
  if (error) return false
  return data === true
}
