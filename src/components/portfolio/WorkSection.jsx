import SfSymbol from "../ui/SfSymbol";
import Rich from "./Rich";
import SectionHeading from "./SectionHeading";

export default function WorkSection({ t, onDetails }) {
  return (
    <section className="work-section page-section" aria-labelledby="work">
      <SectionHeading id="work" title={t.selectedWork} caption={t.workCaption} />
      <div className="bento">
        <article className="card featured">
          <div className="card-top"><span className="eyebrow">{t.scaleLabel}</span><span className="tag">Mercado Livre</span></div>
          <Rich as="h3" html={t.foundationTitle} />
          <p>{t.foundationCopy}</p>
          <div className="work-scope">
            <div><span>{t.scopeProduct}</span><p>{t.scopeProductCopy}</p></div>
            <div><span>{t.scopePlatform}</span><p>{t.scopePlatformCopy}</p></div>
            <div><span>{t.scopeTeam}</span><p>{t.scopeTeamCopy}</p></div>
          </div>
          <button className="card-link" onClick={onDetails}><span>{t.insideWork}</span><SfSymbol name="arrow.up.right" /></button>
        </article>
        <aside className="card now">
          <div className="card-top"><span className="eyebrow">{t.currentLabel}</span><SfSymbol name="arrow.up.right" className="tiny-mark" /></div>
          <span className="bubble-label from-them">{t.currentQuestion}</span>
          <div className="message-wrap"><div className="message from-me">{t.currentMessage}</div></div>
          <p>{t.currentCopy}</p>
          <div className="now-bottom"><span className="mini-icon"><SfSymbol name="command" /></span><Rich html={t.currentFoot} /></div>
        </aside>
        <article className="card about" id="about">
          <span className="eyebrow">{t.aboutLabel}</span>
          <Rich as="h3" html={t.aboutTitle} />
          <p>{t.aboutCopy}</p>
          <div className="personal"><span>{t.outside}</span><p>{t.outsideCopy}</p></div>
        </article>
      </div>
    </section>
  );
}
