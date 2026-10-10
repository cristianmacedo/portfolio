import { useEffect, useRef } from "react";
import SfSymbol from "../ui/SfSymbol";

export default function DetailDialog({ language, open, onClose }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  const content = language === "pt" ? {
    eyebrow: "EXPERIÊNCIA EM DESTAQUE / MERCADO LIVRE", title: "Produto, plataforma e liderança técnica.", copy: "Lidero o desenvolvimento frontend de uma plataforma interna de gestão fiscal que suporta mais de US$ 3 bilhões em operações fiscais mensais no Brasil e na Argentina. O trabalho passa por arquitetura frontend, contratos de API, fundações compartilhadas e serviços de backend em Go.", heading: "Onde contribuo", bullets: ["Liderança técnica: guio decisões, qualidade de código e mentoria no time de frontend.", "Fundações compartilhadas: criei estruturas de interface e autorização adotadas por vários times.", "Migrações: liderei a evolução de microfrontends e a transição para o novo sistema interno de autenticação.", "IA aplicada: construí um repositório interno de plugins para skills e integrações que ajudou a acelerar em 50% a capacidade central de declaração fiscal no segundo trimestre de 2026."]
  } : {
    eyebrow: "SELECTED EXPERIENCE / MERCADO LIVRE", title: "Product, platform, and technical leadership.", copy: "I lead frontend development for an internal tax management platform that supports more than $3B in monthly fiscal operations across Brazil and Argentina. The work spans frontend architecture, API contracts, shared foundations, and backend services in Go.", heading: "Where I contribute", bullets: ["Technical leadership: guide decisions, code quality, and mentoring across the frontend team.", "Shared foundations: created interface and authorization foundations adopted by multiple teams.", "Migrations: led the evolution of microfrontends and the transition to Mercado Livre’s new internal authentication system.", "Applied AI: built an internal plugin repository for reusable skills and integrations that helped accelerate the core tax-declaration capability by 50% in Q2 2026."]
  };
  return <dialog ref={dialogRef} onClose={onClose} onClick={(event) => { if (event.target === dialogRef.current) onClose(); }}>
    <button className="close" aria-label="Close details" onClick={onClose}><SfSymbol name="xmark" /></button>
    <div><span className="eyebrow">{content.eyebrow}</span><h2>{content.title}</h2><p>{content.copy}</p><h3>{content.heading}</h3><ul>{content.bullets.map((item) => <li key={item}>{item}</li>)}</ul><p className="eyebrow">REACT · TYPESCRIPT · GO · MICROFRONTENDS</p></div>
  </dialog>;
}
