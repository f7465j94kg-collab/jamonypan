export function setupReveal(gsap, ScrollTrigger, signal) {
  const counters = [];
  let disposed = false;

  document.querySelectorAll('[data-sweep]').forEach((element) => {
    if (element.closest('.hero')) return;
    gsap.from(element, {
      yPercent: 30,
      opacity: 0,
      clipPath: 'inset(0 0 100% 0)',
      duration: 0.95,
      ease: 'power3.out',
      scrollTrigger: { trigger: element, start: 'top 92%', once: true }
    });
  });

  document.querySelectorAll('[data-rise]').forEach((element) => {
    gsap.from(element, {
      y: 42,
      opacity: 0,
      duration: 0.9,
      delay: Number(element.dataset.rise || 0) * 0.08,
      ease: 'power3.out',
      scrollTrigger: { trigger: element, start: 'top 94%', once: true }
    });
  });

  const flips = gsap.utils.toArray('[data-flip]');
  gsap.set(flips, { transformPerspective: 900, transformOrigin: '50% 0%' });
  ScrollTrigger.batch(flips, {
    start: 'top 92%',
    once: true,
    onEnter: (batch) => gsap.from(batch, { rotationX: -55, y: 50, opacity: 0, duration: 1, stagger: 0.09, ease: 'power3.out', overwrite: true })
  });

  document.querySelectorAll('[data-swing]').forEach((element, index) => {
    gsap.from(element, {
      y: 70,
      rotation: index % 2 ? 3 : -3,
      rotationY: index % 2 ? -18 : 18,
      transformPerspective: 1000,
      opacity: 0,
      duration: 1.1,
      delay: index * 0.08,
      ease: 'power3.out',
      scrollTrigger: { trigger: element, start: 'top 94%', once: true }
    });
  });

  const chips = gsap.utils.toArray('.chip');
  if (chips.length) {
    gsap.from(chips, {
      y: 22,
      scale: 0.9,
      opacity: 0,
      duration: 0.55,
      stagger: 0.05,
      ease: 'back.out(1.7)',
      scrollTrigger: { trigger: chips[0].parentElement, start: 'top 92%', once: true }
    });
  }

  document.querySelectorAll('[data-count]').forEach((element) => {
    const target = Number(element.dataset.count);
    const decimals = Number(element.dataset.decimals || 0);
    const suffix = element.dataset.suffix || '';
    const original = element.textContent;
    const value = { count: 0 };
    counters.push([element, original, gsap.to(value, {
      count: target,
      duration: 1.8,
      ease: 'power2.out',
      onUpdate: () => { if (!disposed) element.textContent = `${value.count.toFixed(decimals).replace('.', ',')}${suffix}`; },
      onComplete: () => { if (!disposed) element.textContent = original; },
      scrollTrigger: { trigger: element, start: 'top 94%', once: true }
    })]);
  });

  document.addEventListener('focusin', (event) => {
    if (!event.target.matches(':focus-visible')) return;
    const scope = event.target.closest('[data-sweep], [data-rise], [data-flip], [data-swing], .chip') || event.target;
    gsap.getTweensOf(scope).forEach((tween) => tween.progress(1));
  }, { signal });

  return () => {
    disposed = true;
    counters.forEach(([element, original, tween]) => {
      tween.kill();
      element.textContent = original;
    });
  };
}
