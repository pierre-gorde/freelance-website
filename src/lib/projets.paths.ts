import { PROJETS } from './projets.const';

type ProjetPath = {
  params: { slug: string };
  props: { projet: (typeof PROJETS)[number]; screenshotUrl: string | null };
};

let screenshotsPromise: Promise<Map<string, string | null>> | null = null;

// Mémoïsé : les routes /projets et /mu/projets partagent la même salve de fetchs microlink au build.
function getScreenshots(): Promise<Map<string, string | null>> {
  screenshotsPromise ??= Promise.all(
    PROJETS.map(async (projet): Promise<[string, string | null]> => {
      let screenshotUrl: string | null = projet.localScreenshot ?? null;
      if (!screenshotUrl && projet.url) {
        try {
          const resp = await fetch(
            `https://api.microlink.io/?url=${encodeURIComponent(projet.url)}&screenshot=true`
          );
          if (resp.ok) {
            const json = await resp.json();
            screenshotUrl = (json?.data?.screenshot?.url as string) ?? null;
          }
        } catch {
          // screenshot indisponible
        }
      }
      return [projet.slug, screenshotUrl];
    })
  ).then((entries) => new Map(entries));
  return screenshotsPromise;
}

export async function getProjetsStaticPaths(): Promise<ProjetPath[]> {
  const screenshots = await getScreenshots();
  return PROJETS.map((projet) => ({
    params: { slug: projet.slug },
    props: { projet, screenshotUrl: screenshots.get(projet.slug) ?? null },
  }));
}
