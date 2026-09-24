import { useEffect, useRef } from "react";

const FRAME_IDS = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12];

export default function useMemojiPreload() {
  const framesRef = useRef([]);
  useEffect(() => {
    framesRef.current = FRAME_IDS.map((id) => {
      const image = new Image();
      image.src = `${import.meta.env.BASE_URL}assets/cristian-memoji-dark-to-light-transition-${id}.png`;
      return image;
    });
    return () => { framesRef.current = []; };
  }, []);
}
