import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { Loader2, MapPin, Search } from 'lucide-react'
import type { PlaceSuggestion } from '../../services/geocoding'

interface LocationSearchFieldProps {
  label: string
  placeholder: string
  value: string
  onChange: (text: string) => void
  suggestions: PlaceSuggestion[]
  isLoading: boolean
  /** Whether tapping the map currently sets this field, mirrored from the parent. */
  isActive: boolean
  onFocus: () => void
  onSelect: (suggestion: PlaceSuggestion) => void
  /** The point actually in effect for this field, shown so a snapped location stays visible. */
  coordinateHint: string | null
}

/**
 * A text field with type-ahead suggestions, built as an ARIA combobox: typing
 * searches, arrow keys move through results, Enter picks the highlighted one,
 * Escape closes the list. Tapping the map is still the other way to set this
 * field - focusing the input marks it as the map's current target, exactly as
 * the old tap-only control did.
 */
export default function LocationSearchField({
  label,
  placeholder,
  value,
  onChange,
  suggestions,
  isLoading,
  isActive,
  onFocus,
  onSelect,
  coordinateHint,
}: LocationSearchFieldProps) {
  const inputId = useId()
  const listId = `${inputId}-listbox`
  const containerRef = useRef<HTMLDivElement>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)

  // Reset the highlighted option whenever the suggestion list changes underneath it.
  useEffect(() => {
    setHighlighted(-1)
  }, [suggestions])

  // A click anywhere outside this field closes its dropdown.
  useEffect(() => {
    if (!isOpen) return
    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [isOpen])

  const choose = (suggestion: PlaceSuggestion) => {
    onSelect(suggestion)
    setIsOpen(false)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    // `event.code` is checked alongside `event.key`: some input paths (IME
    // composition, certain assistive tools) report `key: "Unidentified"` for
    // Enter while `code` still correctly says "Enter".
    const isEnter = event.key === 'Enter' || event.code === 'Enter' || event.code === 'NumpadEnter'
    const isEscape = event.key === 'Escape' || event.code === 'Escape'
    const isArrowDown = event.key === 'ArrowDown' || event.code === 'ArrowDown'
    const isArrowUp = event.key === 'ArrowUp' || event.code === 'ArrowUp'

    if (isEscape) {
      setIsOpen(false)
      return
    }
    if (suggestions.length === 0) return

    if (isArrowDown) {
      event.preventDefault()
      setIsOpen(true)
      setHighlighted((current) => (current + 1) % suggestions.length)
    } else if (isArrowUp) {
      event.preventDefault()
      setIsOpen(true)
      setHighlighted((current) => (current <= 0 ? suggestions.length - 1 : current - 1))
    } else if (isEnter && isOpen && highlighted >= 0) {
      event.preventDefault()
      choose(suggestions[highlighted])
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={inputId} className="text-xs font-medium text-slate-500">
          {label}
        </label>
        {isActive && <span className="text-xs font-medium text-blue-700">Type, or tap the map</span>}
      </div>

      <div
        className={`mt-1 flex items-center gap-2 rounded-md border px-3 py-2 ${
          isActive ? 'border-blue-600 bg-blue-50' : 'border-slate-300 bg-white'
        }`}
      >
        <Search className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
        <input
          id={inputId}
          type="text"
          role="combobox"
          aria-expanded={isOpen && suggestions.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={highlighted >= 0 ? `${listId}-${highlighted}` : undefined}
          autoComplete="off"
          value={value}
          placeholder={placeholder}
          onFocus={() => {
            onFocus()
            if (suggestions.length > 0) setIsOpen(true)
          }}
          onChange={(event) => {
            onChange(event.target.value)
            setIsOpen(true)
          }}
          onKeyDown={handleKeyDown}
          className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
        />
        {isLoading && (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-slate-400" aria-hidden="true" />
        )}
      </div>

      {coordinateHint && <p className="tabular mt-1 text-xs text-slate-500">{coordinateHint}</p>}

      {isOpen && suggestions.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          aria-label={`${label} suggestions`}
          className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg"
        >
          {suggestions.map((suggestion, index) => (
            <li key={suggestion.id} id={`${listId}-${index}`} role="option" aria-selected={index === highlighted}>
              <button
                type="button"
                // Fires before the input's blur, so focus never leaves the field first.
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(suggestion)}
                className={`flex w-full items-start gap-2 px-3 py-2 text-left text-sm ${
                  index === highlighted ? 'bg-slate-100' : 'hover:bg-slate-50'
                }`}
              >
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block truncate font-medium text-slate-900">{suggestion.label}</span>
                  {suggestion.sublabel && (
                    <span className="block truncate text-xs text-slate-500">{suggestion.sublabel}</span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
