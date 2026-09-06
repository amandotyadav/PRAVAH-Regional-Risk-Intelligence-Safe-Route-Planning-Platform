import type { RiskInputsSummary, RiskState } from '../types'

export interface RiskPresentation {
  /** Plain-language name shown to users. */
  label: string
  /** Text colour for the label. */
  text: string
  /** Background used by badges. */
  bg: string
  border: string
  /** Line colour used on the map. */
  stroke: string
}

/**
 * Semantic colours only. LOW green, MODERATE amber, HIGH orange, CRITICAL red.
 * These are never used for decoration elsewhere in the interface.
 */
export const RISK_PRESENTATION: Record<RiskState, RiskPresentation> = {
  LOW: {
    label: 'Low risk',
    text: 'text-green-800',
    bg: 'bg-green-50',
    border: 'border-green-300',
    stroke: '#15803d',
  },
  MODERATE: {
    label: 'Moderate risk',
    text: 'text-amber-800',
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    stroke: '#b45309',
  },
  HIGH: {
    label: 'High risk',
    text: 'text-orange-800',
    bg: 'bg-orange-50',
    border: 'border-orange-300',
    stroke: '#c2410c',
  },
  CRITICAL: {
    label: 'Critical risk',
    text: 'text-red-800',
    bg: 'bg-red-50',
    border: 'border-red-300',
    stroke: '#b91c1c',
  },
  UNKNOWN: {
    label: 'Not assessed',
    text: 'text-slate-700',
    bg: 'bg-slate-100',
    border: 'border-slate-300',
    stroke: '#94a3b8',
  },
}

/** Order used for summaries and legends: most serious first. */
export const RISK_STATES: RiskState[] = ['CRITICAL', 'HIGH', 'MODERATE', 'LOW', 'UNKNOWN']

export function riskPresentation(state: RiskState): RiskPresentation {
  return RISK_PRESENTATION[state] ?? RISK_PRESENTATION.UNKNOWN
}

/**
 * The backend gives a road segment an authoritative `state`, which the interface
 * always shows as-is. A recommended route, however, only carries an average
 * score, so this banding mirrors the exact thresholds the backend itself uses in
 * app/services/risk/risk_engine.py (> 0.8 high, > 0.5 moderate, otherwise low).
 * It is used for routes only - never to override a segment's own state.
 */
export function bandRouteScore(score: number): RiskState {
  if (score > 0.8) return 'HIGH'
  if (score > 0.5) return 'MODERATE'
  return 'LOW'
}

/** Percentage string for a 0-1 probability, e.g. 0.35 -> "35%". */
export function asPercent(value: number): string {
  return `${Math.round(value * 100)}%`
}

/**
 * The risk engine returns exactly one of four `inputs_summary` shapes.
 * These guards let the detail panel explain *why* a road is rated as it is.
 */
export function hasPrediction(
  summary: RiskInputsSummary,
): summary is Extract<RiskInputsSummary, { prediction: unknown }> {
  return 'prediction' in summary
}

export function hasVerifiedIncident(
  summary: RiskInputsSummary,
): summary is Extract<RiskInputsSummary, { incident: unknown }> {
  return 'incident' in summary
}

export function hasUnverifiedIncident(
  summary: RiskInputsSummary,
): summary is Extract<RiskInputsSummary, { unverified_incident: unknown }> {
  return 'unverified_incident' in summary
}
