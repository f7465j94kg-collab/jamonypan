export function setupHero(gsap, mobile) {
  const hero = document.querySelector('.hero');
  if (!hero) return () => {};
  const media = hero.querySelector('.hero__media');
  const content = hero.querySelector('.hero__content');
  const edge = hero.querySelector('.hero__edge');

  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro.from(media, { scale: 1.12, duration: 1.8, ease: 'power2.out' }, 0);
  intro.from(hero.querySelectorAll('[data-sweep]'), { yPercent: 60, opacity: 0, clipPath: 'inset(0 0 100% 0)', duration: 0.95, stagger: 0.1 }, 0.15);
  intro.from(edge, { yPercent: 100, duration: 1.1 }, 0.3);

  const scroll = { trigger: hero, start: 'top top', end: 'bottom top', scrub: mobile ? 0.4 : 1 };
  gsap.to(media, { yPercent: mobile ? 10 : 16, scale: mobile ? 1.06 : 1.1, ease: 'none', scrollTrigger: scroll });
  gsap.to(content, { y: mobile ? -40 : -90, opacity: 0, ease: 'none', scrollTrigger: { ...scroll, end: 'bottom 30%' } });
  gsap.to(edge, { y: mobile ? -36 : -80, ease: 'none', scrollTrigger: scroll });
  return () => {};
}
