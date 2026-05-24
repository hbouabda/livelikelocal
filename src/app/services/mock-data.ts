export interface City {
  id: string;
  name: string;
  country: string;
  tagline: string;
  description: string;
  image: string;
  popularCategories: string[];
}

export interface Experience {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number; // in hours
  maxParticipants: number;
  category: 'Gastronomy' | 'Culture' | 'Adventure' | 'Art & Craft' | 'Nightlife';
  included: string[];
  notIncluded: string[];
  meetingPoint: string;
  image: string;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Guide {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  bio: string;
  cityId: string;
  cityName: string;
  languages: string[];
  skills: string[];
  verified: boolean;
  rating: number;
  reviewCount: number;
  pricePerHour: number;
  photos: string[];
  experiences: Experience[];
  reviews: Review[];
  responseRate: string;
  activeSince: string;
}

export const CITIES: City[] = [
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    tagline: 'Vivez la vie parisienne secrète',
    description: 'Découvrez les ateliers d\'artistes cachés de Montmartre, dégustez des croissants tout juste sortis du four dans de petites boulangeries de quartier et percez les mystères de la Ville Lumière avec des passionnés.',
    image: 'https://picsum.photos/seed/paris-gyg/800/600',
    popularCategories: ['Gastronomy', 'Culture', 'Art & Craft']
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japon',
    tagline: 'Entre traditions ancestrales et néons futuristes',
    description: 'Explorez des ruelles illuminées par les lanternes avec des izakayas secrets, découvrez la vraie culture otaku à Akihabara et vivez des rituels shinto authentiques inconnus des guides papier officiels.',
    image: 'https://picsum.photos/seed/tokyo-gyg/800/600',
    popularCategories: ['Adventure', 'Gastronomy', 'Culture']
  },
  {
    id: 'marrakech',
    name: 'Marrakech',
    country: 'Maroc',
    tagline: 'Un voyage sensoriel au cœur de la Médina',
    description: 'Négociez dans les souks d\'artisans authentiques, savourez un thé à la menthe traditionnel sur les toits secrets surplombant l\'Atlas et préparez un tajine traditionnel dans un riad familial caché.',
    image: 'https://picsum.photos/seed/marrakech-gyg/800/600',
    popularCategories: ['Gastronomy', 'Art & Craft', 'Culture']
  },
  {
    id: 'rome',
    name: 'Rome',
    country: 'Italie',
    tagline: 'La Dolce Vita des Romains de souche',
    description: 'Faites des pâtes fraîches à la main sous le regard bienveillant d\'une grand-mère romaine, savourez des vins confidentiels du Latium et flânez dans le Trastevere loin de la foule des grands monuments.',
    image: 'https://picsum.photos/seed/rome-gyg/800/600',
    popularCategories: ['Gastronomy', 'Culture', 'Art & Craft']
  },
  {
    id: 'newyork',
    name: 'New York',
    country: 'Égypte / USA',
    tagline: 'Le New York underground de Brooklyn à Harlem',
    description: 'Découvrez les meilleurs murs de street art à Bushwick, dénichez des speakeasies des années de prohibition et visitez des clubs de jazz intimes où jouent les futurs talents locaux de la nuit.',
    image: 'https://picsum.photos/seed/ny-gyg/800/600',
    popularCategories: ['Nightlife', 'Culture', 'Adventure']
  }
];

export const GUIDES: Guide[] = [
  {
    id: 'g-chloe',
    firstName: 'Chloé',
    lastName: 'Laurent',
    avatar: 'https://picsum.photos/seed/chloe/150/150',
    bio: 'Pâtissière de formation et née à Montmartre, j\'adore faire découvrir le vrai Paris littéraire et gourmand. On évitera les pièges à touristes pour déguster les meilleurs macarons, fromages et chocolats artisanaux de la capitale!',
    cityId: 'paris',
    cityName: 'Paris',
    languages: ['Français', 'Anglais'],
    skills: ['Spécialiste Pâtisserie', 'Historienne locale', 'Amoureuse du Fromage'],
    verified: true,
    rating: 4.9,
    reviewCount: 124,
    pricePerHour: 45,
    responseRate: '100% en moins de 30 min',
    activeSince: '2023',
    photos: [
      'https://picsum.photos/seed/paris-ex1/600/400',
      'https://picsum.photos/seed/paris-ex2/600/400',
      'https://picsum.photos/seed/paris-ex3/600/400'
    ],
    reviews: [
      {
        id: 'r1',
        userName: 'Sophia Jenkins',
        userAvatar: 'https://picsum.photos/seed/user1/100/100',
        rating: 5,
        comment: 'Une expérience tout simplement magique ! Chloé connaît chaque coin secret de Montmartre. Les dégustations de fromages et de chocolats étaient incroyables, de vrais petits trésors familiaux de quartier !',
        date: '14 Mai 2026'
      },
      {
        id: 'r2',
        userName: 'Pierre Dubois',
        userAvatar: 'https://picsum.photos/seed/user2/100/100',
        rating: 4.8,
        comment: 'Génial d\'entendre toutes les histoires sur les artistes parisiens tout en mangeant des éclairs au chocolat d\'exception. Je recommande à 100% !',
        date: '28 Avril 2026'
      }
    ],
    experiences: [
      {
        id: 'exp-paris1',
        title: 'La Route Sucrée de Montmartre : Pâtisseries et Chocolats d\'exception',
        description: 'Une balade conviviale à travers les ruelles pavées de la butte. Nous nous arrêterons chez 5 artisans d\'exception méticuleusement sélectionnés (chocolatier primé, boulanger historique, confiseur traditionnel) pour une séance de dégustations inoubliables.',
        price: 55,
        duration: 3,
        maxParticipants: 8,
        category: 'Gastronomy',
        included: ['Toutes les dégustations (6 gâteaux et douceurs)', 'Une boisson chaude ou un cidre frais', 'Un livret de recettes parisiennes secrètes'],
        notIncluded: ['Achat de paquets de chocolats supplémentaires pour vos proches', 'Transports personnels'],
        meetingPoint: 'Sortie du Métro Abbesses (Ligne 12), près du Mur des Je t\'aime',
        image: 'https://picsum.photos/seed/paris-exp-patisserie/800/500'
      },
      {
        id: 'exp-paris2',
        title: 'Secret Marais de Cour d\'Honneur en Galerie Cachée',
        description: 'Évitez la foule et pénétrez dans les cours particulières du Marais normalement fermées au public. Découvrez les secrets des hôtels particuliers et terminez par une dégustation de vins et fromages chez un affineur local.',
        price: 65,
        duration: 2.5,
        maxParticipants: 6,
        category: 'Culture',
        included: ['Accès guidé aux cours intérieures exclusives', 'Plan historique annoté', 'Planche fromage & vin sélectionné par nos soins'],
        notIncluded: ['Bouteilles de vin à emporter'],
        meetingPoint: 'Devant la Mairie du 4e arrondissement de Paris',
        image: 'https://picsum.photos/seed/paris-exp-marais/800/500'
      }
    ]
  },
  {
    id: 'g-kenji',
    firstName: 'Kenji',
    lastName: 'Sato',
    avatar: 'https://picsum.photos/seed/kenji/150/150',
    bio: 'Ancien barman d\'izakaya à Shinjuku et grand amateur d\'art numérique et de pop-culture, j\'emmène les voyageurs hors des sentiers battus pour voir le vrai Tokyo. Découvrez les ruelles cachées de Golden Gai, les secrets des temples et les salles d\'arcade nippones comme un natif !',
    cityId: 'tokyo',
    cityName: 'Tokyo',
    languages: ['Japonais', 'Anglais'],
    skills: ['Expert Mixologie japonaise', 'Historien Otaku', 'Guide Street-food'],
    verified: true,
    rating: 4.8,
    reviewCount: 96,
    pricePerHour: 50,
    responseRate: '98% de réponses rapides',
    activeSince: '2022',
    photos: [
      'https://picsum.photos/seed/tokyo-ex1/600/400',
      'https://picsum.photos/seed/tokyo-ex2/600/400',
      'https://picsum.photos/seed/tokyo-ex3/600/400'
    ],
    reviews: [
      {
        id: 'r3',
        userName: 'David Miller',
        userAvatar: 'https://picsum.photos/seed/user3/100/100',
        rating: 5,
        comment: 'Kenji est incroyable ! Il nous a fait visiter des izakayas où personne ne parlait anglais, mais tout le monde était extrêmement chaleureux. Nous avons mangé des brochettes yakitori sensationnelles !',
        date: '10 Mai 2026'
      }
    ],
    experiences: [
      {
        id: 'exp-tokyo1',
        title: 'Exploration Izakaya & Street Food sous les voies ferrées de Shinjuku',
        description: 'Dînez comme lessalarymen tokyoïtes. Nous explorerons l\'authentique Omoide Yokocho d\'après-guerre, puis dégusterons des sakés artisanaux accompagnés de yakitori cuits au charbon de bois de Binchotan dans de minuscules tavernes.',
        price: 75,
        duration: 4,
        maxParticipants: 6,
        category: 'Gastronomy',
        included: ['3 plats typiques d\'izakaya', 'Dégustation comparée de 3 sakés anciens', 'Visite guidée des ruelles de Golden Gai'],
        notIncluded: ['Boissons additionnelles non comprises dans le forfait d\'origine'],
        meetingPoint: 'Sous l\'horloge géante de la sortie Est de la gare de Shinjuku',
        image: 'https://picsum.photos/seed/tokyo-exp-izakaya/800/500'
      },
      {
        id: 'exp-tokyo2',
        title: 'Akihabara Vintage : De l\'enfer des circuits électroniques aux perles rétro-gaming',
        description: 'Plongez dans le paradis secret de l\'électronique et du gaming des années 80. Nous visiterons des bazars de pièces détachées fascinants, des salles de jeu d\'époque légendaires et ferons un saut dans la vraie culture pop nippone.',
        price: 49,
        duration: 3,
        maxParticipants: 10,
        category: 'Adventure',
        included: ['Entrée dans 2 centres communautaires secrets', 'Pièces d\'arcade fournies pour jouer aux classiques', 'Café traditionnel de collectionneurs de manga'],
        notIncluded: ['Achats personnels de figurines ou mangas rétro'],
        meetingPoint: 'Sortie Électrique de la gare d\'Akihabara',
        image: 'https://picsum.photos/seed/tokyo-exp-retro/800/500'
      }
    ]
  },
  {
    id: 'g-amina',
    firstName: 'Amina',
    lastName: 'Bensaid',
    avatar: 'https://picsum.photos/seed/amina/150/150',
    bio: 'Artisane de tapis de troisième génération et passionnée d\'herboristerie, j\'adore raconter l\'histoire millénaire des dynasties marocaines à travers les souks cachés et les riads secrets de ma ville natale.',
    cityId: 'marrakech',
    cityName: 'Marrakech',
    languages: ['Arabe', 'Français', 'Anglais'],
    skills: ['Tissage traditionnel', 'Savoir-faire des Épices', 'Architecture des Medersas'],
    verified: true,
    rating: 4.9,
    reviewCount: 156,
    pricePerHour: 35,
    responseRate: '100% connectée',
    activeSince: '2021',
    photos: [
      'https://picsum.photos/seed/marrakech-ex1/600/400',
      'https://picsum.photos/seed/marrakech-ex2/600/400',
      'https://picsum.photos/seed/marrakech-ex3/600/400'
    ],
    reviews: [
      {
        id: 'r4',
        userName: 'Elisa Guttman',
        userAvatar: 'https://picsum.photos/seed/user4/100/100',
        rating: 5,
        comment: 'Amina est une hôtesse d\'une gentillesse rare. Elle nous a montré des herboristes authentiques au fond de ruelles que nous n\'aurions jamais pu trouver seuls. Le thé à la menthe final dans un riad secret était paradisiaque.',
        date: '19 Mai 2026'
      }
    ],
    experiences: [
      {
        id: 'exp-marrakech1',
        title: 'Les Artisans Cachés du Souk et Initiation à l\'Herboristerie locale',
        description: 'Loin du tumulte de la place Jemaa el-Fna, entrez dans les coopératives cachées où travaillent maroquiniers, forgerons et teinturiers traditionnels. Terminez par une visite envoûtante chez un herboriste berbère historique pour découvrir l\'huile d\'argan authentique.',
        price: 30,
        duration: 3.5,
        maxParticipants: 10,
        category: 'Art & Craft',
        included: ['Thé à la menthe traditionnel de bienvenue', 'Guide d\'orientation cartographique des souks', 'Démonstration de tissage traditionnel interactif'],
        notIncluded: ['Pourboires éventuels', 'Épices ou huiles d\'argan que vous choisirez d\'acheter'],
        meetingPoint: 'Devant l\'iconique minaret de la Mosquée de la Koutoubia',
        image: 'https://picsum.photos/seed/marrakech-exp-souk/800/500'
      }
    ]
  },
  {
    id: 'g-francesca',
    firstName: 'Francesca',
    lastName: 'Rossi',
    avatar: 'https://picsum.photos/seed/francesca/150/150',
    bio: 'Archéologue passionnée d\'art culinaire de Rome, ma mission est de réunir la beauté des histoires impériales anciennes avec la gastronomie secrète des trattorias familiales cachées. Préparez-vous à rire, manger et trinquer !',
    cityId: 'rome',
    cityName: 'Rome',
    languages: ['Italien', 'Anglais', 'Espagnol'],
    skills: ['Archéologie romaine', 'Chef Pasticciere', 'Aventurière oenologue'],
    verified: true,
    rating: 4.9,
    reviewCount: 142,
    pricePerHour: 40,
    responseRate: 'Réponse immédiate',
    activeSince: '2022',
    photos: [
      'https://picsum.photos/seed/rome-ex1/600/400',
      'https://picsum.photos/seed/rome-ex2/600/400',
      'https://picsum.photos/seed/rome-ex3/600/400'
    ],
    reviews: [
      {
        id: 'r5',
        userName: 'Lucia Sanchez',
        userAvatar: 'https://picsum.photos/seed/user5/100/100',
        rating: 5,
        comment: 'Quel après-midi fabuleux ! Faire de vraies pâtes fraîches avec une vraie famille de restaurateurs du Trastevere en élevant nos verres de Chianti. Francesca est drôle et passionnante.',
        date: '05 Mai 2026'
      }
    ],
    experiences: [
      {
        id: 'exp-rome1',
        title: 'Masterclass de Fabrication de Pâtes Fraîches dans un Atelier Familial',
        description: 'Retrouvons-nous dans la cuisine privée d\'une vieille trattoria du Trastevere. Nous apprendrons les secrets d\'une pâte parfaite (Fettuccine et Ravioli) avec des sauces locales traditionnelles et finirons par un banquet chaleureux et bien arrosé !',
        price: 59,
        duration: 3,
        maxParticipants: 8,
        category: 'Gastronomy',
        included: ['Tous les ingrédients bio', 'Boissons à volonté (vins de domaine locaux et Limoncello)', 'Le repas complet pris tous ensemble'],
        notIncluded: ['Trajets aller-retour'],
        meetingPoint: 'Piazza de Santa Maria in Trastevere, près de la fontaine historique',
        image: 'https://picsum.photos/seed/rome-exp-pasta/800/500'
      }
    ]
  },
  {
    id: 'g-marcus',
    firstName: 'Marcus',
    lastName: 'Miller',
    avatar: 'https://picsum.photos/seed/marcus/150/150',
    bio: 'Musicien de jazz de rue et photographe de street art vivant à Brooklyn (Williamsburg). J\'adore guider les gens à travers les secrets graphiques urbains et les clubs de jazz de sous-sol oubliés des touristes.',
    cityId: 'newyork',
    cityName: 'New York (Harlem & Bk)',
    languages: ['Anglais', 'Espagnol'],
    skills: ['Saxophoniste Pro', 'Expert Street Art mural', 'Dénicheur de Speakeasies'],
    verified: true,
    rating: 4.7,
    reviewCount: 78,
    pricePerHour: 55,
    responseRate: '95% de réponses',
    activeSince: '2023',
    photos: [
      'https://picsum.photos/seed/ny-ex1/600/400',
      'https://picsum.photos/seed/ny-ex2/600/400',
      'https://picsum.photos/seed/ny-ex3/600/400'
    ],
    reviews: [
      {
        id: 'r6',
        userName: 'Tyler Vance',
        userAvatar: 'https://picsum.photos/seed/user6/100/100',
        rating: 4.8,
        comment: 'Incroyable tour artistique ! Marcus nous a montré la face cachée de Bushwick et comment les artistes coopèrent. On a fini dans un club de jazz underground de Harlem génialissime !',
        date: '10 Avril 2026'
      }
    ],
    experiences: [
      {
        id: 'exp-ny1',
        title: 'Underground Brooklyn : Graffitis de Bushwick et club de Jazz Secret',
        description: 'Explorez la Mecque mondiale du graffiti avec un artiste local. Nous verrons les fresques gigantesques, expliquerons les codes secrets du tag urbain, puis nous nous rendrons dans un speakeasy secret à Greenwich Village pour écouter un set jazz époustouflant.',
        price: 69,
        duration: 3.5,
        maxParticipants: 12,
        category: 'Nightlife',
        included: ['Visite guidée de Bushwick et Greenwich', 'Une entrée coupe-file au speakeasy', 'Un cocktail signature local ou bière de microbrasserie'],
        notIncluded: ['Pass de métro de New York', 'Boissons supplémentaires'],
        meetingPoint: 'Devant la station de métro Jefferson Street (Ligne L), à la sortie principale',
        image: 'https://picsum.photos/seed/ny-exp-jazz/800/500'
      }
    ]
  }
];
