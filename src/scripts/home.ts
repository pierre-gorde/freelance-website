import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import {
  EASE_FOLLOW,
  EASE_OUT,
  MEDIA_DESKTOP,
  MEDIA_MOBILE,
  MEDIA_MOTION_OK,
  MEDIA_POINTER_FINE,
  STAMP_SCALE,
  TOGGLE_REPLAY,
} from '../lib/motion.const';

gsap.registerPlugin(ScrollTrigger);

const TYPING_DELAY_MS = 1100;
const TYPING_STEP_MS = 18;
const TYPING_CHARS_PER_STEP = 2;
const TYPING_LINE_PAUSE_MS = 280;
const MARQUEE_SPEED = 42;
const MARQUEE_BOOST_MAX = 1100;
const MARQUEE_BOOST_DECAY = 0.93;
const STRIP_SKEW_MAX = 6;

const root = document.documentElement;
const one = <T extends Element = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector);
const all = <T extends Element = HTMLElement>(selector: string, scope: ParentNode = document) => [
  ...scope.querySelectorAll<T>(selector),
];

/** Le compte-rendu du hero s'écrit ligne par ligne, puis le tampon « Envoyé » se pose. */
function typeReport(): () => void {
  const report = one('[data-report="typing"]');
  if (!report) return () => {};
  const lines = all('[data-type]', report);
  const stamp = report.querySelector<HTMLElement>('[data-report-stamp]');
  const texts = lines.map((line) => line.textContent ?? '');
  let timer = 0;

  const showAll = () => {
    window.clearTimeout(timer);
    lines.forEach((line, i) => {
      line.textContent = texts[i];
      line.style.minHeight = '';
    });
    report.removeAttribute('aria-busy');
    if (stamp) gsap.set(stamp, { clearProps: 'all' });
  };

  lines.forEach((line) => {
    line.style.minHeight = `${line.offsetHeight}px`;
    line.textContent = '';
  });
  report.setAttribute('aria-busy', 'true');
  if (stamp) gsap.set(stamp, { autoAlpha: 0 });

  const caret = document.createElement('span');
  caret.className = 'caret';
  caret.setAttribute('aria-hidden', 'true');
  let lineIndex = 0;
  let charIndex = 0;

  const tick = () => {
    const line = lines[lineIndex];
    const full = texts[lineIndex];
    charIndex = Math.min(full.length, charIndex + TYPING_CHARS_PER_STEP);
    line.textContent = full.slice(0, charIndex);
    line.append(caret);
    if (charIndex < full.length) {
      timer = window.setTimeout(tick, TYPING_STEP_MS);
      return;
    }
    line.textContent = full;
    lineIndex += 1;
    charIndex = 0;
    if (lineIndex < lines.length) {
      timer = window.setTimeout(tick, TYPING_LINE_PAUSE_MS);
      return;
    }
    report.removeAttribute('aria-busy');
    if (stamp) {
      gsap.fromTo(
        stamp,
        { autoAlpha: 1, scale: 2.3, rotation: -26 },
        { scale: 1, rotation: -8, duration: 0.55, ease: EASE_OUT }
      );
    }
  };
  timer = window.setTimeout(tick, TYPING_DELAY_MS);
  return showAll;
}

function heroScroll(): void {
  const hero = one('.hero');
  const portraitCase = one('[data-hero-case]');
  if (!hero || !portraitCase) return;
  const scrub = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };
  gsap.to(portraitCase, { backgroundPosition: '0px -90px', ease: 'none', scrollTrigger: scrub });
  gsap.to('[data-hero-portrait]', { yPercent: 6, ease: 'none', scrollTrigger: { ...scrub } });
}

/** Le portrait penche vers la souris ; bulle et compte-rendu suivent à d'autres profondeurs. */
function heroPointer(): () => void {
  const hero = one('.hero');
  const visual = one('[data-hero-visual]');
  const portraitCase = one('[data-hero-case]');
  const bubble = one('[data-hero-bubble]');
  const report = one('[data-report="typing"]');
  if (!hero || !visual || !portraitCase || !bubble || !report) return () => {};

  gsap.set(portraitCase, { transformPerspective: 900 });
  const follow = { duration: 0.6, ease: EASE_FOLLOW };
  const rotateX = gsap.quickTo(portraitCase, 'rotationX', follow);
  const rotateY = gsap.quickTo(portraitCase, 'rotationY', follow);
  const portraitX = gsap.quickTo('[data-hero-portrait]', 'x', follow);
  // Bulle et compte-rendu ont une animation CSS d'entrée sur transform : on décale via `translate`.
  gsap.set([bubble, report], { '--px': 0, '--py': 0 });
  const slow = { duration: 0.8, ease: EASE_FOLLOW };
  const bubbleX = gsap.quickTo(bubble, '--px', slow);
  const bubbleY = gsap.quickTo(bubble, '--py', slow);
  const reportX = gsap.quickTo(report, '--px', slow);

  const move = (event: PointerEvent) => {
    const rect = visual.getBoundingClientRect();
    const nx = gsap.utils.clamp(
      -1,
      1,
      (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
    );
    const ny = gsap.utils.clamp(
      -1,
      1,
      (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
    );
    rotateX(-ny * 7);
    rotateY(nx * 9);
    portraitX(nx * 12);
    bubbleX(nx * 16);
    bubbleY(ny * 10);
    reportX(-nx * 10);
  };
  const reset = () => {
    rotateX(0);
    rotateY(0);
    portraitX(0);
    bubbleX(0);
    bubbleY(0);
    reportX(0);
  };
  hero.addEventListener('pointermove', move);
  hero.addEventListener('pointerleave', reset);
  return () => {
    hero.removeEventListener('pointermove', move);
    hero.removeEventListener('pointerleave', reset);
  };
}

/** Bandeau clients : il accélère et change de sens avec le défilement, s'arrête au survol. */
function marquee(): () => void {
  const box = one('[data-marquee]');
  const track = one('[data-marquee-track]');
  if (!box || !track) return () => {};
  root.classList.add('js-marquee');
  const setX = gsap.quickSetter(track, 'x', 'px');
  let half = track.scrollWidth / 2;
  let position = 0;
  let boost = 0;
  let direction = 1;
  let paused = false;

  const pause = () => (paused = true);
  const resume = () => (paused = false);
  const measure = () => (half = track.scrollWidth / 2);
  box.addEventListener('pointerenter', pause);
  box.addEventListener('pointerleave', resume);
  box.addEventListener('focusin', pause);
  box.addEventListener('focusout', resume);
  window.addEventListener('resize', measure);

  const tick = (_time: number, deltaMs: number) => {
    if (!paused) {
      position -= ((MARQUEE_SPEED + boost) * direction * deltaMs) / 1000;
      if (position <= -half) position += half;
      if (position > 0) position -= half;
      setX(position);
    }
    boost *= MARQUEE_BOOST_DECAY;
  };
  gsap.ticker.add(tick);
  const velocity = ScrollTrigger.create({
    onUpdate: (self) => {
      direction = self.direction;
      boost = Math.min(Math.abs(self.getVelocity()) / 2.5, MARQUEE_BOOST_MAX);
    },
  });

  return () => {
    gsap.ticker.remove(tick);
    velocity.kill();
    box.removeEventListener('pointerenter', pause);
    box.removeEventListener('pointerleave', resume);
    box.removeEventListener('focusin', pause);
    box.removeEventListener('focusout', resume);
    window.removeEventListener('resize', measure);
    root.classList.remove('js-marquee');
  };
}

/** Desktop : la section projets s'épingle et les dossiers défilent à l'horizontale. */
function pinnedStrip(): () => void {
  const section = one('[data-strip]');
  const track = one('[data-strip-track]');
  const header = one('#site-header');
  if (!section || !track || !header) return () => {};
  const wrap = section.querySelector<HTMLElement>('.wrap');
  if (!wrap) return () => {};
  root.classList.add('is-pinned');

  const distance = () =>
    Math.max(
      0,
      track.scrollWidth - wrap.clientWidth + parseFloat(getComputedStyle(wrap).paddingRight)
    );
  const start = () => `top ${header.offsetHeight}`;
  const skewTo = gsap.quickTo(track, 'skewX', { duration: 0.5, ease: EASE_FOLLOW });

  const ride = gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start,
      end: () => `+=${distance()}`,
      pin: true,
      scrub: 0.6,
      invalidateOnRefresh: true,
      anticipatePin: 1,
      onUpdate: (self) =>
        skewTo(gsap.utils.clamp(-STRIP_SKEW_MAX, STRIP_SKEW_MAX, self.getVelocity() / -260)),
    },
  });

  gsap.fromTo(
    '[data-strip-progress]',
    { scaleX: 0 },
    {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { trigger: section, start, end: () => `+=${distance()}`, scrub: true },
    }
  );

  all(':scope > li', track).forEach((panel, i) => {
    const stamp = panel.querySelector('.stamp');
    if (stamp) {
      gsap.from(stamp, {
        scale: STAMP_SCALE,
        rotation: i % 2 ? 18 : -20,
        duration: 0.5,
        ease: EASE_OUT,
        scrollTrigger: {
          trigger: panel,
          containerAnimation: ride,
          start: 'left 92%',
          toggleActions: TOGGLE_REPLAY,
        },
      });
    }
    const crossing = {
      trigger: panel,
      containerAnimation: ride,
      start: 'left right',
      end: 'right left',
      scrub: true,
    };
    const shot = panel.querySelector('.panel-shot');
    if (shot)
      gsap.fromTo(shot, { xPercent: -7 }, { xPercent: 7, ease: 'none', scrollTrigger: crossing });
    const title = panel.querySelector('.panel-title');
    if (title)
      gsap.fromTo(title, { x: 40 }, { x: -20, ease: 'none', scrollTrigger: { ...crossing } });
  });

  return () => root.classList.remove('is-pinned');
}

function mobileStamps(): void {
  all('[data-strip-track] > li .stamp').forEach((stamp, i) => {
    gsap.from(stamp, {
      scale: STAMP_SCALE,
      rotation: i % 2 ? 18 : -20,
      duration: 0.5,
      ease: EASE_OUT,
      scrollTrigger: { trigger: stamp, start: 'top 95%', toggleActions: TOGGLE_REPLAY },
    });
  });
}

const mm = gsap.matchMedia();

mm.add(MEDIA_MOTION_OK, () => {
  heroScroll();
  const stopTyping = typeReport();
  const stopMarquee = marquee();
  return () => {
    stopTyping();
    stopMarquee();
  };
});

mm.add(`${MEDIA_POINTER_FINE} and ${MEDIA_MOTION_OK}`, () => heroPointer());
mm.add(`${MEDIA_DESKTOP} and ${MEDIA_MOTION_OK}`, () => pinnedStrip());
mm.add(`${MEDIA_MOBILE} and ${MEDIA_MOTION_OK}`, () => mobileStamps());

ScrollTrigger.sort();
ScrollTrigger.refresh();
