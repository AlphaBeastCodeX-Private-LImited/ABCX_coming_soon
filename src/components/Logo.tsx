type LogoProps = {
  className?: string
}

/** Renders the supplied ABCX logo file without altering it. */
export function Logo({ className = '' }: LogoProps) {
  return (
    <picture>
      <source srcSet="/abcx-logo-small.webp" media="(max-width: 640px)" type="image/webp" />
      <source srcSet="/abcx-logo.webp" type="image/webp" />
      <img
        className={className}
        src="/abcx-logo.png"
        alt="ABCX logo"
        width="1254"
        height="1254"
        loading="eager"
        fetchPriority="high"
        draggable="false"
      />
    </picture>
  )
}
