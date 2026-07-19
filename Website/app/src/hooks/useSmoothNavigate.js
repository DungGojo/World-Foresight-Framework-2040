import { useCallback } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router-dom';

export default function useSmoothNavigate() {
  const navigate = useNavigate();

  return useCallback((to, options) => {
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (!document.startViewTransition || reduceMotion) {
      navigate(to, options);
      return;
    }

    document.startViewTransition(() => {
      flushSync(() => navigate(to, options));
    });
  }, [navigate]);
}
