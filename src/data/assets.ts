/**
 * Central registry for every photographic asset used by the page.
 *
 * Images are local (downloaded once by `scripts/fetch-placeholders.py`) so the
 * page has zero third-party image requests at runtime — better LCP, no CLS, no
 * hot-linking. Suggested Unsplash search terms for replacing them with final
 * production photography are documented in `README.md` → "Placeholder assets".
 *
 * Every entry carries explicit dimensions so <img> never causes layout shift.
 */
export type PhotoAsset = {
  /** Path served from /public */
  src: string;
  /** intrinsic width in px (post-crop) */
  width: number;
  /** intrinsic height in px (post-crop) */
  height: number;
  /** meaningful alt text */
  alt: string;
};

const photo = (name: string, width: number, height: number, alt: string): PhotoAsset => ({
  src: `/assets/${name}.jpg`,
  width,
  height,
  alt,
});

export const heroDunes = photo('hero-dunes', 1920, 1080, 'Golden Erg Chebbi dunes at sunset in the Moroccan Sahara');

export const tourPhotos = {
  threeDay: photo('tour-3day', 1280, 860, 'Camel trek riding across the Erg Chebbi dunes at golden hour'),
  twoDay: photo('tour-2day', 1280, 860, 'Barbary macaques in the cedar forest near Azrou in the Middle Atlas'),
  grandTour: photo('tour-8day', 1280, 860, 'Camels beside the Ait Ben Haddou kasbah on the old Saharan caravan route'),
  atlasDay: photo('tour-atlas', 1280, 860, 'The green Ourika Valley in the High Atlas Mountains'),
} as const;

export const destinationPhotos = {
  marrakech: photo('dest-marrakech', 960, 720, 'Fruit vendor in a Marrakech souk'),
  fes: photo('dest-fes', 960, 720, 'The colourful Chouara tannery in the medina of Fes'),
  chefchaouen: photo('dest-chefchaouen', 960, 720, 'Blue-washed buildings in Chefchaouen, the Blue Pearl'),
  casablanca: photo('dest-casablanca', 960, 720, 'The open plaza of the Hassan II Mosque in Casablanca'),
  ouarzazate: photo('dest-ouarzazate', 960, 720, 'The Ait Ben Haddou kasbah near Ouarzazate'),
  merzouga: photo('dest-merzouga', 960, 720, 'A desert camp at the edge of the Erg Chebbi dunes near Merzouga'),
} as const;

export const welcomePhotos = [
  photo('welcome-1', 500, 500, 'Jemaa el-Fna square in Marrakech at sunset'),
  photo('welcome-2', 500, 500, 'A blue-washed alley in Chefchaouen'),
  photo('welcome-3', 500, 500, 'The Majorelle Garden in Marrakech'),
] as const;

export const galleryPhotos = [
  photo('gallery-1', 760, 1010, 'Sunlit ridges of the Moroccan Sahara dunes'),
  photo('gallery-2', 760, 1010, 'A camel caravan crossing the Sahara'),
  photo('gallery-4', 760, 950, 'A quiet blue street in Chefchaouen'),
  photo('gallery-3', 760, 950, 'Carpets hanging in a medina alley in Fes'),
  photo('gallery-6', 760, 950, 'A Berber desert camp near Merzouga at dusk'),
  photo('gallery-5', 760, 1010, 'Djebel Ayachi in the Eastern High Atlas'),
  photo('gallery-7', 760, 950, 'Lanterns and spices in a Marrakech medina souk'),
] as const;
