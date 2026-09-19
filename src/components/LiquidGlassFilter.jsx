export default function LiquidGlassFilter() {
  return <svg className="liquid-glass-definitions" aria-hidden="true" width="0" height="0">
    <defs>
      <filter id="frosted" primitiveUnits="objectBoundingBox" colorInterpolationFilters="sRGB">
        <feImage href="/assets/frosted-displacement-map.png" x="0" y="0" width="1" height="1" preserveAspectRatio="none" result="map" />
        <feGaussianBlur in="SourceGraphic" stdDeviation="0.02" result="blur" />
        <feDisplacementMap in="blur" in2="map" scale="1" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>;
}
