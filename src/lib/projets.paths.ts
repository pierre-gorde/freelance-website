import { PROJETS, type Projet } from './projets.const';

type ProjetPath = {
  params: { slug: string };
  props: { projet: Projet };
};

export function getProjetsStaticPaths(): ProjetPath[] {
  return PROJETS.map((projet) => ({ params: { slug: projet.slug }, props: { projet } }));
}
