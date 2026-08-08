/**
 * animationVariants.js
 * Centralized Framer Motion variants for ExamPlatform.AI.
 * All pages and components import from here to stay consistent.
 */

// ---------------------------------------------------------------------------
// Easing presets
// ---------------------------------------------------------------------------
export const ease = {
  smooth: [0.4, 0, 0.2, 1],
  spring: [0.34, 1.56, 0.64, 1],
  out: [0, 0, 0.2, 1],
};

// ---------------------------------------------------------------------------
// Page / section entrance
// ---------------------------------------------------------------------------
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: ease.smooth },
  },
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: ease.smooth },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.35, ease: ease.smooth },
  },
};

// ---------------------------------------------------------------------------
// Modal / card pop
// ---------------------------------------------------------------------------
export const fadeInScale = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: ease.spring },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    transition: { duration: 0.2, ease: ease.smooth },
  },
};

// Overlay / backdrop
export const overlayVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

// ---------------------------------------------------------------------------
// Stagger container — wraps grids of cards
// ---------------------------------------------------------------------------
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

// Child item used inside staggerContainer
export const staggerItem = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: ease.smooth },
  },
};

// ---------------------------------------------------------------------------
// Slide in from side (used for mobile menu, drawers)
// ---------------------------------------------------------------------------
export const slideDown = {
  hidden: { opacity: 0, height: 0, overflow: 'hidden' },
  visible: {
    opacity: 1,
    height: 'auto',
    overflow: 'hidden',
    transition: { duration: 0.3, ease: ease.smooth },
  },
  exit: {
    opacity: 0,
    height: 0,
    overflow: 'hidden',
    transition: { duration: 0.22, ease: ease.smooth },
  },
};

// ---------------------------------------------------------------------------
// Hover & tap — attach directly on motion elements
// ---------------------------------------------------------------------------

/** Slight elevation lift used on stat + exam cards */
export const cardHoverProps = {
  whileHover: {
    y: -5,
    boxShadow: '0 20px 40px -12px rgba(99, 102, 241, 0.2)',
    transition: { duration: 0.25, ease: ease.smooth },
  },
  whileTap: {
    scale: 0.98,
    transition: { duration: 0.12 },
  },
};

/** Primary button tap press */
export const buttonTap = {
  whileTap: {
    scale: 0.96,
    transition: { duration: 0.1 },
  },
  whileHover: {
    scale: 1.02,
    transition: { duration: 0.18, ease: ease.smooth },
  },
};

/** Subtle press — for secondary / ghost buttons */
export const subtleTap = {
  whileTap: {
    scale: 0.97,
    transition: { duration: 0.1 },
  },
};

/** Icon hover spin / scale */
export const iconHover = {
  whileHover: {
    rotate: 8,
    scale: 1.1,
    transition: { duration: 0.2 },
  },
};

// ---------------------------------------------------------------------------
// whileInView defaults — for content below the fold
// ---------------------------------------------------------------------------
export const inViewProps = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, margin: '-60px' },
};
