import { BaseCategory } from './models/category';

export const defaultCategories: BaseCategory[] = [
  {
    name: 'Einkommen',
    icon: 'fa-solid fa-money-bill-trend-up',
    subCategories: [],
    type: 'income',
    excludeKeywords: [],
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
        excludeKeywords: [],
        keywords: [],
        isDefault: true,
      },
      {
        name: 'Kreditkartenabrechnung',
        subCategories: [],
        type: 'expense',
        excludeKeywords: [],
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
    excludeKeywords: [],
    keywords: [],
  },
  {
    name: 'Sparen',
    icon: 'fa-solid fa-coins',
    subCategories: [],
    type: 'savings',
    excludeKeywords: [],
    keywords: [
      'Aktien',
      'Amundi',
      'Bausparen',
      'Bitcoin',
      'Blackrock',
      'BNP Paribas',
      'Coinbase',
      'Comdirect',
      'Consorsbank',
      'Depot',
      'ETF',
      'Ethereum',
      'Fidelity',
      'Fonds',
      'HSBC',
      'iShares',
      'Kryptowährung',
      'LBS',
      'Lyxor',
      'Sparen',
      'Sparkasse',
      'Sparplan',
      'UBS',
      'VanEck',
      'Vanguard',
      'Volksbank',
      'WisdomTree',
      'Xtrackers',
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
          ' AT Kaufumsatz',
          ' CH Kaufumsatz',
          ' ES Kaufumsatz',
          ' FR Kaufumsatz',
          ' GB Kaufumsatz',
          ' HR Kaufumsatz',
          ' IT Kaufumsatz',
          ' PT Kaufumsatz',
          'Air France',
          'Airbnb',
          'Avis',
          'Bahn',
          'Booking',
          'British Airways',
          'Easyjet',
          'EasyPark',
          'Europapark',
          'Europcar',
          'Eurowings',
          'Expedia',
          'Flgh',
          'Flixbus',
          'Flug',
          'Garage',
          'Hertz',
          'Hotel',
          'Italia',
          'LEGOLAND',
          'Lufthansa',
          'Opodo',
          'Parkhaus',
          'Parkpl',
          'Parkraumwelten',
          'Reise',
          'Riesenrad',
          'Ryanair',
          'Sixt',
          'Sport',
          'Tierpark',
          'Trivago',
          'Urlaub',
          'Zoo',
          'Zug',
        ],
        excludeKeywords: [],
      },
      {
        name: 'Kleidung',
        subCategories: [],
        type: 'expense',
        excludeKeywords: [],
        keywords: [
          'Abercrombie',
          'Adidas',
          'Bench',
          'Bershka',
          'Bonprix',
          'Breuninger',
          'C&A',
          'Calvin Klein',
          'Cecil',
          'Diesel',
          'Esprit',
          'Esprit',
          'Fashion',
          'G-Star',
          'Gerry Weber',
          'H&M',
          'Hallhuber',
          'Hilfiger',
          'Hollister',
          'Hugo Boss',
          'Jack Wolfskin',
          'Kaufhaus',
          'KIK',
          'Kleidung',
          'Levis',
          'Mango',
          'Mango',
          'Mango',
          'Marc O Polo',
          'Mode',
          'New Yorker',
          'Nike',
          'Olymp',
          'Only',
          'Orsay',
          'Pepe Jeans',
          'Primark',
          'PULL&BEAR',
          'Puma',
          'QVC',
          'Reserved',
          'S.Oliver',
          'Schuh',
          'Street One',
          'Superdry',
          'Takko',
          'Tally Weijl',
          'Tchibo',
          'Tom Tailor',
          'Under Armour',
          'Vero Moda',
          'Zalando',
          'Zara',
          'Ernstings',
        ],
      },
      {
        name: 'Freizeit',
        subCategories: [],
        type: 'expense',
        excludeKeywords: [],
        keywords: ['Thalia', 'Buecher', 'Buchhandlung', 'Kino', 'Konzert', 'Museum', 'Theater', 'Eventim', 'Ticket'],
      },
      {
        name: 'Geschenke',
        subCategories: [],
        type: 'expense',
        excludeKeywords: [],
        keywords: [
          'Blumen',
          'Geburtstag',
          'Geschenk',
          'Pandora',
          'Schreibwaren',
          'Spielwaren',
          'Spielzeug',
          'Swarovski',
          'Weihnachten',
          'Christ',
          'Schmuck',
          'Steiff',
          'Tiffany',
          'Toys',
          'parfum',
        ],
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
        ],
        excludeKeywords: ['Apple Pay'],
      },
    ],
    type: 'expense',
    excludeKeywords: [],
    keywords: [],
  },
  {
    name: 'Essen & Trinken',
    icon: 'fa-solid fa-burger',
    type: 'expense',
    excludeKeywords: [],
    keywords: [],
    subCategories: [
      {
        name: 'Tiere',
        subCategories: [],
        type: 'expense',
        excludeKeywords: ['Tierpark'],
        keywords: ['Fressnapf', 'Tierarzt', 'Tier', 'Zooplus', 'Dr.Med.Vet'],
      },
      {
        name: 'Restaurant',
        subCategories: [],
        type: 'expense',
        excludeKeywords: [],
        keywords: [
          'Braeu',
          'Brau',
          'Burger',
          'Cafe',
          'Doener',
          'Essen',
          'Five Guys',
          'Gastronomie',
          'Hofpfisterei',
          'Kaffee',
          'Kuchen',
          'L Osteria',
          'Lindt',
          'Losteria',
          'Mcdonalds',
          'Nordsee',
          'Pizzeria',
          'Rathauscaf',
          'Restaura',
          'Restaurant',
          'Subway',
          'Takeaway.com',
          'Vapiano',
          'Wirtshaus',
        ],
      },
      {
        name: 'Lebensmittel',
        subCategories: [],
        type: 'expense',
        excludeKeywords: [],
        keywords: [
          'Aldi',
          'Back',
          'Baecker',
          'Dm Fil',
          'Drogerie',
          'Edeka',
          'Euroshop',
          'Getraenke',
          'Getranke',
          'HelloFresh',
          'Ihle',
          'Kaufland',
          'Lidl',
          'Metzge',
          'Metzger',
          'Mueller',
          'Murr',
          'Netto',
          'Penny',
          'Rewe',
          'Rossmann',
          'Spar Fil',
          'Starbucks',
          'Supermarkt',
          'Wuensche',
        ],
      },
      {
        name: 'Apotheke',
        subCategories: [],
        type: 'expense',
        excludeKeywords: [],
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
          'Saturn',
        ],
        excludeKeywords: [],
      },
      {
        name: 'Garten- und Möbelhäuser',
        subCategories: [],
        type: 'expense',
        keywords: [
          'Baywa',
          'Dehner',
          'Garten',
          'Hornbach',
          'Ikea',
          'Leuchten',
          'Moebel',
          'Moemax',
          'Kunsthandwerk',
          'Poco',
          'Roller',
          'Teppich',
          'Woolworth',
          'XXXL',
          'Emma Matratzen',
          'Bett',
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
        excludeKeywords: [],
        keywords: ['Strom', 'Energie', 'E.ON', 'Stadtwerke', 'SWM', 'EnBW', 'Yello'],
      },
      {
        name: 'Internet',
        subCategories: [],
        type: 'expense',
        excludeKeywords: [],
        keywords: ['Vodafone', 'Congstar', 'Telekom', 'O2', 'Telefonica', 'Kabel Deutschland', 'Unitymedia', '1und1'],
      },
      {
        name: 'Streaming',
        subCategories: [],
        type: 'expense',
        excludeKeywords: [],
        keywords: ['Spotify', 'Netflix', 'Prime Video', 'Disney', 'Sky', 'Maxdome', 'Apple Music', 'YouTube'],
      },
      {
        name: 'Rundfunk',
        subCategories: [],
        type: 'expense',
        excludeKeywords: [],
        keywords: ['Rundfunk', 'GEZ'],
      },
    ],
    type: 'expense',
    excludeKeywords: [],
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
        excludeKeywords: [],
        keywords: [
          'Bahn',
          'Bus',
          'BVG',
          'HVV',
          'MVG',
          'MVV',
          'S-Bahn',
          'Tram',
          'U-Bahn',
          'Verkehrsbetriebe',
          'VGN',
          'VMT',
          'VRR',
          'VRS',
          'VVO',
          'VVS',
          'VVS',
          'VVS',
        ],
      },
      {
        name: 'Tanken',
        subCategories: [],
        type: 'expense',
        excludeKeywords: [],
        keywords: [
          'AGIP',
          'Allguth',
          'ARAL',
          'AVIA',
          'Esso',
          'Gutmann Eni',
          'Jet ',
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
        excludeKeywords: [],
        keywords: ['Kfz-Steuer', 'ADAC', 'TÜV', 'Dekra'],
      },
      {
        name: 'Auto',
        subCategories: [],
        type: 'expense',
        keywords: ['Auto', 'Autohaus', 'Kennzeichen'],
        excludeKeywords: [],
      },
      {
        name: 'Fahrrad',
        subCategories: [],
        type: 'expense',
        excludeKeywords: [],
        keywords: ['Fahrrad', 'Radl', 'Bike'],
      },
    ],
    type: 'expense',
    excludeKeywords: [],
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
        keywords: ['Versicherung', 'HUK', 'DEVK', 'AXA', 'Allianz', 'ERGO', 'Signal Iduna', 'Gothaer'],
        excludeKeywords: [],
      },
      {
        name: 'Steuer',
        subCategories: [],
        type: 'expense',
        keywords: ['Steuer', 'Finanzamt'],
        excludeKeywords: ['Kfz-Steuer'],
      },
      {
        name: 'Bankgebühren',
        subCategories: [],
        type: 'expense',
        keywords: ['Kontof�hrung', 'Bankgeb�hren', 'Bankgebuehren'],
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
    excludeKeywords: [],
    keywords: ['Miete', 'Nebenkosten', 'Wohnung', 'Kaution', 'Makler', 'Immobili'],
  },
];
