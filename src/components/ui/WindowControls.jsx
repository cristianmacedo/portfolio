function Light({ color, children }) {
  return <svg viewBox="0 0 14 14" aria-hidden="true" className="window-light">
    <circle cx="7" cy="7" r="6.75" fill={color} stroke="#000" strokeOpacity=".16" strokeWidth=".5"/>
    <g className="window-light-symbol">{children}</g>
  </svg>;
}

export default function WindowControls({ label, onClose }) {
  return <div className="window-controls" onPointerDown={event => event.stopPropagation()}>
    <button type="button" aria-label={label} onClick={onClose}>
      <Light color="#ff6058"><path d="m4.5 4.5 5 5m0-5-5 5" stroke="#790e08" strokeWidth="2" strokeLinecap="round"/></Light>
    </button>
    <span aria-hidden="true"><Light color="#ffbe2f"><path d="M4 7h6" stroke="#995600" strokeWidth="2" strokeLinecap="round"/></Light></span>
    <span aria-hidden="true"><Light color="#28c840"><path d="M4 4h5L4 9zm6 6H5l5-5z" fill="#075d12"/></Light></span>
  </div>;
}
