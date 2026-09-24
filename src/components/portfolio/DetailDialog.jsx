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
    eyebrow: "EXPERIÊNCIA EM DESTAQUE / MERCADO LIVRE", title: "Produto, plataforma e responsabilidade técnica.", copy: "Trabalho em uma plataforma interna de gestão fiscal que suporta mais de US$ 3 bilhões em operações mensais no Brasil e na Argentina. Meu foco principal é frontend, mas o trabalho frequentemente chega a sistemas compartilhados e serviços em Go.", heading: "Onde contribuo", bullets: ["Componentes compartilhados: criei estruturas reutilizáveis adotadas além do produto principal.", "Microfrontends: liderei uma migração que permite aos times evoluir partes diferentes da plataforma de forma independente.", "Autorização: construí lógica compartilhada e apoiei a migração para um novo sistema de autenticação.", "Time: decisões técnicas, revisões, documentação, exemplos e mentoria."]
  } : {
    eyebrow: "SELECTED EXPERIENCE / MERCADO LIVRE", title: "Product, platform, and technical ownership.", copy: "I work on an internal tax management platform that supports more than $3B in monthly operations across Brazil and Argentina. My main focus is frontend, but the work often reaches shared systems and Go services.", heading: "Where I contribute", bullets: ["Shared components: created reusable foundations adopted beyond the core product.", "Microfrontends: led a migration that lets teams evolve different parts of the platform independently.", "Authorization: built shared logic and supported a migration to a new authentication system.", "Team: technical decisions, reviews, documentation, examples, and mentoring."]
  };
  return <dialog ref={dialogRef} onClose={onClose} onClick={(event) => { if (event.target === dialogRef.current) onClose(); }}>
    <button className="close" aria-label="Close details" onClick={onClose}><SfSymbol name="xmark" /></button>
    <div><span className="eyebrow">{content.eyebrow}</span><h2>{content.title}</h2><p>{content.copy}</p><h3>{content.heading}</h3><ul>{content.bullets.map((item) => <li key={item}>{item}</li>)}</ul><p className="eyebrow">REACT · TYPESCRIPT · GO · MICROFRONTENDS</p></div>
  </dialog>;
}
