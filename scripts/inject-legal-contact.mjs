import { writeFileSync } from 'node:fs';

const contact = {
  name: process.env.LEGAL_NAME,
  street: process.env.LEGAL_STREET,
  postalCode: process.env.LEGAL_POSTAL_CODE,
  city: process.env.LEGAL_CITY,
  country: process.env.LEGAL_COUNTRY,
  email: process.env.LEGAL_EMAIL,
};

const missingFields = Object.entries(contact)
  .filter(([, value]) => !value?.trim())
  .map(([field]) => field);

if (missingFields.length > 0) {
  throw new Error(`Missing required legal contact secrets: ${missingFields.join(', ')}`);
}

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
  throw new Error('LEGAL_EMAIL must be a valid email address.');
}

writeFileSync(
  'src/app/legal-contact.ts',
  `export const legalContact = ${JSON.stringify(contact, null, 2)} as const;\n`,
);
