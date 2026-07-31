import { useEffect, useRef, useState } from 'react';

/**
 * useAnimatedCounter — animates a number from 0 to `target` over `duration` ms.
 * Uses requestAnimationFrame for buttery smooth animation.
 *
 * @param {number} target   - The final value to count to
 * @param {number} duration - Animation duration in ms (default 1200)
 * @returns {number} current - The current animated value
 */
export function useAnimatedCounter(target, duration = 1200) {
  const [current, setCurrent] = useState(0);
  const startRef   = useRef(null);
  const prevTarget = useRef(target);

  useEffect(() => {
    const from = prevTarget.current !== target ? 0 : current;
    prevTarget.current = target;
    startRef.current   = null;

    const step = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed  = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(from + (target - from) * eased));
      if (progress < 1) requestAnimationFrame(step);
    };

    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return current;
}

/**
 * useRealTimeClock — returns a live-updating date/time string.
 */
export function useRealTimeClock(format = 'time') {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (format === 'time') {
    return now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  return now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

/**
 * useDebounce — debounces a value by `delay` ms.
 */
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
