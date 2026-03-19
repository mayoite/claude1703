'use client';

import { useEffect, useRef } from 'react';

export function useScrollAnimation() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        node.style.opacity = '0';
        node.style.transform = 'translateY(30px)';
        node.style.transition = 'opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry?.isIntersecting) return;
                node.style.opacity = '1';
                node.style.transform = 'translateY(0)';
                observer.disconnect();
            },
            { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
        );

        observer.observe(node);

        return () => {
            observer.disconnect();
        };
    }, []);

    return ref;
}
