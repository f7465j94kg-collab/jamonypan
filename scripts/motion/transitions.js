export function setupTransitions(gsap, signal) {
  const curtain = document.querySelector('.curtain');
  if (!curtain) return () => {};
  const reset = () => {
    gsap.set(curtain, { clipPath: 'inset(100% 0 0 0)' });
    curtain.hidden = true;
  };
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-transition]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    curtain.hidden = false;
    gsap.fromTo(curtain, { clipPath: 'inset(100% 0 0 0)' }, {
      clipPath: 'inset(0% 0 0 0)',
      duration: 0.55,
      ease: 'power3.inOut',
      onComplete: () => { window.location.href = link.href; }
    });
    gsap.fromTo(curtain.querySelector('.curtain__mark'), { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, delay: 0.15, ease: 'power3.out' });
  }, { signal });
  window.addEventListener('pageshow', (event) => { if (event.persisted) reset(); }, { signal });
  return reset;
}
