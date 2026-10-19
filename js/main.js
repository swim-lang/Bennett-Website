// Bennett homepage: scroll-scrubbed morph of the wordmark + nav.
//
// Both elements are laid out in CSS at their END state (State B):
//   wordmark → 5 columns wide, centered in the viewport
//   nav      → top center
// Here we tween them FROM their START state (State A, the hero row:
// wordmark in column 1, nav against the right margin, both vertically
// centered) to State B while the first screen is scrolled. The hero itself
// stays fixed and fades from off-white to green over the same distance.
// Values are design pixels from Paper × u (1 design px at the 1440 artboard).

(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  // Subtle smooth scroll (Lenis), driven by GSAP's ticker so ScrollTrigger
  // stays perfectly in sync. lerp: lower = smoother/floatier; 0.28 keeps it
  // very light. Touch devices keep native scrolling; skipped for reduced motion.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (window.Lenis && !reduceMotion) {
    const lenis = new Lenis({ lerp: 0.28 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const u = () => window.innerWidth / 1440;
  const vh = () => window.innerHeight;

  // State A row: 21.61 tall, vertically centered → top = 50vh - 10.805
  const rowTop = () => vh() / 2 - 10.805 * u();

  const wordmark = document.querySelector('.wordmark');
  const nav = document.querySelector('.nav');

  const hero = document.querySelector('.hero');

  // After a resize the tweens are invalidated; nudge each animation so its
  // recalculated values are rendered even when the scroll position is at an
  // end of its range.
  const nudge = (self) => {
    const anim = self.animation;
    if (!anim) return;
    const p = self.progress;
    anim.progress(p > 0.5 ? 0 : 1, true).progress(p, true);
  };

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: '.hero-scroll',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      invalidateOnRefresh: true,
      onRefresh: nudge,
    },
  });

  // Hero stays fixed; its background fades off-white → green
  tl.fromTo(hero, { backgroundColor: '#f2efdd' }, { backgroundColor: '#767d0b' }, 0);

  // Wordmark: 146.67 → 773.33 wide; left 20 → 333.33; top rowTop → 50vh - 56.97
  tl.fromTo(
    wordmark,
    {
      x: () => (20 - 333.33) * u(),
      y: () => rowTop() - (vh() / 2 - 56.97 * u()),
      scale: 146.67 / 773.33,
    },
    { x: 0, y: 0, scale: 1 },
    0
  );

  // Nav: left 835.95 (right margin) → 427.98 (centered); top rowTop → 20
  tl.fromTo(
    nav,
    {
      x: () => (835.95 - 427.98) * u(),
      y: () => rowTop() - 20 * u(),
    },
    { x: 0, y: 0 },
    0
  );

  // Hold: once the morph finishes, the reveal text sits at the bottom of the
  // viewport and the view holds still for HOLD × viewport height of scroll
  // (the reveal section is that much taller in CSS — keep --hold in sync).
  // We counter-scroll the text through that extra distance, then release it.
  const HOLD = 0.1;
  gsap.fromTo(
    '.reveal__text',
    { y: () => -HOLD * vh() },
    {
      y: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '.reveal',
        start: 'top top',
        end: () => '+=' + HOLD * vh(),
        scrub: true,
        invalidateOnRefresh: true,
        onRefresh: nudge,
      },
    }
  );

  // Re-run once everything exists so nudge() can render every start state.
  ScrollTrigger.refresh();
})();
