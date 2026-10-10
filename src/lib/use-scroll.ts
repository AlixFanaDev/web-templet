import { useEffect, useState } from 'react';
import { useLenis } from 'lenis/react';

/**
 * Scroll-direction awareness for the navbar (hide on scroll down past a
 * threshold, reveal on scroll up). `setState` is only called when the value
 * actually flips, so idle scrolling never re-renders the tree.
 */
export function useScrollDirection(hideAfter = 400): 'up' | 'down' {
  const [direction, setDirection] = useState<'up' | 'down'>('up');

  useLenis(
    (lenis) => {
      const y = lenis.scroll;
      if (y < hideAfter) {
        setDirection('up');
        return;
      }
      setDirection(lenis.direction >= 0 ? 'down' : 'up');
    },
    [hideAfter],
    2,
  );

  return direction;
}

/** One-shot "has the page scrolled past N px" flag (used for the navbar glass state). */
export function useScrolledPast(threshold = 80): boolean {
  const [past, setPast] = useState(false);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return past;
}
