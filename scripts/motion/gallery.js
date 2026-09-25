export function setupGallery(gsap, ScrollTrigger, mobile) {
  const section = document.querySelector('[data-gallery]');
  if (!section) return () => {};
  const pin = section.querySelector('.galeria__pin');
  const stage = section.querySelector('.galeria__stage');
  const track = section.querySelector('.galeria__track');
  const cards = [...track.querySelectorAll('.foto')];
  const touch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const mode = touch ? 'galeria--swipe' : 'galeria--pinned';
  section.classList.add(mode);
  gsap.set(cards, { transformPerspective: 900 });

  const setters = cards.map((card) => ({
    rotate: gsap.quickSetter(card, 'rotationY', 'deg'),
    depth: gsap.quickSetter(card, 'z', 'px'),
    scaleX: gsap.quickSetter(card, 'scaleX'),
    scaleY: gsap.quickSetter(card, 'scaleY'),
    shade: gsap.quickSetter(card, 'filter'),
    caption: gsap.quickSetter(card.querySelector('.foto__cap'), 'y', 'px')
  }));
  let centers = [];
  let width = 0;
  const measure = () => {
    width = stage.clientWidth;
    centers = cards.map((card) => card.offsetLeft + card.offsetWidth / 2);
  };
  const swing = mobile ? 42 : 30;
  const paint = (shift) => {
    centers.forEach((center, index) => {
      const offset = (center - shift - width / 2) / width;
      const clamped = Math.max(-1.2, Math.min(1.2, offset));
      const distance = Math.abs(clamped);
      const scale = 1 - Math.min(distance * 0.12, 0.14);
      setters[index].rotate(clamped * -swing);
      setters[index].depth(distance * -180);
      setters[index].scaleX(scale);
      setters[index].scaleY(scale);
      setters[index].shade(`brightness(${(1 - Math.min(distance * 0.5, 0.55)).toFixed(3)})`);
      setters[index].caption(Math.min(distance * 60, 40));
    });
  };

  gsap.from(cards, {
    y: 90,
    opacity: 0,
    rotationX: -30,
    duration: 1.1,
    stagger: 0.08,
    ease: 'power3.out',
    scrollTrigger: { trigger: section, start: 'top 80%', once: true }
  });

  if (!touch) {
    gsap.to(track, {
      x: () => -Math.max(0, track.scrollWidth - stage.clientWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: () => `+=${Math.max(0, track.scrollWidth - stage.clientWidth)}`,
        pin: true,
        scrub: 0.7,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: () => { measure(); paint(-gsap.getProperty(track, 'x')); },
        onUpdate: () => paint(-gsap.getProperty(track, 'x'))
      }
    });
    measure();
    paint(0);
    return () => section.classList.remove(mode);
  }

  let frame = 0;
  let driving = true;
  let expected = track.scrollLeft;
  const repaint = () => {
    frame = 0;
    paint(track.scrollLeft);
  };
  const queue = () => {
    if (driving && Math.abs(track.scrollLeft - expected) > 3) release();
    if (!frame) frame = requestAnimationFrame(repaint);
  };
  function release() {
    if (!driving) return;
    driving = false;
    section.classList.remove('galeria--driven');
  }
  section.classList.add('galeria--driven');
  track.addEventListener('scroll', queue, { passive: true });
  track.addEventListener('touchstart', release, { passive: true, once: true });
  track.addEventListener('pointerdown', release, { passive: true, once: true });
  track.addEventListener('keydown', release, { once: true });

  const drive = ScrollTrigger.create({
    trigger: section,
    start: 'top 85%',
    end: 'bottom 15%',
    onUpdate: (self) => {
      if (!driving) return;
      const max = track.scrollWidth - track.clientWidth;
      track.scrollLeft = gsap.utils.interpolate(0, max * 0.55, self.progress);
      expected = track.scrollLeft;
    },
    onRefresh: () => { measure(); queue(); }
  });

  measure();
  paint(track.scrollLeft);
  return () => {
    drive.kill();
    cancelAnimationFrame(frame);
    track.removeEventListener('scroll', queue);
    section.classList.remove(mode, 'galeria--driven');
  };
}
