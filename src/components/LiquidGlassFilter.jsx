export default function LiquidGlassFilter() {
  return <svg className="liquid-glass-definitions" aria-hidden="true" width="0" height="0">
    <defs>
      <filter id="liquid-glass-filter" x="0%" y="0%" width="100%" height="100%" primitiveUnits="objectBoundingBox" colorInterpolationFilters="sRGB">
        <feGaussianBlur in="SourceGraphic" stdDeviation="0.018" result="blurred_source" />
        <feImage href="/assets/frosted-displacement-map.png" x="0" y="0" width="1" height="1" preserveAspectRatio="none" result="disp_map" />
        <feDisplacementMap in="blurred_source" in2="disp_map" scale="1.1" xChannelSelector="R" yChannelSelector="G" result="displaced" />
        <feColorMatrix in="displaced" type="saturate" values="1.18" result="displaced_sat" />
        <feImage href="/assets/glass-specular.svg" x="0" y="0" width="1" height="1" preserveAspectRatio="none" result="spec_layer" />
        <feComposite in="displaced_sat" in2="spec_layer" operator="in" result="spec_masked" />
        <feComponentTransfer in="spec_layer" result="spec_faded">
          <feFuncA type="linear" slope="0.34" />
        </feComponentTransfer>
        <feBlend in="spec_masked" in2="displaced" mode="normal" result="with_sat" />
        <feBlend in="spec_faded" in2="with_sat" mode="normal" />
      </filter>
    </defs>
  </svg>;
}
