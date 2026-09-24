export default function SectionHeading({ id, title, caption }) {
  return (
    <div className="section-heading" id={id}>
      <h2>{title}</h2>
      <span>{caption}</span>
    </div>
  );
}
