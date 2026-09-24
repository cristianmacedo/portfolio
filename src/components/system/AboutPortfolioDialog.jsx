import { useEffect, useRef } from "react";

export default function AboutPortfolioDialog({ language, open, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const content = language === "pt"
    ? {
        label: "Sobre este portfólio",
        title: "Portfólio de Cristian",
        subtitle: "Edição 2026",
        rows: [
          ["Interface", "React + Vite"],
          ["Experiência", "Sistema visual interativo"],
          ["Idiomas", "Português e English"],
          ["Local", "São Paulo, Brasil"],
        ],
        action: "Explorar projetos…",
        footer: "Feito com código, curiosidade e atenção aos detalhes.",
      }
    : {
        label: "About this portfolio",
        title: "Cristian’s Portfolio",
        subtitle: "2026 Edition",
        rows: [
          ["Interface", "React + Vite"],
          ["Experience", "Interactive visual system"],
          ["Languages", "English and Português"],
          ["Location", "São Paulo, Brazil"],
        ],
        action: "Explore projects…",
        footer: "Built with code, curiosity, and attention to detail.",
      };

  const exploreProjects = () => {
    onClose();
    document.getElementById("side-projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <dialog
      className="about-portfolio-dialog"
      ref={dialogRef}
      aria-label={content.label}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <div className="about-window-controls">
        <button type="button" onClick={onClose} aria-label={language === "pt" ? "Fechar" : "Close"} />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </div>

      <div className="about-portfolio-art" aria-hidden="true">
        <div className="about-browser">
          <div className="about-browser-bar"><i /><i /><i /></div>
          <strong>cm<span>.</span></strong>
        </div>
        <div className="about-browser-base" />
      </div>

      <div className="about-portfolio-copy">
        <h2>{content.title}</h2>
        <p>{content.subtitle}</p>
      </div>

      <dl className="about-portfolio-specs">
        {content.rows.map(([term, description]) => (
          <div key={term}>
            <dt>{term}</dt>
            <dd>{description}</dd>
          </div>
        ))}
      </dl>

      <button className="about-portfolio-action" type="button" onClick={exploreProjects}>
        {content.action}
      </button>
      <p className="about-portfolio-footer">{content.footer}<br />© 2026 Cristian Macedo</p>
    </dialog>
  );
}
