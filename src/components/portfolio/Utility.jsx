import { useEffect, useState } from "react";
import SfSymbol from "../ui/SfSymbol";
import Rich from "./Rich";

export default function Utility({ t, language }) {
  const [copyStatus, setCopyStatus] = useState("");
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("cristian.silvadk22@gmail.com");
      setCopyStatus(t.copied);
    } catch { setCopyStatus("cristian.silvadk22@gmail.com"); }
  };
  useEffect(() => setCopyStatus(""), [language]);
  return <section className="utility-grid page-section">
    <article className="card approach"><span className="eyebrow">{t.thinkingLabel}</span><SfSymbol name="asterisk" className="asterisk" /><Rich as="h3" html={t.thinkingTitle} /><p>{t.thinkingCopy}</p><div className="ai-practice"><span>{t.aiLabel}</span><p>{t.aiCopy}</p></div></article>
    <article className="card contact"><span className="eyebrow">{t.helloLabel}</span><Rich as="h3" html={t.contactTitle} /><div className="contact-actions"><a href="mailto:cristian.silvadk22@gmail.com">{t.sendEmail}</a><button id="copy" onClick={copyEmail} aria-label={t.copyLabel} title={t.copyLabel}><SfSymbol name="doc.on.doc" /></button></div><p id="copy-status" role="status">{copyStatus}</p></article>
  </section>;
}
