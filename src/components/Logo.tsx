type LogoProps = {
  className?: string
}

/** Renders the supplied ABCX logo file without altering it. */
export function Logo({ className = '' }: LogoProps) {
  return (
    <img
      className={className}
      src="/abcx-logo.png"
      alt="AlphaBeastCodeX Private Limited logo"
      draggable="false"
    />
  )
}
