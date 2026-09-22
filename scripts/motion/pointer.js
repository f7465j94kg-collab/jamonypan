export function setupPointer(gsap, signal) {
  document.querySelectorAll('[data-tilt]').forEach((scene) => {
    const target = scene.querySelector('img');
    if (!target) return;
    const rotateX = gsap.quickTo(target, 'rotationX', { duration: 0.55, ease: 'power2.out' });
    const rotateY = gsap.quickTo(target, 'rotationY', { duration: 0.55, ease: 'power2.out' });
    const liftX = gsap.quickTo(target, 'scaleX', { duration: 0.6, ease: 'power2.out' });
    const liftY = gsap.quickTo(target, 'scaleY', { duration: 0.6, ease: 'power2.out' });
    const lift = (value) => { liftX(value); liftY(value); };
    gsap.set(target, { transformPerspective: 1000 });
    scene.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse') return;
      const rect = scene.getBoundingClientRect();
      const dx = (event.clientX - rect.left) / rect.width - 0.5;
      const dy = (event.clientY - rect.top) / rect.height - 0.5;
      rotateX(-dy * 8);
      rotateY(dx * 10);
      lift(1.05);
    }, { signal, passive: true });
    scene.addEventListener('pointerleave', () => { rotateX(0); rotateY(0); lift(1); }, { signal });
  });
  return () => {};
}
