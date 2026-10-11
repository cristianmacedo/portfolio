export default function MemojiWidget({ t, widgetProps = {} }) {
  const { className: widgetClassName, ...widgetEvents } = widgetProps;

  return (
    <article
      {...widgetEvents}
      className={["memoji-widget", widgetClassName].filter(Boolean).join(" ")}
      aria-label={t.avatarAlt}
    >
      <span className="portrait-sprite" role="img" aria-label={t.avatarAlt} />
    </article>
  );
}
