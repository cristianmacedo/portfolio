export default function BrandIcon({ name, label }) {
  return <span
    className={`brand-icon brand-icon-${name}`}
    style={{ '--brand-icon-image': `url("${import.meta.env.BASE_URL}assets/${name}.svg")` }}
    role={label ? 'img' : undefined}
    aria-label={label}
    aria-hidden={label ? undefined : 'true'}
  />;
}
