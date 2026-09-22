(() => {
  const doc = document;
  const root = doc.documentElement;
  const media = (query) => window.matchMedia(query).matches;

  const video = doc.querySelector('[data-hero-video]');
  if (video) {
    video.poster = media('(max-aspect-ratio: 4/5)') ? 'assets/img/hero-poster-portrait.webp' : media('(max-width: 1280px)') ? 'assets/img/hero-poster-1280.webp' : 'assets/img/hero-poster-1920.webp';
    const play = () => {
      const attempt = video.play();
      if (attempt && attempt.catch) attempt.catch(() => {});
    };
    video.addEventListener('playing', () => video.classList.add('hero__video--playing'));
    let visible = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) play(); else video.pause();
      }, { threshold: 0.02 }).observe(video.closest('.hero'));
    }
    doc.addEventListener('visibilitychange', () => { if (!doc.hidden && visible) play(); });
    ['touchstart', 'pointerdown', 'scroll'].forEach((type) => window.addEventListener(type, () => { if (visible && video.paused) play(); }, { once: true, passive: true }));
    play();
  }

  const OPEN = 390;
  const CLOSE = [120, 120, 120, 120, 120, 150, 150];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const clock = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  const now = () => {
    const parts = Object.fromEntries(clock.formatToParts(new Date()).map((part) => [part.type, part.value]));
    return { day: days.indexOf(parts.weekday), minutes: Number(parts.hour) * 60 + Number(parts.minute) };
  };
  const time = (minutes) => `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`;
  const status = () => {
    const { day, minutes } = now();
    const previous = (day + 6) % 7;
    if (minutes < CLOSE[previous]) return { open: true, day, text: `Abierto ahora · cierra a las ${time(CLOSE[previous])}` };
    if (minutes >= OPEN) return { open: true, day, text: `Abierto ahora · hasta las ${time(CLOSE[day])}` };
    return { open: false, day, text: 'Cerrado ahora · abre a las 6:30' };
  };
  const paint = () => {
    const current = status();
    doc.querySelectorAll('[data-status]').forEach((element) => {
      element.classList.toggle('status--closed', !current.open);
      element.querySelector('[data-status-text]').textContent = current.text;
    });
    doc.querySelectorAll('[data-day]').forEach((row) => row.classList.toggle('hours__row--today', Number(row.dataset.day) === current.day));
  };
  try {
    paint();
    setInterval(paint, 60000);
  } catch (error) {}

  const header = doc.querySelector('[data-header]');
  const bar = doc.querySelector('[data-actionbar]');
  let ticking = false;
  const chrome = () => {
    ticking = false;
    const y = window.scrollY;
    header.classList.toggle('hdr--solid', y > 40);
    bar.classList.toggle('actionbar--show', y > window.innerHeight * 0.55);
  };
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(chrome);
  }, { passive: true });
  requestAnimationFrame(chrome);

  const year = doc.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
  root.classList.add('js');
})();
