import { useState, useLayoutEffect, RefObject } from 'react';

interface Size {
  width: number;
  height: number;
}

function useResizeObserver<T extends HTMLElement>(ref: RefObject<T>): Size {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Set initial size
    const { width, height } = element.getBoundingClientRect();
    setSize({ width, height });

    const observer = new ResizeObserver(entries => {
      // We only have one entry, so we can access it directly
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setSize({ width, height });
      }
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return size;
}

export default useResizeObserver;
