import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Loader = () => {
  const loaderRef = useRef(null);

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
      className="fixed inset-0 flex items-center justify-center bg-transparent z-50 pointer-events-none"
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
      <img src='./Loader.gif' alt="Loading..." className="relative z-10" />
    </div>
  );
};

export default Loader;
