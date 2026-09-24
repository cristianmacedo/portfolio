import SfSymbol from "../ui/SfSymbol";
import Rich from "./Rich";
import SectionHeading from "./SectionHeading";

function TimelineEntry({ date, duration, company, place, role, summary, bullets, tech, current, education }) {
  return <li className={`timeline-item${current ? " current" : ""}${education ? " education-item" : ""}`}>
    <div className="timeline-date"><span>{date}</span><small>{duration}</small></div><div className="timeline-dot" />
    <div className="timeline-content"><div className="timeline-company"><h3>{company}</h3><span>{place}</span></div><h4>{role}</h4><p>{summary}</p>
      {bullets && <ul>{bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
      {tech && <div className="tech-list">{tech.map((item) => <span key={item}>{item}</span>)}</div>}
      {education && <div className="education-note"><SfSymbol name="command" /><span>{education}</span></div>}
    </div>
  </li>;
}

export default function Journey({ t }) {
  const entries = [
    { date: t.dateMeli, duration: t.durationMeli, company: "Mercado Livre", place: t.meliPlace, role: t.meliRoles, summary: t.meliSummary, bullets: [t.meliOne, t.meliTwo, t.meliThree], tech: ["React", "TypeScript", "Go", "Microfrontends", "Design Systems"], current: true },
    { date: "2021 — 2024", duration: t.durationLevva, company: "levva", place: t.remote, role: t.levvaRole, summary: t.levvaSummary, bullets: [t.levvaOne, t.levvaTwo, t.levvaThree], tech: ["React", "React Native", "Node.js", "Segment", "Amplitude"] },
    { date: "2018 — 2021", duration: t.durationIbm, company: "IBM", place: t.ibmPlace, role: t.ibmRoles, summary: t.ibmSummary, bullets: [t.ibmOne, t.ibmTwo, t.ibmThree], tech: ["React", "Carbon", "Storybook", "WCAG", "Performance"] },
    { date: "2018 — 2020", duration: t.degreeDate, company: t.university, place: "São Paulo", role: t.degree, summary: t.degreeCopy, education: t.educationNote },
  ];
  return <section className="journey-section page-section" aria-labelledby="journey">
    <SectionHeading id="journey" title={t.journeyTitle} caption={t.journeyCaption} />
    <section className="card timeline-card"><div className="timeline-intro"><span className="eyebrow">{t.timelineLabel}</span><Rich as="h3" html={t.timelineHeading} /><p>{t.timelineIntro}</p></div><ol className="timeline">{entries.map((entry) => <TimelineEntry key={entry.company} {...entry} />)}</ol></section>
  </section>;
}
