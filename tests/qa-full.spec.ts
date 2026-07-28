import { test, expect, type Page } from '@playwright/test';

const ROUTES = [
  '/',
  '/a-propos',
  '/methode',
  '/faq',
  '/posts',
  '/projets',
  '/projets/ublo',
  '/porteur-projet',
  '/cto-renfort',
  '/dirigeant',
  '/mentions-legales',
] as const;

const LOCALES = [
  { name: 'fr', prefix: '', lang: 'fr' },
  { name: 'mu', prefix: '/mu', lang: 'fr-MU' },
] as const;

const TJM_FR = '700 € HT / jour';
const TJM_MU = 'Rs 35 000 HT / zour';

const SWITCHER_SELECTOR = 'a[data-umami-event="locale-switch"]';

function localizedPath(prefix: string, route: string): string {
  return route === '/' ? prefix || '/' : `${prefix}${route}`;
}

// Bruit tiers pré-existant, hors du contrôle du site :
// - ressources externes qui échouent (microlink, favicons) ;
// - CORS Fontshare (TODO existant dans tokens.css : self-host de General Sans) ;
// - erreurs internes de l'embed Cal.com (app.cal.com/embed/embed.js).
const KNOWN_THIRD_PARTY_NOISE = [
  /Failed to load resource/,
  /fontshare\.com/,
  /app\.cal\.com/,
  /^Instruction - not FOUND$/,
];

function collectJsErrors(page: Page): string[] {
  const errors: string[] = [];
  const isNoise = (text: string) => KNOWN_THIRD_PARTY_NOISE.some((pattern) => pattern.test(text));
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !isNoise(msg.text())) {
      errors.push(msg.text());
    }
  });
  page.on('pageerror', (err) => {
    if (!isNoise(err.message)) {
      errors.push(err.message);
    }
  });
  return errors;
}

// -------------------------------------------------------------------
// Matrice routes × locales : rendu, lang, erreurs console
// -------------------------------------------------------------------
for (const locale of LOCALES) {
  for (const route of ROUTES) {
    const url = localizedPath(locale.prefix, route);

    test(`[${locale.name}] ${url} — rendu sans erreur JS`, async ({ page }) => {
      const errors = collectJsErrors(page);
      await page.goto(url);
      await page.waitForLoadState('networkidle');

      await expect(page.locator('main h1').first()).toBeVisible();
      await expect(page.locator('html')).toHaveAttribute('lang', locale.lang);
      expect(errors).toEqual([]);
    });
  }
}

// -------------------------------------------------------------------
// Tarif par locale
// -------------------------------------------------------------------
test('[fr] /methode — TJM affiché en euros', async ({ page }) => {
  await page.goto('/methode');
  await expect(page.getByText(TJM_FR).first()).toBeVisible();
});

test('[mu] /mu/methode — TJM affiché en roupies, aucun euro résiduel', async ({ page }) => {
  await page.goto('/mu/methode');
  await expect(page.getByText(TJM_MU).first()).toBeVisible();

  const mainText = await page.locator('main').innerText();
  expect(mainText).not.toContain('€');
});

// -------------------------------------------------------------------
// Sélecteur de locale
// -------------------------------------------------------------------
test('switcher desktop — select drapeaux : FR → MU → FR en préservant le chemin', async ({
  page,
}) => {
  await page.goto('/methode');

  const select = page.locator('[data-locale-select]');
  await select.locator('summary').click();

  const optionFr = select.locator(`${SWITCHER_SELECTOR}[data-umami-event-to="fr"]`);
  const optionMu = select.locator(`${SWITCHER_SELECTOR}[data-umami-event-to="fr-MU"]`);
  await expect(optionFr).toBeVisible();
  await expect(optionMu).toBeVisible();
  await expect(optionFr).toHaveAttribute('aria-current', 'true');

  await optionMu.click();
  await expect(page).toHaveURL(/\/mu\/methode$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr-MU');

  await select.locator('summary').click();
  await expect(select.locator(`${SWITCHER_SELECTOR}[data-umami-event-to="fr-MU"]`)).toHaveAttribute(
    'aria-current',
    'true'
  );
  await select.locator(`${SWITCHER_SELECTOR}[data-umami-event-to="fr"]`).click();
  await expect(page).toHaveURL(/\/methode$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
});

test('[mu] /mu — kicker « Bonzour ! » visible dans le hero', async ({ page }) => {
  await page.goto('/mu');
  await expect(page.getByText('Bonzour !')).toBeVisible();
});

test('switcher mobile — chips FR / MU dans le drawer', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await page.locator('#mobile-menu-btn').click();
  const chipFr = page.locator(`#mobile-menu ${SWITCHER_SELECTOR}[data-umami-event-to="fr"]`);
  const chipMu = page.locator(`#mobile-menu ${SWITCHER_SELECTOR}[data-umami-event-to="fr-MU"]`);
  await expect(chipFr).toBeVisible();
  await expect(chipMu).toBeVisible();
  await expect(chipFr).toHaveAttribute('aria-current', 'true');
  await expect(chipMu).toContainText('MU');

  await chipMu.click();
  await expect(page).toHaveURL(/\/mu$/);
});

// -------------------------------------------------------------------
// 404 sous /mu — enhancement kreol côté client
// -------------------------------------------------------------------
test("404 sous /mu — h1 kreol et retour vers l'accueil /mu", async ({ page }) => {
  await page.goto('/mu/cette-page-nexiste-pas');

  await expect(page.locator('main h1')).toHaveText('Sa paz-la pa existé.');
  await expect(page.locator('[data-notfound-home] a')).toHaveAttribute('href', '/mu');
});
