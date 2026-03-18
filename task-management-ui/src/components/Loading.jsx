//Animation for Loading state using lottie-web
import { useEffect, useRef } from "react";
import lottie from "lottie-web";
import loadingAnimation from "../assets/loading.json";

export default function Loading({ size = 500 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const anim = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: loadingAnimation,
      });
      return () => anim.destroy();
    }
  }, []);

  return (
    <div
      style={{ width: size, height: size, overflow: "hidden" }}
      ref={containerRef}
    />
  );
}
