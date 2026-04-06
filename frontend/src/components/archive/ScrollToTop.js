import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop
 * Scrolls window to top-left (0,0) on every route change.
 * This fixes the issue where navigating from the Landing Page to /products
 * would land at the bottom of the page instead of the top.
 */
const ScrollToTop = () => {
    const { pathname, search } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [pathname, search]);

    return null;
};

export default ScrollToTop;
