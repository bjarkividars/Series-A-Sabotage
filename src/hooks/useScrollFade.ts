'use client';

import { useCallback, useEffect, useRef } from 'react';

interface CardVisibility {
  scale: number;
  opacity: number;
}

export function useScrollFade(containerRef: React.RefObject<HTMLElement | null>) {
  const cardRefs = useRef<Map<number, HTMLElement>>(new Map());
  const stylesRef = useRef<Map<number, CardVisibility>>(new Map());

  const registerCard = useCallback((index: number, element: HTMLElement | null) => {
    if (element) {
      cardRefs.current.set(index, element);
    } else {
      cardRefs.current.delete(index);
    }
  }, []);

  const calculateVisibility = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const viewportWidth = window.innerWidth;
    const maxContainerWidth = 87.5 * 16;
    const containerPadding = Math.min(Math.max(20, viewportWidth * 0.04), 40);

    const contentWidth = Math.min(viewportWidth, maxContainerWidth);
    const contentLeft = (viewportWidth - contentWidth) / 2 + containerPadding;
    const contentRight = viewportWidth - (viewportWidth - contentWidth) / 2 - containerPadding;

    cardRefs.current.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const cardLeft = cardRect.left;
      const cardRight = cardRect.right;

      let visibility = 1;

      if (cardLeft < contentLeft) {
        visibility = Math.max(0, cardLeft / contentLeft);
      } else if (cardRight > contentRight) {
        const overshoot = cardRight - contentRight;
        const fadeDistance = viewportWidth - contentRight;
        visibility = Math.max(0, 1 - (overshoot / fadeDistance));
      }

      const eased = visibility * visibility * (3 - 2 * visibility);

      const scale = 0.85 + eased * 0.15;
      const opacity = eased;

      stylesRef.current.set(index, { scale, opacity });

      card.style.transform = `scale(${scale})`;
      card.style.opacity = String(opacity);
    });
  }, [containerRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    calculateVisibility();

    container.addEventListener('scroll', calculateVisibility, { passive: true });
    window.addEventListener('resize', calculateVisibility, { passive: true });

    return () => {
      container.removeEventListener('scroll', calculateVisibility);
      window.removeEventListener('resize', calculateVisibility);
    };
  }, [containerRef, calculateVisibility]);

  const getCardStyle = useCallback((): React.CSSProperties => {
    return {
      transition: 'transform 0.15s ease-out, opacity 0.15s ease-out',
    };
  }, []);

  return { registerCard, getCardStyle };
}
