'use client';

import { useLayoutEffect, useRef, useState } from 'react';

interface Dimensions {
  width: number;
  height: number;
}

export function useMeasure<T extends HTMLElement = HTMLElement>(): [
  React.RefObject<T | null>,
  Dimensions
] {
  const ref = useRef<T | null>(null);
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (ref.current) {
      const { width, height } = ref.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, []);

  return [ref, dimensions];
}
