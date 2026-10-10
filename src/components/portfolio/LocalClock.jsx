import { useEffect, useRef } from "react";
import "./apple-clock.css";

function rotate(element, second) {
  element.style.transform = element.style.webkitTransform = `rotate(${second * 6}deg)`;
}

/* This is the original Apple-clock experiment, moved from legacy-static into
   the React tree without changing its face, ticks, or hand construction. */
function mountAppleClock(container) {
  const dynamic = container.querySelector(".ac-dynamic");
  const hourElement = container.querySelector(".ac-hour");
  const minuteElement = container.querySelector(".ac-minute");
  const secondElement = container.querySelector(".ac-second");
  const make = (className, text = "") => {
    const element = document.createElement("div");
    element.className = className;
    element.textContent = text;
    return element;
  };
  const addAt = (element, second) => {
    const anchor = make("ac-anchor");
    rotate(anchor, second);
    anchor.append(element);
    dynamic.append(anchor);
  };

  for (let minute = 0.25; minute <= 60; minute += 0.25) {
    const kind = minute % 5 === 0 ? "ac-major" : "ac-whole";
    addAt(make(`ac-element ac-minute-line ${kind}`), minute);
    if (minute % 5 === 0) {
      const label = make("ac-anchor ac-minute-text ac-major");
      const content = make("ac-expand ac-content", String(minute).padStart(2, "0"));
      label.append(content);
      rotate(label, -minute);
      addAt(label, minute);
    }
  }

  for (let hour = 1; hour <= 12; hour += 1) {
    const kind = `ac-hour-item ac-hour-${hour}`;
    addAt(make(`ac-element ac-hour-pill ${kind}`), hour * 5);
    const label = make(`ac-anchor ac-hour-text ${kind}`);
    label.append(make("ac-expand ac-content", String(hour)));
    rotate(label, -hour * 5);
    addAt(label, hour * 5);
  }

  let animationFrame;
  const animate = () => {
    const now = new Date();
    const time = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds() + now.getMilliseconds() / 1000;
    rotate(secondElement, time);
    rotate(minuteElement, time / 60);
    rotate(hourElement, time / 60 / 12);
    animationFrame = requestAnimationFrame(animate);
  };
  animate();

  const surface = container.closest(".ios-clock-widget");
  const widget = container.closest(".clock-widget");
  const resize = () => {
    const bounds = surface?.getBoundingClientRect();
    const fallbackBounds = widget?.getBoundingClientRect();
    const width = bounds?.width || fallbackBounds?.width || 0;
    const height = bounds?.height || fallbackBounds?.height || 0;
    if (!width || !height) return;
    const scale = Math.min(width, height) / 327;
    container.style.transform = container.style.webkitTransform = `scale(${scale.toFixed(3)})`;
  };
  const observer = new ResizeObserver(resize);
  if (surface) observer.observe(surface);
  requestAnimationFrame(resize);

  return () => {
    cancelAnimationFrame(animationFrame);
    observer.disconnect();
    dynamic.replaceChildren();
  };
}

export default function LocalClock({ t }) {
  const clockRef = useRef(null);

  useEffect(() => mountAppleClock(clockRef.current), []);

  return (
    <article className="proof-strip clock-widget" aria-label={t.localLabel}>
      <section className="ios-clock-widget" aria-hidden="true">
        <div className="ac-fill">
          <div
            ref={clockRef}
            className="ac-clock ac-hour-style-pill ac-hour-text-style-large ac-hour-display-style-all ac-minute-style-line ac-minute-display-style-fine-2 ac-minute-text-style-none ac-hand-style-hollow"
          >
            <div className="ac-centre">
              <div className="ac-dynamic" />
              <div className="ac-expand ac-round ac-circle-1" />
              <div className="ac-anchor ac-hour"><div className="ac-element ac-thin-hand" /><div className="ac-element ac-fat-hand" /></div>
              <div className="ac-anchor ac-minute"><div className="ac-element ac-thin-hand" /><div className="ac-element ac-fat-hand ac-minute-hand" /></div>
              <div className="ac-anchor ac-second"><div className="ac-element ac-second-hand ac-second-hand-front" /><div className="ac-element ac-second-hand ac-second-hand-back" /></div>
              <div className="ac-expand ac-round ac-circle-2" />
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
