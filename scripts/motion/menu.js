export function setupMenu(gsap, ScrollTrigger) {
  const list = document.querySelector('.tabs__list');
  if (list) {
    const links = [...list.querySelectorAll('.tabs__link')];
    const activate = (link) => {
      links.forEach((item) => item.classList.toggle('tabs__link--active', item === link));
      list.scrollTo({ left: link.offsetLeft - (list.clientWidth - link.offsetWidth) / 2, behavior: 'smooth' });
    };
    links.forEach((link) => {
      const section = document.querySelector(link.getAttribute('href'));
      if (!section) return;
      ScrollTrigger.create({
        trigger: section,
        start: 'top 45%',
        end: 'bottom 45%',
        onToggle: (self) => { if (self.isActive) activate(link); }
      });
    });
  }

  const items = gsap.utils.toArray('.item, .barra__item');
  if (items.length) {
    gsap.set(items, { opacity: 0, x: -28 });
    ScrollTrigger.batch(items, {
      start: 'top 94%',
      once: true,
      onEnter: (batch) => gsap.to(batch, { opacity: 1, x: 0, duration: 0.6, stagger: 0.045, ease: 'power3.out', overwrite: true })
    });
  }

  document.querySelectorAll('.price').forEach((price) => {
    gsap.from(price, {
      scale: 0.6,
      opacity: 0,
      duration: 0.5,
      ease: 'back.out(2)',
      scrollTrigger: { trigger: price, start: 'top 94%', once: true }
    });
  });

  return () => {};
}
