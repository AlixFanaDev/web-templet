export type Faq = {
  id: string;
  question: string;
  answer: string;
};

export const faqs: Faq[] = [
  {
    id: 'customise',
    question: 'Can I customise my tour?',
    answer:
      'Absolutely! Every tour is private and fully customizable. We can adjust the itinerary, add or remove stops, change the pace, and tailor the experience to your interests.',
  },
  {
    id: 'booking',
    question: 'How do I book a tour?',
    answer:
      "Simply fill out our contact form or send us an email with your travel dates, interests, and group size. We'll respond within 24 hours with a personalized itinerary and quote. Once you're happy, we'll confirm your booking and send you all the details.",
  },
  {
    id: 'deposit',
    question: 'Do I need to pay a deposit?',
    answer:
      'Yes, we require a small deposit to confirm your booking. The remaining balance can be paid in cash (Euros, USD, or MAD) on the first day of your tour.',
  },
  {
    id: 'cancel',
    question: 'Can I cancel or change my booking?',
    answer:
      'Yes! We offer free cancellation up to 48 hours before your tour departure. Changes are subject to availability.',
  },
  {
    id: 'desert-camp',
    question: 'What is a desert camp like?',
    answer:
      'Our standard desert camp offers comfortable tents with proper beds, blankets, and shared bathroom facilities. We also offer a luxury camp option with private en-suite bathrooms and hot showers.',
  },
  {
    id: 'children',
    question: 'Are your tours suitable for children?',
    answer:
      'Yes! We welcome families and can tailor the pace and activities to suit children of all ages. Camel rides and sandboarding are particularly popular with kids.',
  },
  {
    id: 'best-time',
    question: 'What is the best time to visit Morocco?',
    answer:
      'The best time to visit Morocco is generally March–May and September–November, when the weather is mild and pleasant. However, Morocco is a year-round destination, and each season offers something unique.',
  },
  {
    id: 'what-to-bring',
    question: 'What should I bring to the desert?',
    answer:
      'We recommend bringing warm layers (desert nights can be cold), comfortable shoes, sunscreen, a hat, sunglasses, a camera, and a scarf or buff for dusty conditions.',
  },
];
