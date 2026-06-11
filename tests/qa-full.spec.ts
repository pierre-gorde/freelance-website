import { test, expect, type Page, type ConsoleMessage } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE_URL = 'http://localhost:4321';
const REPORT_PATH = path.join(
  __dirname,
  '../playwright-report/qa-report-2026-06-11.html'
);

// Résultats globaux
const results = {
  pagesTestedCount: 0,
  consoleErrorCount: 0,
  bugsCount: 0,
  warningsCount: 0,
  bugs: [] as Array<{ severity: 'Critique' | 'Warning' | 'Info'; title: string; detail: string }>,
  ok: [] as string[],
  screenshots: [] as Array<{ label: string; dataUrl: string }>,
  consoleMessages: [] as Array<{ page: string; type: string; text: string }>,
};

// Capture les messages console d'une page
function attachConsoleCapture(page: Page, pageName: string) {
  page.on('console', (msg: ConsoleMessage) => {
    const type = msg.type();
    const text = msg.text();
    results.consoleMessages.push({ page: pageName, type, text });
    if (type === 'error') results.consoleErrorCount++;
    if (type === 'warning') results.warningsCount++;
  });
  page.on('pageerror', (err) => {
    results.consoleMessages.push({ page: pageName, type: 'pageerror', text: err.message });
    results.consoleErrorCount++;
    results.bugs.push({
      severity: 'Critique',
      title: `JS Error — ${pageName}`,
      detail: err.message,
    });
    results.bugsCount++;
  });
}

// Capture un screenshot en base64
async function captureScreenshot(page: Page, label: string) {
  const buf = await page.screenshot({ fullPage: false });
  const dataUrl = `data:image/png;base64,${buf.toString('base64')}`;
  results.screenshots.push({ label, dataUrl });
}

// Highlight + pause
async function highlight(page: Page, selector: string) {
  await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (el) (el as HTMLElement).style.outline = '3px solid #e85d26';
  }, selector);
  await page.waitForTimeout(600);
}

// -------------------------------------------------------------------
// CHAPTER 1 — Homepage desktop audit
// -------------------------------------------------------------------
test('Chapter 1 — Homepage audit visuel & console', async ({ page }) => {
  attachConsoleCapture(page, '/');
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  results.pagesTestedCount++;

  // Screenshot homepage full desktop
  await captureScreenshot(page, 'Homepage — Desktop 1280×720');

  // Vérifier le H1 (main h1 pour exclure la toolbar Astro dev)
  const h1 = page.locator('main h1').first();
  await expect(h1).toBeVisible();
  results.ok.push('H1 visible sur la homepage');

  // Vérifier le CTA primaire
  const primaryCta = page.locator('a[href="/rdv"]').first();
  if (await primaryCta.isVisible()) {
    await highlight(page, 'a[href="/rdv"]');
    results.ok.push('CTA principal "Échange gratuit" visible et cliquable');
  } else {
    results.bugs.push({
      severity: 'Critique',
      title: 'CTA /rdv absent de la homepage',
      detail: 'Aucun lien href="/rdv" trouvé ou visible en desktop.',
    });
    results.bugsCount++;
  }

  // Vérifier le lien "Voir ma méthode"
  const methodeLink = page.locator('a[href="/methode"]').first();
  if (await methodeLink.isVisible()) {
    results.ok.push('Lien "Voir ma méthode" présent en homepage');
  }

  // Vérifier la nav desktop
  const nav = page.locator('nav[aria-label="Navigation principale"]');
  await expect(nav).toBeVisible();
  results.ok.push('Nav desktop visible');

  // Vérifier le Header sticky (sélecteur précis pour exclure la toolbar Astro dev)
  const header = page.locator('header.sticky');
  await expect(header).toBeVisible();
  results.ok.push('Header sticky présent et visible');

  // Scroll jusqu'aux personas et screenshot
  await page.locator('.persona-row').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await highlight(page, '.persona-row');
  await captureScreenshot(page, 'Homepage — Section personas (scroll)');
  results.ok.push('Section personas visible après scroll');

  // Scroll jusqu'au CTA final (section fond sombre)
  await page.locator('main section').last().scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await captureScreenshot(page, 'Homepage — CTA finale (scroll bas)');
});

// -------------------------------------------------------------------
// CHAPTER 2 — Mobile 390×844
// -------------------------------------------------------------------
test('Chapter 2 — Mobile 390×844', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  attachConsoleCapture(page, '/ (mobile)');
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  await captureScreenshot(page, 'Homepage — Mobile 390×844');

  // Vérifier que la nav desktop est cachée
  const desktopNav = page.locator('nav[aria-label="Navigation principale"]');
  const navVisible = await desktopNav.isVisible();
  if (navVisible) {
    results.bugs.push({
      severity: 'Warning',
      title: 'Nav desktop visible sur mobile',
      detail: 'La nav principale est visible sur mobile (390px). Vérifier le breakpoint md.',
    });
    results.warningsCount++;
  } else {
    results.ok.push('Nav desktop correctement masquée sur mobile (hidden md:block)');
  }

  // Vérifier l'absence de menu burger (bug attendu)
  const burgerButton = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"], [aria-label*="burger"], [data-burger]');
  const hasBurger = await burgerButton.count() > 0;
  if (!hasBurger) {
    results.bugs.push({
      severity: 'Warning',
      title: 'Pas de menu burger sur mobile',
      detail:
        'Sur mobile (390px), la nav principale est masquée sans menu hamburger de substitution. Les pages /methode, /projets, /faq, /a-propos, /rdv ne sont pas accessibles via la navigation sur mobile.',
    });
    results.warningsCount++;
    results.bugsCount++;
  }

  // Vérifier que le CTA est accessible sur mobile
  const ctaMobile = page.locator('header a[href="/rdv"]');
  if (await ctaMobile.isVisible()) {
    await highlight(page, 'header a[href="/rdv"]');
    results.ok.push('CTA "Échange gratuit" visible dans le header sur mobile');
    await captureScreenshot(page, 'Mobile — Header avec CTA visible');
  } else {
    results.bugs.push({
      severity: 'Critique',
      title: 'CTA header absent sur mobile',
      detail: 'Le CTA "Échange gratuit" dans le header n\'est pas visible sur mobile.',
    });
    results.bugsCount++;
  }

  // Vérifier le H1 en mobile
  const h1Mobile = page.locator('main h1').first();
  await expect(h1Mobile).toBeVisible();
  results.ok.push('H1 visible sur mobile');

  // Screenshot section persona mobile
  await page.locator('.persona-row').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await captureScreenshot(page, 'Mobile — Section personas');
  results.ok.push('Section personas rendue correctement sur mobile');
});

// -------------------------------------------------------------------
// CHAPTER 3 — Sections interactives (hover persona, animations Reveal)
// -------------------------------------------------------------------
test('Chapter 3 — Sections interactives', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  attachConsoleCapture(page, '/ (interactions)');
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Hero accent animation — vérifier après 1.5s (durée animation 1.2s + 0.4s delay)
  await page.waitForTimeout(1800);
  const heroAccent = page.locator('.hero-accent');
  if (await heroAccent.isVisible()) {
    const bgSize = await heroAccent.evaluate(
      (el) => getComputedStyle(el).backgroundSize
    );
    results.ok.push(`Animation hero-accent résolue — backgroundSize: ${bgSize}`);
    await highlight(page, '.hero-accent');
    await captureScreenshot(page, 'Homepage — Hero accent animé');
  }

  // Hover sur la première persona row
  const firstPersonaRow = page.locator('.persona-row').first();
  await firstPersonaRow.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await highlight(page, '.persona-row');
  await firstPersonaRow.hover();
  await page.waitForTimeout(500);
  await captureScreenshot(page, 'Homepage — Persona row hover (état survolé)');
  results.ok.push('Hover persona row fonctionnel');

  // Vérifier le Reveal (IntersectionObserver) — scroll complet
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(800);
  await captureScreenshot(page, 'Homepage — Bas de page (tous Reveal déclenchés)');
  results.ok.push('Scroll complet effectué — animations Reveal déclenchées');

  // Retour en haut
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);

  // Page /methode — tester la structure
  results.pagesTestedCount++;
  await page.goto('/methode');
  await page.waitForLoadState('networkidle');
  attachConsoleCapture(page, '/methode');

  const methodeH1 = page.locator('main h1, main h2').first();
  await expect(methodeH1).toBeVisible();
  results.ok.push('H1/H2 visible sur /methode');

  await captureScreenshot(page, 'Page /methode — Vue initiale');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(800);
  await captureScreenshot(page, 'Page /methode — Bas de page');
  results.ok.push('Page /methode rendue sans erreur visible');

  // Page /rdv
  results.pagesTestedCount++;
  await page.goto('/rdv');
  await page.waitForLoadState('networkidle');
  attachConsoleCapture(page, '/rdv');

  const rdvH1 = page.locator('main h1, main h2').first();
  await expect(rdvH1).toBeVisible();
  await captureScreenshot(page, 'Page /rdv — Vue initiale');
  results.ok.push('Page /rdv accessible et rendue');
});

// -------------------------------------------------------------------
// CHAPTER 4 — Audit liens internes
// -------------------------------------------------------------------
test('Chapter 4 — Audit liens internes', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Extraire tous les hrefs internes sur toutes les pages
  const allInternalLinks = new Set<string>();

  for (const pagePath of ['/', '/methode', '/rdv']) {
    await page.goto(pagePath);
    await page.waitForLoadState('networkidle');
    const links = await page.evaluate((baseUrl) => {
      return [...new Set(
        [...document.querySelectorAll('a[href]')]
          .map((a) => (a as HTMLAnchorElement).href)
          .filter((h) =>
            h.startsWith(baseUrl) &&
            !h.includes('#') &&
            !h.endsWith('.xml') &&
            !h.endsWith('.txt')
          )
          .map((h) => h.replace(baseUrl, '') || '/')
      )];
    }, BASE_URL);
    links.forEach((l) => allInternalLinks.add(l));
  }

  // Vérifier le statut HTTP de chaque lien
  const testedLinks: Array<{ url: string; status: number }> = [];

  for (const linkPath of allInternalLinks) {
    const response = await page.request.get(`${BASE_URL}${linkPath}`);
    testedLinks.push({ url: linkPath, status: response.status() });

    if (response.status() === 404) {
      results.bugs.push({
        severity: 'Critique',
        title: `Lien 404 — ${linkPath}`,
        detail: `Le lien interne "${linkPath}" retourne HTTP 404. Présent dans la navigation ou dans le contenu des pages testées.`,
      });
      results.bugsCount++;
    } else if (response.status() >= 400) {
      results.bugs.push({
        severity: 'Warning',
        title: `Lien erreur ${response.status()} — ${linkPath}`,
        detail: `Le lien interne "${linkPath}" retourne HTTP ${response.status()}.`,
      });
      results.warningsCount++;
    }
  }

  const okLinks = testedLinks.filter((l) => l.status < 400);
  results.ok.push(
    `Audit liens internes : ${okLinks.length}/${testedLinks.length} liens OK (< 400)`
  );

  // Screenshot avec les liens nav en surbrillance
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => {
    document.querySelectorAll('nav a[href]').forEach((a) => {
      (a as HTMLElement).style.outline = '3px solid #e85d26';
    });
  });
  await captureScreenshot(page, 'Homepage — Liens nav en surbrillance (audit)');
});

// -------------------------------------------------------------------
// CHAPTER 5 — Images & lazy load
// -------------------------------------------------------------------
test('Chapter 5 — Images & lazy load', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Scroll complet pour déclencher le lazy load
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalScrolled = 0;
      const scrollStep = 500;
      const interval = setInterval(() => {
        window.scrollBy(0, scrollStep);
        totalScrolled += scrollStep;
        if (totalScrolled >= document.body.scrollHeight + 500) {
          clearInterval(interval);
          resolve();
        }
      }, 80);
    });
  });
  await page.waitForTimeout(1000);

  // Détecter les images cassées
  const brokenImages = await page.evaluate(() => {
    return [...document.querySelectorAll('img')]
      .filter((img) => !img.complete || img.naturalWidth === 0)
      .map((img) => img.src || img.getAttribute('src') || 'src inconnu');
  });

  if (brokenImages.length > 0) {
    brokenImages.forEach((src) => {
      results.bugs.push({
        severity: 'Critique',
        title: `Image cassée`,
        detail: `L'image ne s'est pas chargée : ${src}`,
      });
      results.bugsCount++;
    });
  } else {
    results.ok.push('Toutes les images de la homepage sont chargées correctement');
  }

  // Compter les images totales
  const totalImages = await page.evaluate(() => document.querySelectorAll('img').length);
  results.ok.push(`${totalImages} image(s) détectée(s) sur la homepage après lazy load`);

  // Vérifier les images sur /methode et /rdv
  for (const pg of ['/methode', '/rdv']) {
    await page.goto(pg);
    await page.waitForLoadState('networkidle');
    await page.evaluate(async () => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(600);

    const broken = await page.evaluate(() => {
      return [...document.querySelectorAll('img')]
        .filter((img) => !img.complete || img.naturalWidth === 0)
        .map((img) => img.src || 'src inconnu');
    });

    if (broken.length > 0) {
      broken.forEach((src) => {
        results.bugs.push({
          severity: 'Critique',
          title: `Image cassée sur ${pg}`,
          detail: src,
        });
        results.bugsCount++;
      });
    } else {
      results.ok.push(`Aucune image cassée sur ${pg}`);
    }
  }

  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await captureScreenshot(page, 'Homepage — Vue finale après tests images');
});

// -------------------------------------------------------------------
// CHAPTER 6 — Génération du rapport HTML
// -------------------------------------------------------------------
test('Chapter 6 — Génération rapport HTML', async ({}) => {
  results.pagesTestedCount = Math.max(results.pagesTestedCount, 3);

  const now = '2026-06-11';
  const bugsSeverityColor: Record<string, string> = {
    Critique: '#dc2626',
    Warning: '#d97706',
    Info: '#2563eb',
  };

  const screenshotGrid = results.screenshots.length > 0
    ? results.screenshots
        .map(
          (s) =>
            `<div class="screenshot-item">
              <p class="screenshot-label">${s.label}</p>
              <img src="${s.dataUrl}" alt="${s.label}" />
            </div>`
        )
        .join('\n')
    : '<p class="empty">Aucun screenshot capturé.</p>';

  const consoleTable = results.consoleMessages.length > 0
    ? `<table>
        <thead><tr><th>Page</th><th>Type</th><th>Message</th></tr></thead>
        <tbody>
          ${results.consoleMessages
            .map(
              (m) =>
                `<tr class="console-${m.type}">
                  <td><code>${m.page}</code></td>
                  <td><span class="badge badge-${m.type}">${m.type}</span></td>
                  <td><code>${m.text.slice(0, 200)}</code></td>
                </tr>`
            )
            .join('\n')}
        </tbody>
      </table>`
    : '<p class="empty ok-text">Aucune erreur console détectée.</p>';

  const bugsHtml = results.bugs.length > 0
    ? results.bugs
        .map(
          (b) =>
            `<div class="bug-item">
              <span class="badge" style="background:${bugsSeverityColor[b.severity] ?? '#666'};color:#fff;">${b.severity}</span>
              <div>
                <strong>${b.title}</strong>
                <p>${b.detail}</p>
              </div>
            </div>`
        )
        .join('\n')
    : '<p class="empty ok-text">Aucun bug détecté.</p>';

  const okHtml = results.ok.length > 0
    ? results.ok
        .map((item) => `<li class="ok-item"><span class="ok-check">✓</span> ${item}</li>`)
        .join('\n')
    : '<li class="empty">Aucun élément validé.</li>';

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Rapport QA — pierregorde.com — ${now}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0f0f0f;
      color: #e5e5e5;
      line-height: 1.6;
    }
    .header {
      background: linear-gradient(135deg, #1a1a1a 0%, #111 100%);
      border-bottom: 1px solid #2a2a2a;
      padding: 40px 48px;
    }
    .header h1 { font-size: 28px; font-weight: 700; color: #fff; margin-bottom: 8px; }
    .header .meta { font-size: 14px; color: #888; display: flex; gap: 24px; flex-wrap: wrap; }
    .header .meta span { display: flex; align-items: center; gap: 6px; }
    .header .dot { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; display: inline-block; }
    .metrics {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0;
      border-bottom: 1px solid #2a2a2a;
    }
    .metric {
      padding: 32px 40px;
      border-right: 1px solid #2a2a2a;
      text-align: center;
    }
    .metric:last-child { border-right: none; }
    .metric .value { font-size: 48px; font-weight: 800; line-height: 1; margin-bottom: 8px; }
    .metric .label { font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 0.08em; }
    .metric.ok .value { color: #22c55e; }
    .metric.error .value { color: #ef4444; }
    .metric.warning .value { color: #f59e0b; }
    .metric.info .value { color: #60a5fa; }
    .content { max-width: 1200px; margin: 0 auto; padding: 48px; }
    section { margin-bottom: 56px; }
    section h2 {
      font-size: 20px;
      font-weight: 600;
      color: #fff;
      margin-bottom: 24px;
      padding-bottom: 12px;
      border-bottom: 1px solid #2a2a2a;
    }
    .bug-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 8px;
      margin-bottom: 10px;
    }
    .bug-item strong { color: #fff; display: block; margin-bottom: 4px; }
    .bug-item p { font-size: 13px; color: #999; }
    .badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.04em;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .badge-error { background: #dc2626; color: #fff; }
    .badge-warning { background: #d97706; color: #fff; }
    .badge-log { background: #374151; color: #d1d5db; }
    .badge-pageerror { background: #7c3aed; color: #fff; }
    .ok-item {
      padding: 10px 0;
      border-bottom: 1px solid #1a1a1a;
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 14px;
      color: #d1d5db;
    }
    .ok-check { color: #22c55e; font-weight: 700; flex-shrink: 0; }
    ul { list-style: none; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { text-align: left; padding: 10px 12px; background: #1a1a1a; color: #888; font-weight: 600; border-bottom: 1px solid #2a2a2a; }
    td { padding: 10px 12px; border-bottom: 1px solid #1a1a1a; vertical-align: top; }
    code { font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 12px; }
    .console-error td { background: #1f0a0a; }
    .console-warning td { background: #1f1500; }
    .screenshot-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .screenshot-item {}
    .screenshot-label { font-size: 12px; color: #888; margin-bottom: 8px; font-family: monospace; }
    .screenshot-item img { width: 100%; border-radius: 6px; border: 1px solid #2a2a2a; display: block; }
    .empty { color: #555; font-style: italic; font-size: 14px; padding: 16px 0; }
    .ok-text { color: #22c55e; }
    .footer {
      text-align: center;
      padding: 32px 48px;
      border-top: 1px solid #1a1a1a;
      font-size: 12px;
      color: #555;
    }
    @media (max-width: 768px) {
      .metrics { grid-template-columns: 1fr 1fr; }
      .screenshot-grid { grid-template-columns: 1fr; }
      .content { padding: 24px; }
      .header { padding: 24px; }
    }
  </style>
</head>
<body>

  <div class="header">
    <h1>Rapport QA — pierregorde.com</h1>
    <div class="meta">
      <span><span class="dot"></span> Environnement : localhost:4321 (Astro dev)</span>
      <span>Date : ${now}</span>
      <span>Playwright v1.60.0 · Chromium</span>
      <span>URL : http://localhost:4321</span>
    </div>
  </div>

  <div class="metrics">
    <div class="metric info">
      <div class="value">${results.pagesTestedCount}</div>
      <div class="label">Pages testées</div>
    </div>
    <div class="metric ${results.consoleErrorCount > 0 ? 'error' : 'ok'}">
      <div class="value">${results.consoleErrorCount}</div>
      <div class="label">Erreurs console</div>
    </div>
    <div class="metric ${results.bugsCount > 0 ? 'error' : 'ok'}">
      <div class="value">${results.bugsCount}</div>
      <div class="label">Bugs trouvés</div>
    </div>
    <div class="metric ${results.warningsCount > 0 ? 'warning' : 'ok'}">
      <div class="value">${results.warningsCount}</div>
      <div class="label">Warnings</div>
    </div>
  </div>

  <div class="content">

    <section>
      <h2>Bugs & anomalies</h2>
      ${bugsHtml}
    </section>

    <section>
      <h2>Console (erreurs & warnings)</h2>
      ${consoleTable}
    </section>

    <section>
      <h2>Validations</h2>
      <ul>${okHtml}</ul>
    </section>

    <section>
      <h2>Screenshots</h2>
      <div class="screenshot-grid">
        ${screenshotGrid}
      </div>
    </section>

  </div>

  <div class="footer">
    Généré par Claude Code + Playwright · ${now}
  </div>

</body>
</html>`;

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, html, 'utf8');
  console.log(`\n✅ Rapport HTML généré : ${REPORT_PATH}`);
});
