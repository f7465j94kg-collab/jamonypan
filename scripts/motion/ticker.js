export function setupTicker(gsap, ScrollTrigger) {
  const track = document.querySelector('.ticker__track');
  if (!track) return () => {};
  const loop = gsap.to(track, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 });
  let direction = 1;
  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      direction = self.direction;
      const boost = Math.min(Math.abs(self.getVelocity()) / 250, 7);
      gsap.to(loop, { timeScale: direction * (1 + boost), duration: 0.2, overwrite: true });
      gsap.to(loop, { timeScale: direction, duration: 1, delay: 0.25, ease: 'power2.out' });
    }
  });
  return () => loop.kill();
}
