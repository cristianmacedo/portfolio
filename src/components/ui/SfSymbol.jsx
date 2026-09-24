export default function SfSymbol({ name, className = '', label }) {
  const extension = name === 'doc.on.doc' ? 'png' : 'svg';
  return <span
    className={`sf-symbol ${className}`.trim()}
    style={{ '--sf-symbol-image': `url("${import.meta.env.BASE_URL}assets/sf-symbols/${name}.${extension}")` }}
    role={label ? 'img' : undefined}
    aria-label={label}
    aria-hidden={label ? undefined : 'true'}
  />;
}
