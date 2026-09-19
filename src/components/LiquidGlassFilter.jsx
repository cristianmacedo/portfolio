export default function LiquidGlassFilter() {
  return <svg className="liquid-glass-definitions" aria-hidden="true" width="0" height="0">
    <defs>
      <filter id="frosted" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.028" numOctaves="1" seed="8" result="noise" />
        <feGaussianBlur in="noise" stdDeviation="1.1" result="softNoise" />
        <feDisplacementMap in="SourceGraphic" in2="softNoise" scale="7" xChannelSelector="R" yChannelSelector="G" result="refracted" />
        <feGaussianBlur in="refracted" stdDeviation="0.25" />
      </filter>
    </defs>
  </svg>;
}
