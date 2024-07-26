import { BaseCategory } from './models/category';

export const defaultCategories: BaseCategory[] = [
  {
    name: 'Einkommen',
    icon: 'fa-solid fa-money-bill-trend-up',
    subCategories: [],
    type: 'income',
    keywords: [],
  },
  {
    name: 'Sonstiges',
    icon: 'fa-solid fa-rectangle-list',
    subCategories: [
      {
        name: 'Sonstiges',
        subCategories: [],
        type: 'expense',
        keywords: [],
        isDefault: true,
      },
      {
        name: 'Kreditkartenabrechnung',
        subCategories: [],
        type: 'expense',
        keywords: ['Kreditkartenabrechnung'],
      },
      {
        name: 'Bargeld',
        subCategories: [],
        type: 'expense',
        keywords: ['Bargeld', 'Geldautomat', 'ATM', 'Bankomat', 'Bankautomat', 'Geldausgabe', 'Cash'],
        excludeKeywords: [],
      },
    ],
    type: 'expense',
    keywords: [],
  },
  {
    name: 'Sparen',
    icon: 'fa-solid fa-coins',
    subCategories: [],
    type: 'savings',
    keywords: [
      'Sparen',
      'Sparplan',
      'ETF',
      'Fonds',
      'Aktien',
      'Depot',
      'Kryptowährung',
      'Bitcoin',
      'Ethereum',
      'LBS',
      'Bausparen',
      'Sparkasse',

      'Volksbank',
      'Comdirect',
      'Consorsbank',
      'ING',
      'Deka',
      'Fidelity',
      'Vanguard',
      'Blackrock',
      'iShares',
      'Xtrackers',
      'Lyxor',
      'Amundi',
      'WisdomTree',
      'VanEck',
      'HSBC',
      'BNP Paribas',
      'UBS',
    ],
  },
  {
    name: 'Freizeit',
    icon: 'fa-solid fa-person-hiking',
    subCategories: [
      {
        name: 'Urlaub, Reisen, Auflüge',
        subCategories: [],
        type: 'expense',
        keywords: [
          'FLGH',
          'GARAGE',
          'Hotel',
          'PARKHAUS',
          'PARKRAUMWELTEN',
          'RIESENRAD',
          'Sport',
          'Tierpark',
          'Urlaub',
          'Zoo',
          'Zug',
          'Reise',
          'Flixbus',
          'DB',
          'Bahn',
          'Flug',
        ],
        excludeKeywords: [],
      },
      {
        name: 'Kleidung',
        subCategories: [],
        type: 'expense',
        keywords: [
          'KAUFHAUS',
          'Schuhe',
          'Zalando',
          'Kleidung',
          'Mode',
          'H&M',
          'C&A',
          'ZARA',
          'MANGO',
          'PULL&BEAR',
          'Hilfiger',
          'Olymp',
          'Adidas',
          'Nike',
          'Puma',
          'Under Armour',
          'Jack Wolfskin',
          'Esprit',
          'S.Oliver',
          'Tom Tailor',
          'Levis',
          'Calvin Klein',
          'G-Star',
          'Diesel',
          'Pepe Jeans',
          'Superdry',
          'Bench',
          'Bershka',
          'Primark',
          'New Yorker',
          'Orsay',
          'Takko',
          'Tally Weijl',
          'Vero Moda',
          'Only',
          'Mango',
          'Reserved',
        ],
      },
      {
        name: 'Freizeit',
        subCategories: [],
        type: 'expense',
        keywords: ['THALIA', 'Buecher', 'Buchhandlung', 'Kino', 'Konzert', 'Museum', 'Theater', 'Eventim'],
      },
      {
        name: 'Geschenke',
        subCategories: [],
        type: 'expense',
        keywords: ['Geschenk', 'SPIELWAREN', 'Geburtstag', 'Weihnachten', 'SCHREIBWAREN', 'Blumen'],
      },
      {
        name: 'Apps und Programme',
        subCategories: [],
        type: 'expense',
        keywords: [
          'GitHub',
          'Immobilien Scout',
          'Microsoft',
          'Adobe',
          'Apple',
          'Google',
          'Playstore',
          'AutoScout',
          'Steam',
          'Epic Games',
          'Battle.net',
          'Blizzard',
          'Ubisoft',
          'Valve',
          'Electronic Arts',
          'EA',
        ],
        excludeKeywords: ['Apple Pay'],
      },
    ],
    type: 'expense',
    keywords: [],
  },
  {
    name: 'Essen & Trinken',
    icon: 'fa-solid fa-burger',
    type: 'expense',
    keywords: [],
    subCategories: [
      {
        name: 'Tiere',
        subCategories: [],
        type: 'expense',
        keywords: ['Fressnapf', 'Tierarzt', 'Tier', 'Zooplus', 'DR.MED.VET'],
      },
      {
        name: 'Restaurant',
        subCategories: [],
        type: 'expense',
        keywords: [
          'Burger',
          'Cafe',
          'Doener',
          'Essen',
          'Five Guys',
          'GASTRONOMIE',
          'HOFPFISTEREI',
          'Kaffee',
          'Kuchen',
          'L OSTERIA',
          'LOSTERIA',
          'MCDONALDS',
          'PIZZERIA',
          'RATHAUSCAF',
          'RESTAURA',
          'lindt',
          'RESTAURANT',
          'Subway',
          'WIRTSHAUS',
          'VAPIANO',
          'NORDSEE',
        ],
      },
      {
        name: 'Lebensmittel',
        subCategories: [],
        type: 'expense',
        keywords: [
          'Kaufland',
          'NETTO',
          'PENNY',
          'SUPERMARKT',
          'ALDI',
          'BACK',
          'BAECKER',
          'DM FIL',
          'DROGERIE',
          'EDEKA',
          'EUROSHOP',
          'GETRAENKE',
          'HELLOFRESH',
          'LIDL',
          'MUELLER',
          'MURR',
          'REWE',
          'ROSSMANN',
          'SPAR FIL',
          'starbucks',
        ],
      },
      {
        name: 'Apotheke',
        subCategories: [],
        type: 'expense',
        keywords: ['Apotheke'],
      },
      {
        name: 'Weitere',

        subCategories: [],
        type: 'expense',
        keywords: ['Post'],
        excludeKeywords: [],
      },
    ],
  },
  {
    name: 'Einrichtung',
    icon: 'fa-solid fa-bed',
    subCategories: [
      {
        name: 'Elektronik Geschäfte',
        subCategories: [],
        type: 'expense',
        keywords: [
          'expert Techno',
          'Cyberport',
          'MMS E-Commerce GmbH', // Media Markt
        ],
        excludeKeywords: [],
      },
      {
        name: 'Garten- und Möbelhäuser',
        subCategories: [],
        type: 'expense',
        keywords: [
          'BAYWA',
          'DEHNER',
          'HORNBACH',
          'IKEA',
          'LEUCHTEN',
          'MOEBEL',
          'MOEMAX',
          'Poco',
          'ROLLER',
          'Teppich',
          'WOOLWORTH',
          'XXXL',
        ],
        excludeKeywords: [],
      },
      {
        name: 'Amazon',
        subCategories: [],
        type: 'expense',
        keywords: ['Amazon'],
        excludeKeywords: ['Prime Video'],
      },
    ],
    type: 'expense',
    keywords: [],
    excludeKeywords: [],
  },
  {
    name: 'Strom / Internet / Rundfunk',
    icon: 'fa-solid fa-tv',
    subCategories: [
      {
        name: 'Strom',
        subCategories: [],
        type: 'expense',
        keywords: ['Strom', 'Energie', 'E.ON', 'Stadtwerke'],
      },
      {
        name: 'Internet',
        subCategories: [],
        type: 'expense',
        keywords: ['Vodafone', 'Congstar', 'Telekom', 'O2', 'Telefonica', 'Kabel Deutschland', 'Unitymedia', '1und1'],
      },
      {
        name: 'Streaming',
        subCategories: [],
        type: 'expense',
        keywords: ['Spotify', 'Netflix', 'Prime Video', 'Disney', 'Sky', 'Maxdome', 'Apple Music', 'YouTube'],
      },
      {
        name: 'Rundfunk',
        subCategories: [],
        type: 'expense',
        keywords: ['Rundfunk', 'GEZ'],
      },
    ],
    type: 'expense',
    keywords: [],
  },

  {
    name: 'Mobilität',
    icon: 'fa-solid fa-van-shuttle',
    subCategories: [
      {
        name: 'Bus & Bahn',
        subCategories: [],
        type: 'expense',
        keywords: ['MVG', 'MVV', 'DB', 'Bahn', 'Bus', 'Tram', 'U-Bahn', 'S-Bahn'],
      },
      {
        name: 'Tanken',
        subCategories: [],
        type: 'expense',
        keywords: [
          'AGIP',
          'ALLGUTH',
          'ARAL',
          'AVIA',
          'ESSO',
          'JET Dankt',
          'Petrol',
          'SHELL',
          'TANKE',
          'Tankstelle',
          'Total ',
        ],
      },
      {
        name: 'Steuer etc.',
        subCategories: [],
        type: 'expense',
        keywords: ['Kfz-Steuer', 'ADAC', 'TÜV', 'DEKRA'],
      },
      {
        name: 'Auto',
        subCategories: [],
        type: 'expense',
        keywords: ['Auto', 'Autohaus'],
        excludeKeywords: [],
      },
      {
        name: 'Fahrrad',
        subCategories: [],
        type: 'expense',
        keywords: ['Fahrrad'],
      },
    ],
    type: 'expense',
    keywords: [],
  },
  {
    name: 'Versicherung / Steuer',
    icon: 'fa-solid fa-scale-balanced',
    subCategories: [
      {
        name: 'Versicherung',
        subCategories: [],
        type: 'expense',
        keywords: ['Versicherung', 'HUK', 'DEVK', 'AXA', 'ALLIANZ', 'ERGO'],
        excludeKeywords: [],
      },
      {
        name: 'Steuer',
        subCategories: [],
        type: 'expense',
        keywords: ['Steuer'],
        excludeKeywords: ['Kfz-Steuer'],
      },
      {
        name: 'Bankgebühren',
        subCategories: [],
        type: 'expense',
        keywords: ['Kontof�hrung', 'Bankgeb�hren'],
        excludeKeywords: [],
      },
    ],
    type: 'expense',
    keywords: [],
    excludeKeywords: [],
  },
  {
    name: 'Miete',
    icon: 'fa-solid fa-house-chimney',
    subCategories: [],
    type: 'expense',
    keywords: ['Miete', 'Nebenkosten', 'Wohnung'],
  },
];
