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
const yieldToMain = () => new Promise((resolve) => setTimeout(resolve, 0));
let cleanup = () => {};
let run = 0;

async function configure() {
  cleanup();
  cleanup = () => {};
  const current = ++run;
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
  const context = gsap.context(() => {});
  cleanup = () => {
    controller.abort();
    disposers.forEach((dispose) => dispose());
    context.revert();
  };
  const steps = [
    () => setupHero(gsap, mobile),
    () => setupScroll(gsap, ScrollTrigger, controller.signal),
    () => setupGallery(gsap, ScrollTrigger, mobile),
    () => setupParallax(gsap, mobile),
    () => setupReveal(gsap, ScrollTrigger, controller.signal),
    () => setupMenu(gsap, ScrollTrigger),
    () => setupTicker(gsap, ScrollTrigger),
    () => setupTransitions(gsap, controller.signal),
    () => (finePointer.matches ? setupPointer(gsap, controller.signal) : () => {})
  ];
  for (const step of steps) {
    if (current !== run) return;
    context.add(() => disposers.push(step()));
    await yieldToMain();
  }
  if (current !== run) return;
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
}

reduced.addEventListener('change', configure);
finePointer.addEventListener('change', configure);
configure();
