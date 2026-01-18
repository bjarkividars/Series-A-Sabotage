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
    const isMobile = viewportWidth < 768;
    const maxContainerWidth = 87.5 * 16;
    const containerPadding = Math.min(Math.max(20, viewportWidth * 0.04), 40);

    const contentWidth = Math.min(viewportWidth, maxContainerWidth);
    const contentLeft = (viewportWidth - contentWidth) / 2 + containerPadding;
    const contentRight = viewportWidth - (viewportWidth - contentWidth) / 2 - containerPadding;

    // On mobile, start the fade earlier (further off-screen) so cards are more visible when peeking
    const fadeStartOffset = isMobile ? 150 : 0;

    cardRefs.current.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const cardLeft = cardRect.left;
      const cardRight = cardRect.right;

      let visibility = 1;

      // On mobile, use a smaller fade zone so cards appear faster
      const fadeMultiplier = isMobile ? 0.2 : 1;

      if (cardLeft < contentLeft - fadeStartOffset) {
        const fadeZone = contentLeft * fadeMultiplier;
        visibility = Math.max(0, Math.min(1, (cardLeft + fadeStartOffset) / fadeZone));
      } else if (cardRight > contentRight + fadeStartOffset) {
        const overshoot = cardRight - (contentRight + fadeStartOffset);
        const fadeDistance = (viewportWidth - contentRight) * fadeMultiplier;
        visibility = Math.max(0, Math.min(1, 1 - (overshoot / fadeDistance)));
      }

      const eased = visibility * visibility * (3 - 2 * visibility);

      // On mobile, keep cards more visible so you always see a peek of the next one
      const minOpacity =  0;
      const minScale = 0.85;

      const scale = minScale + eased * (1 - minScale);
      const opacity = minOpacity + eased * (1 - minOpacity);

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
