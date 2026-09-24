export default function Rich({ as: Tag = "span", html, ...props }) {
  return <Tag {...props} dangerouslySetInnerHTML={{ __html: html }} />;
}
