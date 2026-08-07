import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop
 * Scrolls window to top-left (0,0) on every route change.
 * This fixes the issue where navigating from the Landing Page to /products
 * would land at the bottom of the page instead of the top.
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        // Deliberately keyed on `pathname` only. Including `search` meant every
        // filter change on /products — which rewrites the query string — threw the
        // shopper back to the top of the page mid-browse.
    }, [pathname]);

    return null;
};

export default ScrollToTop;
