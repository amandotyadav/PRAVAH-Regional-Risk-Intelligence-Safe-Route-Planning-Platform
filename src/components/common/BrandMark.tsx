interface BrandMarkProps {
  size?: number
  className?: string
}

/**
 * The PRAVAH mark: a map pin, since every part of the product - road
 * conditions, routes, incidents - is about a place on a map. Matches
 * `public/favicon.svg`; keep the two in sync if either changes.
 */
export default function BrandMark({ size = 28, className = '' }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      role="img"
      aria-label="PRAVAH"
    >
      <rect width="32" height="32" rx="7" fill="#0f172a" />
      <path
        d="M23 13.6c0 6.2-7 11.6-7 11.6s-7-5.4-7-11.6a7 7 0 0 1 14 0z"
        fill="#ffffff"
      />
      <circle cx="16" cy="13.6" r="3.1" fill="#15803d" />
    </svg>
  )
}
