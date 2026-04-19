import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const AnimatedPage = ({ children }) => {
    const prefersReducedMotion = useReducedMotion();

    const pageVariants = prefersReducedMotion
        ? {
              initial: { opacity: 0 },
              animate: { opacity: 1, transition: { duration: 0.15 } },
              exit: { opacity: 0, transition: { duration: 0.12 } },
          }
        : {
              initial: { opacity: 0, y: 16 },
              animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
              exit: { opacity: 0, y: -16, transition: { duration: 0.22 } },
          };

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ willChange: prefersReducedMotion ? 'auto' : 'transform, opacity' }}
        >
            {children}
        </motion.div>
    );
};

export default AnimatedPage;
