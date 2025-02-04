import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Loader = () => {
  const loaderRef = useRef(null);
  const dotsRef = useRef([]);

  useEffect(() => {
    const timeline = gsap.timeline({ repeat: -1 });

    // Animating dots individually
    dotsRef.current.forEach((dot, index) => {
      timeline.to(
        dot,
        {
          y: -10,
          opacity: 1,
          duration: 0.4,
          ease: 'power1.inOut',
        },
        index * 0.2 // Stagger animation
      );
    });

    return () => timeline.kill(); // Cleanup on unmount
  }, []);

  useEffect(() => {
    // Entry animation for the loader container
    gsap.fromTo(
      loaderRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }
    );
    return () => gsap.killTweensOf(loaderRef.current); // Cleanup
  }, []);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 flex items-center justify-center bg-transparent z-50"
    >
      <div className="flex space-x-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            ref={(el) => (dotsRef.current[i] = el)}
            className="w-3 h-3 rounded-full bg-white opacity-20"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Loader;
