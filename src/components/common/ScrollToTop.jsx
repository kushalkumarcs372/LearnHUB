import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const location = useLocation();

    useEffect(() => {
        const prefersReducedMotion = (() => {
            try {
                return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
            } catch {
                return false;
            }
        })();

        try {
            window.scrollTo({ top: 0, left: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        } catch {
            // no-op (e.g., jsdom / older browsers)
        }
    }, [location.pathname]);

    return null;
}
