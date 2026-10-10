import SfSymbol from "../ui/SfSymbol";
import Rich from "./Rich";
import SectionHeading from "./SectionHeading";

function activateWithKeyboard(event, action) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    action();
  }
}

export default function WorkSection({ t, onDetails }) {
  return (
    <section className="work-section page-section" aria-labelledby="work">
      <SectionHeading id="work" title={t.selectedWork} />
      <div className="bento">
        <article className="card featured card-action" role="button" tabIndex={0} aria-label={t.insideWork} onClick={onDetails} onKeyDown={(event) => activateWithKeyboard(event, onDetails)}>
          <div className="card-top"><span className="eyebrow">{t.workMeta}</span><span className="featured-open" aria-hidden="true"><SfSymbol name="arrow.up.right" /></span></div>
          <Rich as="h3" html={t.foundationTitle} />
          <p>{t.foundationCopy}</p>
        </article>
        <aside className="card now">
          <div className="card-top"><span className="eyebrow">{t.currentLabel}</span></div>
          <span className="bubble-label from-them">{t.currentQuestion}</span>
          <div className="message-wrap"><div className="message from-me">{t.currentMessage}</div></div>
          <p>{t.currentCopy}</p>
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
