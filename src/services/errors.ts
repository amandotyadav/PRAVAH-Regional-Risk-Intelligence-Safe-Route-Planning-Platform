import { AxiosError } from 'axios'

/** Shape of the JSON body produced by app/core/exceptions.py */
interface BackendErrorBody {
  detail?: unknown
  status_code?: number
  path?: string
}

interface ValidationIssue {
  loc?: unknown[]
  msg?: string
  type?: string
}

function isValidationIssueList(value: unknown): value is ValidationIssue[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'object' && item !== null)
}

/**
 * Turn any thrown value into a sentence a non-technical user can act on.
 * Raw Axios messages, status codes and stack traces never reach the screen.
 */
export function toUserMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (!(error instanceof AxiosError)) {
    return fallback
  }

  if (error.code === 'ECONNABORTED') {
    return 'The service took too long to respond. Please try again.'
  }

  if (!error.response) {
    return 'Could not reach the PRAVAH service. Check that the backend is running and try again.'
  }

  const status = error.response.status
  const body = error.response.data as BackendErrorBody | undefined
  const detail = body?.detail

  if (typeof detail === 'string' && detail.trim() !== '' && detail !== 'Internal server error') {
    return detail
  }

  if (isValidationIssueList(detail)) {
    const first = detail[0]
    if (first && typeof first.msg === 'string') {
      const field = Array.isArray(first.loc) ? String(first.loc[first.loc.length - 1]) : null
      return field ? `Please check the "${field}" field: ${first.msg}.` : first.msg
    }
    return 'Some of the details provided were not accepted. Please review the form and try again.'
  }

  switch (status) {
    case 400:
      return 'The request could not be processed. Please review the details and try again.'
    case 401:
      return 'Your session has expired. Please sign in again.'
    case 403:
      return 'You do not have permission to do this.'
    case 404:
      return 'The information requested is not available.'
    case 422:
      return 'Some of the details provided were not accepted. Please review the form and try again.'
    case 503:
      return 'The service is temporarily unavailable. Please try again shortly.'
    default:
      return status >= 500
        ? 'The service is currently unavailable. Please try again shortly.'
        : fallback
  }
}

/** True when the backend answered 404 (used to tell "no route" apart from a failure). */
export function isNotFound(error: unknown): boolean {
  return error instanceof AxiosError && error.response?.status === 404
}
