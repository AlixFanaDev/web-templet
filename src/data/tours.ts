import type { PhotoAsset } from './assets';
import { tourPhotos } from './assets';

export type TourHighlight = string;

export type Tour = {
  id: string;
  badge: string;
  title: string;
  duration: string;
  departure: string;
  price: string;
  highlights: TourHighlight[];
  body: string;
  image: PhotoAsset;
  /** CTA labels — only the first tour defines two CTAs in the brief. */
  ctas: [string, string?];
};

export const tours: Tour[] = [
  {
    id: '3-day-sahara-marrakech-merzouga',
    badge: 'THE CLASSIC DESERT EXPERIENCE',
    title: '3-Day Sahara Desert Tour: Marrakech to Merzouga',
    duration: '3 Days / 2 Nights',
    departure: 'Marrakech (daily)',
    price: 'From: €185 per person',
    highlights: ['Ait Ben Haddou', 'Dades Valley', 'Todra Gorge', 'Camel Trek', 'Desert Camp'],
    body: "Journey from the vibrant chaos of Marrakech, over the High Atlas Mountains via the legendary Tizi n'Tichka pass, to the serene golden dunes of Erg Chebbi. Visit the UNESCO World Heritage site of Ait Ben Haddou, explore the dramatic Dades Valley and Todra Gorge, and enjoy a magical camel trek into the desert for a night under a blanket of stars in a traditional Berber camp.",
    image: tourPhotos.threeDay,
    ctas: ['View Full Itinerary', 'Book Now'],
  },
  {
    id: '2-day-sahara-fes-merzouga',
    badge: 'THE PERFECT SHORT ESCAPE',
    title: '2-Day Sahara Desert Tour: Fes to Merzouga',
    duration: '2 Days / 1 Night',
    departure: 'Fes (daily)',
    price: 'From: €140 per person',
    highlights: ['Middle Atlas', 'Cedar Forest', 'Barbary Macaques', 'Camel Trek', 'Desert Camp'],
    body: 'Short on time but craving the desert? This tour is for you. Travel from Fes through the Middle Atlas Mountains, stopping to see wild Barbary macaques in the cedar forests of Azrou, before arriving at the majestic dunes of Merzouga. Enjoy a camel ride at sunset, dinner around a campfire under the stars, and a night in a traditional Berber desert camp, returning to Fes the next day.',
    image: tourPhotos.twoDay,
    // NOTE: only tour 1 defines explicit CTA labels in the brief; the other cards
    // use the section's single pair of actions so nothing is invented per-card.
    ctas: ['View Full Itinerary'],
  },
  {
    id: '8-day-grand-tour-casablanca',
    badge: 'THE COMPLETE MOROCCAN ODYSSEY',
    title: '8-Day Grand Tour of Morocco from Casablanca',
    duration: '8 Days / 7 Nights',
    departure: 'Casablanca (daily)',
    price: 'From: €695 per person',
    highlights: [
      'Hassan II Mosque',
      'Chefchaouen',
      'Fes Medina',
      'Sahara Desert',
      'Ait Ben Haddou',
      'Marrakech',
    ],
    body: "This comprehensive private tour takes you through the very best of Morocco: Casablanca, Rabat, Chefchaouen (the Blue City), Fes, the Sahara Desert, the Dades Valley, Ouarzazate, Ait Ben Haddou, and Marrakech. It's the perfect way to experience the country's diverse landscapes, rich history, and vibrant culture in one unforgettable journey.",
    image: tourPhotos.grandTour,
    ctas: ['View Full Itinerary'],
  },
  {
    id: 'atlas-mountains-day-trip',
    badge: 'A TASTE OF AUTHENTIC MOUNTAIN LIFE',
    title: 'Atlas Mountains & Berber Villages Day Trip from Marrakech',
    duration: '1 Day',
    departure: 'Marrakech (daily)',
    price: 'From: €45 per person',
    highlights: ['Ourika Valley', 'Berber Villages', 'Mountain Hike', 'Local Family Visit'],
    body: "Escape the city for a day and discover the breathtaking scenery of the High Atlas Mountains. Hike through traditional Berber villages, visit a local family for mint tea, and enjoy a delicious lunch by the river in the Ourika Valley. A perfect introduction to Morocco's rural life and a refreshing break from the bustling city.",
    image: tourPhotos.atlasDay,
    ctas: ['View Full Itinerary'],
  },
];
