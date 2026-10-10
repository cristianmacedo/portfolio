import { useEffect, useState } from "react";

export default function useActiveSection() {
  const [activeSection, setActiveSection] = useState("work");
  useEffect(() => {
    const sections = ["work", "about", "side-projects", "journey"]
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    let frame = 0;

    const update = () => {
      frame = 0;
      const activationLine = window.innerHeight * 0.34;
      const current = sections.reduce(
        (active, section) =>
          section.getBoundingClientRect().top <= activationLine
            ? section.id
            : active,
        sections[0]?.id ?? "work",
      );
      setActiveSection(current);
    };

    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      cancelAnimationFrame(frame);
    };
  }, []);
  return activeSection;
}
