/**
 * Single source of truth for the business' contact details and social profiles.
 *
 * Every tappable contact point on the page — footer, plan-CTA band, floating
 * WhatsApp button, tour "Book Now" actions and the JSON-LD in `index.html` —
 * reads from here, so updating the phone number or a social link is a one-line
 * change rather than a hunt through components.
 */
export const site = {
  name: 'Musti Targui Morocco Tours',
  shortName: 'Musti Targui',
  tagline: 'Your Journey, Our Passion.',

  /** Number as humans read it. */
  phoneDisplay: '+212 785-827197',
  /** E.164 form, for `tel:` links and structured data. */
  phoneE164: '+212785827197',
  email: 'mustitarguimoroccotours@gmail.com',

  /** Where the business is based, shown to visitors. */
  location: 'Merzouga, Morocco',
  /** Region line, used in the footer and structured data. */
  region: 'Drâa-Tafilalet, Morocco',
  address: {
    addressLocality: 'Merzouga',
    addressRegion: 'Drâa-Tafilalet',
    addressCountry: 'MA',
  },
  /** A stable, keyless map link (Google Maps search deep link). */
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Merzouga%2C+Morocco',

  instagram: 'https://www.instagram.com/musti_targui_tours',
  facebook: 'https://www.facebook.com/mustapha.aithammi',
} as const;

/** Digits only, the form WhatsApp's click-to-chat API expects. */
export const whatsappNumber = site.phoneE164.replace(/[^\d]/g, '');

/** Ready-made `tel:` / `mailto:` targets. */
export const telHref = `tel:${site.phoneE164}`;
export const mailtoHref = `mailto:${site.email}`;

/** Shown as the opening line when a visitor lands in a bare WhatsApp chat. */
export const whatsappGreeting =
  "Hello Musti Targui Morocco Tours! I'd like to plan a trip to Morocco.";

/**
 * Build a WhatsApp click-to-chat link, optionally pre-filling the message so
 * the enquiry arrives with the right context (e.g. the tour the visitor was
 * looking at).
 */
export function whatsapp(message: string = whatsappGreeting): string {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** A per-tour WhatsApp enquiry line used by the Featured Tours "Book Now" CTA. */
export function whatsappTour(tourTitle: string): string {
  return whatsapp(`Hello Musti Targui Morocco Tours! I'd like to book the "${tourTitle}".`);
}
