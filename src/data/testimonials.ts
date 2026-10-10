export type Testimonial = {
  id: string;
  quote: string;
  title: string;
  name: string;
  country: string;
};

/** Row 1 — full-length quote cards. */
export const testimonials: Testimonial[] = [
  {
    id: 'sarah-michael',
    title: 'The most incredible experience of our lives!',
    quote:
      "Musti and his team went above and beyond to make our Morocco trip unforgettable. From the moment we were picked up in Marrakech to the night we spent in the desert camp, everything was perfect. The camel trek at sunset was magical, and the Berber music around the campfire was a night we'll never forget. Musti's knowledge of the country and his warm hospitality made us feel like family. We can't recommend this company enough!",
    name: 'Sarah & Michael',
    country: 'United Kingdom',
  },
  {
    id: 'anna-lars',
    title: 'Authentic, professional, and truly memorable.',
    quote:
      'We booked the 8-day Grand Tour from Casablanca and it exceeded every expectation. Our driver, Hassan, was not only an excellent driver but also a fantastic guide who shared so much about Moroccan culture and history. The riads were beautiful, the desert camp was comfortable and authentic, and the itinerary was perfectly paced. This is the way to see Morocco!',
    name: 'Anna & Lars',
    country: 'Germany',
  },
  {
    id: 'johnson-family',
    title: 'The best decision we made for our trip.',
    quote:
      'I cannot say enough good things about Musti Targui Morocco Tours. Planning the trip from Australia was easy thanks to their prompt and helpful communication. The tour itself was flawless — comfortable vehicle, excellent accommodations, and unforgettable experiences. Our children loved the camel ride and the sandboarding. Thank you for an amazing family adventure!',
    name: 'The Johnson Family',
    country: 'Australia',
  },
];

/** Row 2 — short pull-quotes. */
export const shortQuotes: Testimonial[] = [
  {
    id: 'short-1',
    title: 'Everything was perfect from start to finish.',
    quote: '',
    name: 'Sarah & Michael',
    country: 'UK',
  },
  {
    id: 'short-2',
    title: 'The desert camp was comfortable and authentic.',
    quote: '',
    name: 'Anna & Lars',
    country: 'Germany',
  },
  {
    id: 'short-3',
    title: 'Our children loved the camel ride and sandboarding.',
    quote: '',
    name: 'The Johnson Family',
    country: 'Australia',
  },
  {
    id: 'short-4',
    title: 'Prompt, helpful communication from the very first email.',
    quote: '',
    name: 'The Johnson Family',
    country: 'Australia',
  },
];
