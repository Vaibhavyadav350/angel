import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Reusable hook for scroll-triggered GSAP animations
 * Follows DRY principles by centralizing animation logic
 * 
 * @param {Object} options - Animation configuration
 * @param {React.RefObject} options.ref - Ref to the element to animate
 * @param {string} options.start - ScrollTrigger start position (default: 'top 80%')
 * @param {Object} options.from - Initial animation state
 * @param {Object} options.to - Final animation state
 * @param {number} options.duration - Animation duration (default: 1)
 * @param {string} options.ease - Easing function (default: 'power3.out')
 * @param {boolean} options.once - Animate only once (default: true)
 * @param {number} options.stagger - Stagger delay for children (optional)
 * @param {React.RefObject} options.contextRef - Context ref for cleanup (optional)
 * @param {Array} options.dependencies - Effect dependencies (default: [])
 */
export const useScrollAnimation = ({
  ref,
  start = 'top 80%',
  from = { y: 40 },
  to = { y: 0 },
  duration = 1,
  ease = 'power3.out',
  once = true,
  stagger = null,
  contextRef = null,
  dependencies = [],
}) => {
  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const context = contextRef?.current || element;

    const ctx = gsap.context(() => {
      const scrollTrigger = ScrollTrigger.create({
        trigger: element,
        start,
        once,
      });

      const animationProps = {
        ...to,
        duration,
        ease,
        scrollTrigger,
      };

      if (stagger !== null) {
        // Animate children with stagger
        gsap.fromTo(
          element.children,
          from,
          {
            ...animationProps,
            stagger,
          }
        );
      } else {
        // Animate single element
        gsap.fromTo(element, from, animationProps);
      }
    }, context);

    return () => {
      if (element) {
        ctx.revert();
        // Clean up ScrollTrigger instances
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger.vars?.trigger === element) {
            trigger.kill();
          }
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, start, JSON.stringify(from), JSON.stringify(to), duration, ease, once, stagger, contextRef, ...dependencies]);
};

/**
 * Hook for multiple scroll-triggered animations on different elements
 * 
 * @param {Array} animations - Array of animation configs
 * @param {React.RefObject} contextRef - Context ref for cleanup
 */
export const useMultipleScrollAnimations = (animations, contextRef) => {
  useEffect(() => {
    if (!contextRef?.current) return;

    const contextElement = contextRef?.current;

    const ctx = gsap.context(() => {
      animations.forEach(({ ref, start = 'top 80%', from, to, duration = 1, ease = 'power3.out', once = true }) => {
        if (!ref?.current) return;

        const scrollTrigger = ScrollTrigger.create({
          trigger: ref.current,
          start,
          once,
        });

        gsap.fromTo(
          ref.current,
          from,
          {
            ...to,
            duration,
            ease,
            scrollTrigger,
          }
        );
      });
    }, contextElement);

    return () => {
      ctx.revert();
      animations.forEach(({ ref }) => {
        if (ref.current) {
          ScrollTrigger.getAll().forEach(trigger => {
            if (trigger.vars?.trigger === ref.current) {
              trigger.kill();
            }
          });
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animations, contextRef]);
};

