import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import {
  EASE_FOLLOW,
  EASE_OUT,
  MAGNET_PULL_X,
  MAGNET_PULL_Y,
  MEDIA_MOTION_OK,
  MEDIA_POINTER_FINE,
  POP_SCALE,
  RISE_OFFSET,
  RISE_ROTATIONS,
  SLAM_ROTATIONS,
  SLAM_SCALE,
  STAMP_SCALE,
  START_ENTER,
  START_ENTER_LATE,
  TOGGLE_REPLAY,
} from '../lib/motion.const';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const all = <T extends Element = HTMLElement>(selector: string, root: ParentNode = document) => [
  ...root.querySelectorAll<T>(selector),
];

const pick = <T>(list: readonly T[], index: number): T => list[index % list.length];

/** Découpe le texte en mots (.w) sans toucher aux éléments enfants (surlignage, liens). */
function splitWords(node: Node): void {
  [...node.childNodes].forEach((child) => {
    if (child.nodeType === Node.ELEMENT_NODE) {
      if (!(child as Element).classList.contains('w')) splitWords(child);
      return;
    }
    if (child.nodeType !== Node.TEXT_NODE || !child.textContent?.trim()) return;
    const fragment = document.createDocumentFragment();
    // Découpe sur les espaces simples seulement : les insécables gardent « ? » collé au mot.
    child.textContent.split(/([ \t\n\r]+)/).forEach((part) => {
      if (!part) return;
      if (/^[ \t\n\r]+$/.test(part)) {
        fragment.append(' ');
        return;
      }
      const word = document.createElement('span');
      word.className = 'w';
      word.textContent = part;
      fragment.append(word);
    });
    child.replaceWith(fragment);
  });
}

function slams(): void {
  all('[data-slam]').forEach((heading) => {
    splitWords(heading);
    gsap.from(all('.w', heading), {
      scale: SLAM_SCALE,
      yPercent: -22,
      rotation: (i: number) => pick(SLAM_ROTATIONS, i),
      duration: 0.7,
      ease: EASE_OUT,
      stagger: 0.06,
      scrollTrigger: { trigger: heading, start: 'top 88%', toggleActions: TOGGLE_REPLAY },
    });
  });
}

function rises(): void {
  all('[data-rise]').forEach((group) => {
    gsap.from(group.children, {
      y: RISE_OFFSET,
      rotation: (i: number) => pick(RISE_ROTATIONS, i),
      duration: 0.8,
      ease: EASE_OUT,
      stagger: 0.1,
      scrollTrigger: { trigger: group, start: START_ENTER, toggleActions: TOGGLE_REPLAY },
    });
  });
}

function stamps(): void {
  all('[data-stamp]').forEach((stamp, i) => {
    gsap.from(stamp, {
      scale: STAMP_SCALE,
      rotation: i % 2 ? 18 : -20,
      duration: 0.5,
      ease: EASE_OUT,
      scrollTrigger: { trigger: stamp, start: 'top 92%', toggleActions: TOGGLE_REPLAY },
    });
  });
}

function pops(): void {
  all('[data-pop]').forEach((group) => {
    const targets = group.children.length ? group.children : group;
    gsap.from(targets, {
      scale: POP_SCALE,
      rotation: -20,
      duration: 0.6,
      ease: EASE_OUT,
      stagger: 0.12,
      delay: 0.2,
      scrollTrigger: { trigger: group, start: START_ENTER, toggleActions: TOGGLE_REPLAY },
    });
  });
}

function flips(): void {
  all('[data-flip]').forEach((group) => {
    gsap.from(group.children, {
      rotationY: -95,
      transformOrigin: '0% 50%',
      duration: 0.9,
      ease: EASE_OUT,
      stagger: 0.16,
      scrollTrigger: { trigger: group, start: 'top 82%', toggleActions: TOGGLE_REPLAY },
    });
  });
}

function lines(): void {
  all('[data-line]').forEach((line) => {
    gsap.fromTo(
      line,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: line, start: 'top 85%', end: 'clamp(top 35%)', scrub: 0.5 },
      }
    );
  });
}

const WIPES: Record<string, [string, string]> = {
  diag: ['polygon(0% 0%, 22% 0%, 0% 100%, 0% 100%)', 'polygon(0% 0%, 140% 0%, 100% 100%, 0% 100%)'],
  left: ['inset(0% 100% 0% 0%)', 'inset(0% 0% 0% 0%)'],
  right: ['inset(0% 0% 0% 100%)', 'inset(0% 0% 0% 0%)'],
};

function wipes(): void {
  all('[data-wipe]').forEach((section) => {
    const [from, to] = WIPES[section.dataset.wipe ?? 'diag'] ?? WIPES.diag;
    gsap.fromTo(
      section,
      { clipPath: from },
      {
        clipPath: to,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'clamp(top 98%)',
          end: 'clamp(top 45%)',
          scrub: 0.5,
        },
      }
    );
  });
}

function parallax(): void {
  all('[data-parallax]').forEach((el) => {
    const amount = Number(el.dataset.parallax) || 10;
    gsap.fromTo(
      el,
      { yPercent: -amount },
      {
        yPercent: amount,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      }
    );
  });
}

function tilts(): void {
  all('[data-tilt]').forEach((el) => {
    const [from, to] = (el.dataset.tilt ?? '-10,-3').split(',').map(Number);
    gsap.fromTo(
      el,
      { rotation: from, y: 40 },
      {
        rotation: to,
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'clamp(center center)',
          scrub: 0.6,
        },
      }
    );
  });
}

/** L'image s'imprime en trame de points quand elle arrive à l'écran. */
function prints(): () => void {
  const images = all<HTMLImageElement>('[data-print]');
  const done = (event: Event) => {
    const img = event.currentTarget as HTMLElement;
    img.classList.remove('printing', 'print-ready');
  };
  images.forEach((img) => {
    img.addEventListener('animationend', done);
    img.classList.add('print-ready');
    ScrollTrigger.create({
      trigger: img,
      start: 'top 90%',
      once: true,
      onEnter: () => img.classList.add('printing'),
    });
  });
  return () =>
    images.forEach((img) => {
      img.removeEventListener('animationend', done);
      img.classList.remove('printing', 'print-ready');
    });
}

/** Schémas d'architecture : les flèches se tracent, les boîtes se posent. */
function draws(): void {
  all('[data-draw]').forEach((figure) => {
    const arrows = all<SVGGeometryElement>('.sch-arrow:not(.sch-arrow--dashed)', figure);
    arrows.forEach((line) => {
      const length = line.getTotalLength();
      gsap.set(line, { strokeDasharray: length });
    });
    const tl = gsap.timeline({
      scrollTrigger: { trigger: figure, start: 'top 75%', toggleActions: TOGGLE_REPLAY },
    });
    tl.from(all('.sch-node, .sch-legacy, .sch-zone', figure), {
      scale: 0.4,
      transformOrigin: '50% 50%',
      duration: 0.5,
      ease: EASE_OUT,
      stagger: 0.06,
    });
    tl.from(
      arrows,
      {
        strokeDashoffset: (_i: number, line: SVGGeometryElement) => line.getTotalLength(),
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.05,
      },
      0.25
    );
    tl.from(
      all('.sch-note, .sch-arrow--dashed', figure),
      { opacity: 0, duration: 0.4, stagger: 0.05 },
      0.5
    );
  });
}

function pageProgress(): void {
  all('[data-page-progress]').forEach((bar) => {
    gsap.to(bar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
    });
  });
}

/** Le grand nom du pied de page monte lettre par lettre à mesure qu'on arrive en bas. */
function wordmark(): void {
  all('[data-wordmark]').forEach((mark) => {
    gsap.fromTo(
      all('.wm-letter', mark),
      { yPercent: 105, rotation: (i: number) => pick(SLAM_ROTATIONS, i) * 2 },
      {
        yPercent: 0,
        rotation: 0,
        ease: 'none',
        stagger: 0.04,
        scrollTrigger: {
          trigger: mark,
          start: 'top bottom',
          end: 'clamp(bottom bottom)',
          scrub: 0.6,
        },
      }
    );
  });
}

function bursts(): () => void {
  const cleanups: Array<() => void> = [];
  all('[data-burst]').forEach((burst) => {
    const scope = burst.closest('section') ?? burst;
    gsap.to(burst, {
      rotation: 200,
      ease: 'none',
      scrollTrigger: { trigger: scope, start: 'top bottom', end: 'bottom top', scrub: true },
    });
    gsap.from(burst, {
      scale: 0.3,
      duration: 0.8,
      ease: EASE_OUT,
      scrollTrigger: { trigger: scope, start: START_ENTER_LATE, toggleActions: TOGGLE_REPLAY },
    });
    const trigger = scope.querySelector('[data-burst-trigger]');
    if (!trigger) return;
    const grow = () => gsap.to(burst, { scale: 1.12, duration: 0.4, ease: EASE_OUT });
    const shrink = () => gsap.to(burst, { scale: 1, duration: 0.4, ease: EASE_OUT });
    trigger.addEventListener('pointerenter', grow);
    trigger.addEventListener('pointerleave', shrink);
    cleanups.push(() => {
      trigger.removeEventListener('pointerenter', grow);
      trigger.removeEventListener('pointerleave', shrink);
    });
  });
  return () => cleanups.forEach((cleanup) => cleanup());
}

function magnets(): () => void {
  const cleanups = all('[data-magnet]').map((magnet) => {
    const moveX = gsap.quickTo(magnet, 'x', { duration: 0.5, ease: EASE_FOLLOW });
    const moveY = gsap.quickTo(magnet, 'y', { duration: 0.5, ease: EASE_FOLLOW });
    const follow = (event: PointerEvent) => {
      const rect = magnet.getBoundingClientRect();
      moveX((event.clientX - (rect.left + rect.width / 2)) * MAGNET_PULL_X);
      moveY((event.clientY - (rect.top + rect.height / 2)) * MAGNET_PULL_Y);
    };
    const release = () => {
      moveX(0);
      moveY(0);
    };
    magnet.addEventListener('pointermove', follow);
    magnet.addEventListener('pointerleave', release);
    return () => {
      magnet.removeEventListener('pointermove', follow);
      magnet.removeEventListener('pointerleave', release);
    };
  });
  return () => cleanups.forEach((cleanup) => cleanup());
}

const mm = gsap.matchMedia();

mm.add(MEDIA_MOTION_OK, () => {
  pageProgress();
  slams();
  rises();
  stamps();
  pops();
  flips();
  lines();
  wipes();
  parallax();
  tilts();
  draws();
  wordmark();
  const stopPrints = prints();
  const stopBursts = bursts();
  return () => {
    stopPrints();
    stopBursts();
  };
});

mm.add(`${MEDIA_POINTER_FINE} and ${MEDIA_MOTION_OK}`, () => magnets());

// Les positions dépendent de la police et des images : on recalcule une fois tout chargé.
document.fonts.ready.then(() => ScrollTrigger.refresh());
window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
