import type { PhotoAsset } from './assets';
import { destinationPhotos } from './assets';

export type Destination = {
  id: string;
  name: string;
  epithet: string;
  body: string;
  bestTime: string;
  image: PhotoAsset;
};

export const destinations: Destination[] = [
  {
    id: 'marrakech',
    name: 'Marrakech',
    epithet: 'The Red City',
    body: 'Lose yourself in the labyrinthine souks of the medina, witness the unforgettable spectacle of Jemaa el-Fna square at dusk, and find tranquility in the serene Majorelle Garden.',
    bestTime: 'March–May, September–November',
    image: destinationPhotos.marrakech,
  },
  {
    id: 'fes',
    name: 'Fes',
    epithet: 'The Spiritual Capital',
    body: "Step back in time in the world's largest car-free urban area. Explore the ancient medina of Fes el-Bali, visit the famous Chouara Tanneries, and admire the stunning architecture of the Bou Inania Madrasa.",
    bestTime: 'March–May, September–November',
    image: destinationPhotos.fes,
  },
  {
    id: 'chefchaouen',
    name: 'Chefchaouen',
    epithet: 'The Blue Pearl',
    body: "Nestled in the Rif Mountains, this photogenic city is famous for its striking blue-washed buildings. Wander through its quiet, cobbled streets and soak in the unique charm that makes it one of Morocco's most beloved destinations.",
    bestTime: 'April–June, September–October',
    image: destinationPhotos.chefchaouen,
  },
  {
    id: 'casablanca',
    name: 'Casablanca',
    epithet: 'The Modern Metropolis',
    body: "Morocco's economic powerhouse offers a different pace. Visit the magnificent Hassan II Mosque — one of the largest in the world — and explore the city's Art Deco architecture and vibrant coastal corniche.",
    bestTime: 'Year-round',
    image: destinationPhotos.casablanca,
  },
  {
    id: 'ouarzazate',
    name: 'Ouarzazate',
    epithet: 'The Gateway to the Sahara',
    body: "Known as the 'Hollywood of Africa', Ouarzazate is home to the famous Atlas Film Studios and the UNESCO-listed Ait Ben Haddou kasbah.",
    bestTime: 'October–April',
    image: destinationPhotos.ouarzazate,
  },
  {
    id: 'merzouga',
    name: 'Merzouga',
    epithet: 'The Gateway to the Dunes',
    body: 'A small village on the edge of the Erg Chebbi dunes. The dunes here reach heights of up to 150 metres, and the sunsets and sunrises are simply unforgettable.',
    bestTime: 'October–April',
    image: destinationPhotos.merzouga,
  },
];
