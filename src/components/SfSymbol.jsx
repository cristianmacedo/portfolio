export default function SfSymbol({ name, className = '', label }) {
  return <span
    className={`sf-symbol ${className}`.trim()}
    style={{ '--sf-symbol-image': `url("${import.meta.env.BASE_URL}assets/sf-symbols/${name}.png")` }}
    role={label ? 'img' : undefined}
    aria-label={label}
    aria-hidden={label ? undefined : 'true'}
  />;
}
