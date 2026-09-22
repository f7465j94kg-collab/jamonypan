export function setupScroll(gsap, ScrollTrigger, signal) {
  const lenis = window.Lenis ? new window.Lenis({ duration: 1.12, smoothWheel: true, syncTouch: false }) : null;
  const tick = (time) => lenis?.raf(time * 1000);
  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const id = link.getAttribute('href').slice(1);
      const destination = id ? document.getElementById(id) : null;
      if (!destination) return;
      event.preventDefault();
      history.pushState(null, '', `#${id}`);
      const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header')) || 64;
      lenis.scrollTo(destination, {
        offset: id === 'top' ? 0 : -header,
        immediate: link.classList.contains('skip'),
        onComplete: () => {
          const hadTabindex = destination.hasAttribute('tabindex');
          if (!hadTabindex) destination.setAttribute('tabindex', '-1');
          destination.focus({ preventScroll: true });
          if (!hadTabindex) destination.addEventListener('blur', () => destination.removeAttribute('tabindex'), { once: true });
        }
      });
    }, { signal });
  }

  const progress = document.querySelector('.progress');
  if (progress) {
    gsap.fromTo(progress, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 } });
  }

  const refresh = () => { lenis?.resize(); ScrollTrigger.refresh(); };
  document.querySelectorAll('img[loading="lazy"]').forEach((image) => {
    if (!image.complete) image.addEventListener('load', () => ScrollTrigger.refresh(), { signal, once: true });
  });
  window.addEventListener('load', refresh, { signal, once: true });
  window.addEventListener('pageshow', refresh, { signal });
  document.fonts?.ready.then(() => { if (!signal.aborted) refresh(); });
  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
  };
}
