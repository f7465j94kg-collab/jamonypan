export function setupParallax(gsap, mobile) {
  const factor = mobile ? 0.6 : 1;

  document.querySelectorAll('[data-depth]').forEach((layer) => {
    const depth = Number(layer.dataset.depth) * factor;
    const scene = layer.closest('[data-scene]') || layer.parentElement;
    const vars = { y: depth * -160, ease: 'none', scrollTrigger: { trigger: scene, start: 'top bottom', end: 'bottom top', scrub: mobile ? 0.3 : 0.8 } };
    if (layer.hasAttribute('data-spin')) vars.rotation = depth * 260;
    gsap.fromTo(layer, { y: depth * 160, rotation: 0 }, vars);
  });

  document.querySelectorAll('.bg-photo').forEach((frame) => {
    const image = frame.querySelector('img');
    gsap.fromTo(image, { yPercent: -8, scale: 1.16 }, {
      yPercent: 8,
      scale: 1.02,
      ease: 'none',
      scrollTrigger: { trigger: frame.parentElement, start: 'top bottom', end: 'bottom top', scrub: mobile ? 0.3 : 0.8 }
    });
  });

  document.querySelectorAll('[data-tiltscroll]').forEach((element, index) => {
    gsap.fromTo(element, { rotationY: index % 2 ? 14 : -14, rotationX: 8, transformPerspective: 900 }, {
      rotationY: index % 2 ? -6 : 6,
      rotationX: -4,
      ease: 'none',
      scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: 0.6 }
    });
  });

  return () => {};
}
