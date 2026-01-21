import { useState, useEffect } from 'react';

interface ViewportBounds {
  width: number;
  height: number;
}

export function useViewportBounds(): ViewportBounds {
  const [viewport, setViewport] = useState<ViewportBounds>({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  
  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return viewport;
}
