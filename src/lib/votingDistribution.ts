import type { Meeting, Premise } from '../types/meeting'

export type VotingTileStatus = 'voted_online' | 'paper_entered' | 'refused' | 'undecided'

export interface VotingTileMeta {
  status: VotingTileStatus
  /** human-readable refusal reason when status === 'refused' */
  refusalReason?: string
  /** date of online vote when status === 'voted_online' */
  votedAt?: string
}

/**
 * Deterministic distribution of voting tile statuses for the demo.
 *
 * Distribution targets:
 *   - voting_active (early phase):
 *     21 green (online), 2 beige (paper), 3 pink (refused), rest white.
 *   - voting_active_low_quorum (late phase):
 *     21 green (online), 4 beige (paper), 3 pink (refused), rest white.
 *
 * The seed is the premise number — same input always produces same output across renders.
 * Paper ballots actually registered in meeting.voteResults.paperBallots OVERRIDE the
 * deterministic assignment (so the user can convert a white tile to beige live).
 */
export function buildVotingMap(meeting: Meeting): Map<string, VotingTileMeta> {
  const map = new Map<string, VotingTileMeta>()
  const isLowQuorum = meeting._demoVariant === 'voting_active_low_quorum'

  // Hand-picked premise numbers for stable demo screenshots.
  // Green = first 21 apartment numbers in ascending order excluding the chosen beige/pink ones.
  // Pink: 14, 22, 78.
  const pinkNumbers = new Set(['14', '22', '78'])
  // Beige (early): 17, 33. Late: 17, 33, 26, 30 — keeping within the 30-apartment demo set.
  const beigeNumbers = new Set(isLowQuorum ? ['17', '33', '26', '30'] : ['17', '33'])

  const apartments = meeting.premises
    .filter((p) => p.type === 'apartment')
    .sort((a, b) => Number(a.number) - Number(b.number))

  // pick green: first 21 apt that are NOT in pink or beige sets
  const greens: string[] = []
  for (const p of apartments) {
    if (pinkNumbers.has(p.number) || beigeNumbers.has(p.number)) continue
    if (greens.length >= 21) break
    greens.push(p.number)
  }
  const greenSet = new Set(greens)

  for (const p of apartments) {
    if (pinkNumbers.has(p.number)) {
      map.set(p.id, {
        status: 'refused',
        refusalReason:
          p.number === '14'
            ? 'нет аккаунта на Госуслугах'
            : p.number === '22'
              ? 'отказался от участия'
              : 'нет аккаунта на Госуслугах',
      })
    } else if (beigeNumbers.has(p.number)) {
      map.set(p.id, { status: 'paper_entered' })
    } else if (greenSet.has(p.number)) {
      // varying minute offsets to feel realistic
      const minutes = 10 + (Number(p.number) % 50)
      map.set(p.id, {
        status: 'voted_online',
        votedAt: `14.06.2026 в 14:${String(minutes).padStart(2, '0')}`,
      })
    } else {
      map.set(p.id, { status: 'undecided' })
    }
  }

  // non-residential premises: leave undecided
  for (const p of meeting.premises) {
    if (p.type === 'non_residential' && !map.has(p.id)) {
      map.set(p.id, { status: 'undecided' })
    }
  }

  // Override with actually-registered paper ballots (user added them via M1)
  for (const ballot of meeting.voteResults.paperBallots) {
    map.set(ballot.premiseId, { status: 'paper_entered' })
  }

  return map
}

export function countByStatus(map: Map<string, VotingTileMeta>): Record<VotingTileStatus, number> {
  const counts: Record<VotingTileStatus, number> = {
    voted_online: 0,
    paper_entered: 0,
    refused: 0,
    undecided: 0,
  }
  for (const meta of map.values()) {
    counts[meta.status]++
  }
  return counts
}

export function getTileMeta(
  map: Map<string, VotingTileMeta>,
  premise: Premise,
): VotingTileMeta {
  return map.get(premise.id) ?? { status: 'undecided' }
}
