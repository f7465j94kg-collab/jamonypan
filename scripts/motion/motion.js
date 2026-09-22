import { setupScroll } from './scroll.js';
import { setupHero } from './hero.js';
import { setupParallax } from './parallax.js';
import { setupReveal } from './reveal.js';
import { setupGallery } from './gallery.js';
import { setupTicker } from './ticker.js';
import { setupPointer } from './pointer.js';
import { setupMenu } from './menu.js';
import { setupTransitions } from './transitions.js';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const root = document.documentElement;
let cleanup = () => {};

function configure() {
  cleanup();
  cleanup = () => {};
  const enabled = !reduced.matches;
  const available = Boolean(window.gsap && window.ScrollTrigger);
  root.classList.toggle('motion-enabled', enabled && available);
  if (!enabled || !available) return;
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  const mobile = window.matchMedia('(max-width: 700px)').matches;
  const controller = new AbortController();
  const disposers = [];
  const context = gsap.context(() => {
    disposers.push(setupScroll(gsap, ScrollTrigger, controller.signal));
    disposers.push(setupHero(gsap, mobile));
    disposers.push(setupParallax(gsap, mobile));
    disposers.push(setupGallery(gsap, ScrollTrigger, mobile));
    disposers.push(setupReveal(gsap, ScrollTrigger, controller.signal));
    disposers.push(setupTicker(gsap, ScrollTrigger));
    disposers.push(setupMenu(gsap, ScrollTrigger));
    disposers.push(setupTransitions(gsap, controller.signal));
    if (finePointer.matches) disposers.push(setupPointer(gsap, controller.signal));
  });
  ScrollTrigger.refresh();
  cleanup = () => {
    controller.abort();
    disposers.forEach((dispose) => dispose());
    context.revert();
  };
}

reduced.addEventListener('change', configure);
finePointer.addEventListener('change', configure);
configure();
