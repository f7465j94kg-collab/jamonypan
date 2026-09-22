export function setupGallery(gsap, ScrollTrigger, mobile) {
  const section = document.querySelector('[data-gallery]');
  if (!section) return () => {};
  const pin = section.querySelector('.galeria__pin');
  const stage = section.querySelector('.galeria__stage');
  const track = section.querySelector('.galeria__track');
  const cards = [...track.querySelectorAll('.foto')];
  const setters = cards.map((card) => ({
    rotate: gsap.quickSetter(card, 'rotationY', 'deg'),
    depth: gsap.quickSetter(card, 'z', 'px'),
    scale: gsap.quickSetter(card, 'scale'),
    shade: gsap.quickSetter(card, 'filter')
  }));
  let centers = [];
  let width = 0;
  const measure = () => {
    width = stage.clientWidth;
    centers = cards.map((card) => card.offsetLeft + card.offsetWidth / 2);
  };
  const distance = () => Math.max(0, track.scrollWidth - stage.clientWidth);
  const swing = mobile ? 38 : 30;
  const paint = () => {
    const x = gsap.getProperty(track, 'x');
    centers.forEach((center, index) => {
      const offset = (center + x - width / 2) / width;
      const clamped = Math.max(-1.2, Math.min(1.2, offset));
      setters[index].rotate(clamped * -swing);
      setters[index].depth(Math.abs(clamped) * -220);
      setters[index].scale(1 - Math.min(Math.abs(clamped) * 0.1, 0.12));
      setters[index].shade(`brightness(${(1 - Math.min(Math.abs(clamped) * 0.45, 0.5)).toFixed(3)})`);
    });
  };

  gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: pin,
      start: 'top top',
      end: () => `+=${distance() * (mobile ? 1.1 : 1)}`,
      pin: true,
      scrub: mobile ? 0.35 : 0.7,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onRefresh: () => { measure(); paint(); },
      onUpdate: paint
    }
  });

  gsap.from(cards, {
    y: 80,
    opacity: 0,
    rotationX: -25,
    duration: 1,
    stagger: 0.08,
    ease: 'power3.out',
    scrollTrigger: { trigger: section, start: 'top 75%', once: true }
  });

  measure();
  paint();
  return () => {};
}
