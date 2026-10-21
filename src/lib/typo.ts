const NBSP = ' ';

/** Espace insécable avant ? ! : ; comme le veut la typographie française (pas de « ? » seul en début de ligne). */
export function frenchSpacing(text: string): string {
  return text.replace(/ ([?!:;])/g, `${NBSP}$1`);
}
