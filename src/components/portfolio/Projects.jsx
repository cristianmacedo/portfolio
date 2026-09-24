import { useEffect, useRef, useState } from "react";
import SfSymbol from "../ui/SfSymbol";
import projects from "../../data/projects";
import SectionHeading from "./SectionHeading";

function ProjectDialog({ project, t, onClose }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (project && !dialog.open) dialog.showModal();
    if (!project && dialog.open) dialog.close();
  }, [project]);
  if (!project) return <dialog ref={dialogRef} />;
  return <dialog className="project-dialog" ref={dialogRef} onClose={onClose} onClick={(event) => { if (event.target === dialogRef.current) onClose(); }}>
    <button className="project-dialog-close" type="button" aria-label={t.closeProject} onClick={onClose}><SfSymbol name="xmark" /></button>
    <div className="project-dialog-art"><img src={`${import.meta.env.BASE_URL}assets/projects/${project.image}`} alt="" /></div>
    <div className="project-dialog-copy">
      <span className="eyebrow">{t.personalProject}</span><h2>{project.name}</h2><p>{t[project.copy]}</p>
      {project.detail && <p className="project-dialog-detail">{t[project.detail]}</p>}
      <div className="project-dialog-tech">{project.tech.map((item) => <span key={item}>{item}</span>)}</div>
      <div className="project-dialog-actions">
        {project.liveUrl && <a className="project-dialog-link project-dialog-live-link" href={project.liveUrl} target="_blank" rel="noopener"><span>{t.viewProject}</span><SfSymbol name="arrow.up.right" /></a>}
        <a className="project-dialog-link" href={project.href} target="_blank" rel="noopener"><span>{t.viewRepository}</span><SfSymbol name="arrow.up.right" /></a>
      </div>
    </div>
  </dialog>;
}

export default function Projects({ t }) {
  const railRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const move = (direction) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector(".project-showcase-card");
    rail.scrollBy({ left: direction * ((card?.offsetWidth || 300) + 18), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  return <section className="projects-section page-section" aria-labelledby="side-projects">
    <SectionHeading id="side-projects" title={t.sideProjectsTitle} caption={t.sideProjectsCaption} />
    <div className="project-carousel-shell">
      <div className="project-carousel" ref={railRef} aria-label={t.projectsCarousel}>
        <div className="project-carousel-gutter" aria-hidden="true" />
        {projects.map((project) => <article className="project-showcase-card" key={project.id}>
          <img src={`${import.meta.env.BASE_URL}assets/projects/${project.image}`} alt="" loading="lazy" />
          <div className="project-showcase-copy"><span>{t[project.category]}</span><h3>{project.name}</h3><p>{t[project.copy]}</p></div>
          <button className="project-open" type="button" aria-label={`${t.openProject}: ${project.name}`} onClick={() => setSelectedProject(project)}><SfSymbol name="plus" /></button>
        </article>)}
      </div>
      <div className="project-carousel-controls" aria-label={t.carouselControls}>
        <button type="button" aria-label={t.previousProject} onClick={() => move(-1)}><SfSymbol name="chevron.left" /></button>
        <button type="button" aria-label={t.nextProject} onClick={() => move(1)}><SfSymbol name="chevron.right" /></button>
      </div>
    </div>
    <ProjectDialog project={selectedProject} t={t} onClose={() => setSelectedProject(null)} />
  </section>;
}
