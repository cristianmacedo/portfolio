import SfSymbol from "../ui/SfSymbol";
import Rich from "./Rich";

export default function Hero({ t }) {
  return (
    <section className="hero card">
      <div className="hero-copy">
        <Rich as="h1" html={t.heroTitle} />
        <p className="intro">{t.heroIntro}</p>
        <a className="primary" href="#journey">
          <span>{t.seeJourney}</span>
          <SfSymbol name="arrow.down" />
        </a>
        <a
          className="text-link"
          href={`${import.meta.env.BASE_URL}assets/cristian-macedo-resume.pdf`}
          target="_blank"
          rel="noopener"
        >
          {t.resume}
        </a>
      </div>
      <div className="portrait">
        <div className="orbit" />
        <span className="portrait-sprite" role="img" aria-label={t.avatarAlt} />
        <span className="portrait-note">
          <span>{t.hello}</span>
          <SfSymbol name="asterisk" />
        </span>
      </div>
      <div className="hero-bottom">
        <span>{t.based}</span>
      </div>
    </section>
  );
}
