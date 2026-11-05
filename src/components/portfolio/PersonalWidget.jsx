import { useState, useEffect } from "react";
import FloatingWindow from "../system/FloatingWindow";
import "./personal-widgets.css";

// Public portfolio commit counts, grouped by active day through 2026-11-05.
const activity = __PORTFOLIO_ACTIVITY__ ?? {total:71, days:[1,1,6,15,7,7,18,12,2,1,1]};
const points = activity.days.map((n,i) => [100*i/Math.max(1,activity.days.length-1), 28-25*n/Math.max(...activity.days)].join(",")).join(" ");
const projects = ["InnerBilliards", "Senalytics", "PrettyGit", "SpendBox", "OhNoCoiner"];
const cover = name => `${import.meta.env.BASE_URL}assets/projects/${name.toLowerCase()}-cover.png`;
export default function PersonalWidget({id, language, widgetProps}) {
  const pt = language === "pt";
  const [open,setOpen] = useState(false);
  const [index,setIndex] = useState(0);
  const [today,setToday] = useState(() => new Date());
  useEffect(() => {
    if (id !== "calendar") return;
    const timer = setInterval(() => setToday(new Date()), 60000);
    return () => clearInterval(timer);
  }, [id]);
  const date = options => today.toLocaleDateString(pt ? "pt-BR" : "en-US", {timeZone:"America/Sao_Paulo", ...options});
  const notes = pt ? [["Terminal interativo","Uma janela arrastável para explorar o portfólio por comandos."],["Widgets","Experimentos com vidro, movimento e uma tela inicial que você pode reorganizar."]] : [["Interactive Terminal","A draggable window for exploring the portfolio with commands."],["Widgets","Experiments with glass, motion and a home screen you can rearrange."]];
  const titles = {music:"Cool · Dua Lipa", calendar:pt?"Entrar em contato":"Get in touch", notes:pt?"Notas":"Notes", activity:pt?"Histórico do portfólio":"Portfolio history",photos:pt?"Álbum de projetos":"Project album"};
  const href = {music:"https://music.apple.com/us/search?term=Dua%20Lipa%20Cool",calendar:"mailto:cristian.silvadk22@gmail.com",activity:"https://github.com/cristianmacedo/portfolio/commits/master/"}[id];
  const Tag = href ? "a" : "button";
  const content = {
    calendar:<><span>{date({weekday:"long"})}</span><strong>{date({day:"numeric"})}</strong><div><b>{pt?"Vamos conversar?":"Get in touch"}</b><small>São Paulo</small><small>E-mail ↗</small></div></>,
    music:<><img src={import.meta.env.BASE_URL+"assets/cool-cover.png"} alt=""/><i aria-hidden="true">♫</i><b>Cool</b><span>Dua Lipa</span></>,
    notes:<><strong><svg aria-hidden="true" viewBox="0 0 24 20"><path fill="currentColor" d="M1 4a2 2 0 0 1 2-2h6l3 3h9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2z"/></svg>{titles.notes}</strong>{notes.map(([title])=><div key={title}><b>{title}</b><small>{pt?"Projeto em andamento":"In progress"}</small></div>)}</>,
    activity:<><b>GitHub</b><span>portfolio</span><svg viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="activity-fill" x2="0" y2="1"><stop stopColor="#42ed52" stopOpacity=".48"/><stop offset="1" stopColor="#42ed52" stopOpacity="0"/></linearGradient></defs><polygon fill="url(#activity-fill)" points={'0,30 '+points+' 100,30'}/><polyline fill="none" stroke="#42ed52" strokeWidth="1.6" points={points}/></svg><strong>{activity.total} <small>commits</small></strong></>,
    photos:<><img src={cover(projects[index])} alt=""/><b>{titles.photos}</b></>
  };
  return <><Tag {...widgetProps} {...(href ? {href} : {type:"button"})} aria-label={titles[id]} className={`personal-widget pw-${id} ${widgetProps.className || ""}`} onClick={e=>{widgetProps.onClick?.(e); if(!e.defaultPrevented && !href)setOpen(true)}}><div className="pw-face">{content[id]}</div></Tag>
    {!href && <FloatingWindow id={id} open={open} ariaLabel={titles[id]} className="pw-window">{({dragProps})=><><div className="pw-bar" {...dragProps}><button aria-label={pt?"Fechar":"Close"} onPointerDown={e=>e.stopPropagation()} onClick={()=>setOpen(false)}>×</button>{titles[id]}</div>{id==="notes"?notes.map(([title,body])=><section key={title}><b>{title}</b><p>{body}</p></section>):<section><img src={cover(projects[index])} alt={projects[index]}/><p>{projects[index]}</p><button onClick={()=>setIndex((index+1)%projects.length)}>{pt?"Próximo":"Next"} →</button></section>}</>}</FloatingWindow>}
  </>;
}
