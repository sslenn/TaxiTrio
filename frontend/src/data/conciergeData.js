export const CONCIERGE_DESTINATIONS = {
  kampot: {
    province: 'Kampot',
    confidence: 96,
    reason: 'Based on your description, I recommend Kampot because you mentioned wanting a peaceful escape. Compared to Phnom Penh, Kampot offers quieter scenery, riverside cafés, pepper farms, and mountain viewpoints.',
    tags: ['Nature', 'Relaxing', 'Photography', 'Slow Travel'],
    bestTime: 'November – February',
    budget: 85,
    distance: 132,
    drivingTime: '2 hr 45 min',
    vehicle: 'Luxury SUV',
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Bokor_palace_hotel_Cambodia.jpg',
    attractions: [
      {
        title: 'La Plantation Pepper Farm',
        category: 'Nature & Culture',
        stay: '1.5 hrs',
        time: '45 mins away',
        image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
        description: 'Taste the organic, world-famous black, red, and white pepper and tour the plantation fields.'
      },
      {
        title: 'Salt Fields of Kampot',
        category: 'Sightseeing',
        stay: '45 mins',
        time: '15 mins away',
        image: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=600&q=80',
        description: 'Watch the beautiful water reflections on salt pans where workers harvest white gold.'
      },
      {
        title: 'Bokor National Park',
        category: 'Adventure',
        stay: '2.5 hrs',
        time: '50 mins away',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Kirche_auf_dem_Gel%C3%A4nde_der_Bokor_Hill_Station%2C_Ansicht_2.jpg/1920px-Kirche_auf_dem_Gel%C3%A4nde_der_Bokor_Hill_Station%2C_Ansicht_2.jpg',
        description: 'Climb high into the mist-covered mountains to view abandoned French colonial palaces and shrines.'
      },
      {
        title: 'Secret Lake',
        category: 'Relaxation',
        stay: '1 hr',
        time: '30 mins away',
        image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80',
        description: 'A serene lake nestled between the hills, perfect for a cold coconut and peaceful scenery.'
      },
      {
        title: 'Riverside Sunset Cruise',
        category: 'Leisure',
        stay: '1.5 hrs',
        time: 'In town',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
        description: 'Cruise along the Prek Tuek Chhou river, watching local fireflies and the sun dipping below the hills.'
      },
      {
        title: 'Kampot Night Market',
        category: 'Shopping & Food',
        stay: '1 hr',
        time: 'In town',
        image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=600&q=80',
        description: 'Sample local specialties like grilled squid and durian in the vibrant market.'
      }
    ],
    restaurant: {
      name: 'Epic Arts Café',
      rating: 5,
      reason: 'Excellent local and international healthy cuisine, supporting deaf and disabled artists. Located 10 minutes from the town center.'
    }
  },
  'siem-reap': {
    province: 'Siem Reap',
    confidence: 98,
    reason: 'Siem Reap is the ideal choice based on your interest in Khmer history and photography. This route places you at the major temples for sunrise and sunset to ensure breathtaking photos and historical depth.',
    tags: ['Heritage', 'Khmer History', 'Photography', 'Ancient Ruins'],
    bestTime: 'December – February',
    budget: 120,
    distance: 315,
    drivingTime: '5 hr 30 min',
    vehicle: 'Luxury SUV',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Sunrise_at_Angkor_Wat_Cambodia.jpg/1920px-Sunrise_at_Angkor_Wat_Cambodia.jpg',
    attractions: [
      {
        title: 'Angkor Wat Sunrise',
        category: 'Heritage',
        stay: '2.5 hrs',
        time: '15 mins away',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Sunrise_at_Angkor_Wat_Cambodia.jpg/1920px-Sunrise_at_Angkor_Wat_Cambodia.jpg',
        description: 'See the majestic towers of Angkor Wat silhouetted against a spectacular sunrise sky.'
      },
      {
        title: 'Bayon Temple',
        category: 'History',
        stay: '1.5 hrs',
        time: '20 mins away',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Bayon%2C_Angkor_Thom%2C_Camboya%2C_2013-08-16%2C_DD_09.jpg/1920px-Bayon%2C_Angkor_Thom%2C_Camboya%2C_2013-08-16%2C_DD_09.jpg',
        description: 'Marvel at the 216 giant smiling stone faces of Avalokiteshvara looking down on the towers.'
      },
      {
        title: 'Ta Prohm Temple',
        category: 'Adventure',
        stay: '1.5 hrs',
        time: '25 mins away',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Ta_Phrom%2C_Angkor%2C_Camboya%2C_2013-08-16%2C_DD_41.JPG/1920px-Ta_Phrom%2C_Angkor%2C_Camboya%2C_2013-08-16%2C_DD_41.JPG',
        description: 'Wander through the jungle-swallowed ruins famously known as the Tomb Raider temple.'
      },
      {
        title: 'Banteay Srei',
        category: 'Fine Arts',
        stay: '1.2 hrs',
        time: '45 mins away',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
        description: 'Explore the pink sandstone temple featuring the most intricate wall carvings in Cambodia.'
      },
      {
        title: 'Phare, The Cambodian Circus',
        category: 'Culture',
        stay: '2 hrs',
        time: 'In town',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
        description: 'Experience an evening of high-flying acrobatics, theater, and music narrating local folk tales.'
      },
      {
        title: 'Angkor Night Market & Pub Street',
        category: 'Nightlife',
        stay: '2 hrs',
        time: 'In town',
        image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=600&q=80',
        description: 'Stroll Pub Street for food stalls, massages, souvenir markets, and vibrant music bars.'
      }
    ],
    restaurant: {
      name: 'Malis Restaurant Siem Reap',
      rating: 5,
      reason: 'Living Cambodian Cuisine in a beautiful luxury garden. Celebrated for rediscovering ancient Khmer recipes.'
    }
  },
  'sihanoukville': {
    province: 'Sihanoukville & Koh Rong',
    confidence: 94,
    reason: 'I selected the coastal province because you mentioned a beach escape or romantic getaway. This plans ferry links to Koh Rong island, pristine white sands, and fresh oceanfront seafood.',
    tags: ['Beach', 'Romantic', 'Seafood', 'Islands'],
    bestTime: 'November – April',
    budget: 150,
    distance: 220,
    drivingTime: '2 hr 30 min',
    vehicle: 'VIP Sedan',
    image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=600&q=80',
    attractions: [
      {
        title: 'Otres Beach Relaxing',
        category: 'Leisure',
        stay: '2 hrs',
        time: '15 mins away',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
        description: 'Unwind on the soft white sands of Sihanoukville\'s cleanest and most tranquil public beach.'
      },
      {
        title: 'Koh Rong Speed Ferry',
        category: 'Transit',
        stay: '45 mins',
        time: 'Port departure',
        image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=600&q=80',
        description: 'Sail in comfort across the warm waters on a high-speed catamaran ferry to Koh Rong.'
      },
      {
        title: 'Sok San Beach (Koh Rong)',
        category: 'Beach',
        stay: '3 hrs',
        time: 'On island',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
        description: 'Walk down this stunning 7-kilometer stretch of untouched sand with warm turquoise waters.'
      },
      {
        title: 'Bioluminescent Plankton Swim',
        category: 'Nature Magic',
        stay: '1 hr',
        time: 'Night activity',
        image: 'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?auto=format&fit=crop&w=600&q=80',
        description: 'Take a midnight boat and swim in sparkling bioluminescent waters that glow blue with motion.'
      },
      {
        title: 'Saracen Bay (Koh Rong Sanloem)',
        category: 'Romantic',
        stay: '3 hrs',
        time: 'Island transit',
        image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80',
        description: 'A quiet crescent bay with shallow calm water, perfect for couples seeking peaceful luxury.'
      },
      {
        title: 'Phsar Leu Seafood Feast',
        category: 'Food',
        stay: '1.5 hrs',
        time: 'In city',
        image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=600&q=80',
        description: 'Pick fresh blue crabs, squids, and sea snails and have local cooks grill them instantly.'
      }
    ],
    restaurant: {
      name: 'Sandan Coast Grill',
      rating: 5,
      reason: 'Gourmet seafood restaurant right on the shoreline. Try the Kep crab seasoned with Kampot pepper.'
    }
  },
  'phnom-penh': {
    province: 'Phnom Penh',
    confidence: 92,
    reason: 'Phnom Penh is selected for you because of your interest in urban food culture, historical monuments, and river scenery. We have curated city landmarks and top-tier Khmer dining.',
    tags: ['Capital', 'Foodie', 'Urban Culture', 'Museums'],
    bestTime: 'October – March',
    budget: 95,
    distance: 20,
    drivingTime: '1 hr',
    vehicle: 'Luxury Sedan',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Le_Palais_Royal_%28Phnom_Penh%29_%286997773481%29.jpg',
    attractions: [
      {
        title: 'Royal Palace & Silver Pagoda',
        category: 'Culture',
        stay: '1.5 hrs',
        time: 'Riverside',
        image: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Le_Palais_Royal_%28Phnom_Penh%29_%286997773481%29.jpg',
        description: 'Walk the manicured grounds and see the Silver Pagoda, lined with 5,000 solid silver floor tiles.'
      },
      {
        title: 'National Museum of Cambodia',
        category: 'Heritage',
        stay: '1.2 hrs',
        time: 'City Center',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/2016_Phnom_Penh%2C_Pa%C5%82ac_Kr%C3%B3lewski%2C_Preah_Tineang_Phhochani_%2814%29.jpg/1920px-2016_Phnom_Penh%2C_Pa%C5%82ac_Kr%C3%B3lewski%2C_Preah_Tineang_Phhochani_%2814%29.jpg',
        description: 'View the largest archive of historical Khmer sculptures, bronzes, and carvings in the world.'
      },
      {
        title: 'Tuol Sleng Museum (S-21)',
        category: 'History',
        stay: '1.5 hrs',
        time: 'BKK area',
        image: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=600&q=80',
        description: 'Pay respects at the former high school turned detention facility during the Khmer Rouge era.'
      },
      {
        title: 'Central Market (Psar Thmei)',
        category: 'Architecture',
        stay: '1 hr',
        time: 'Downtown',
        image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=600&q=80',
        description: 'Shop under a giant yellow Art Deco dome designed in 1937, featuring jewelry and clothing.'
      },
      {
        title: 'Wat Phnom Historical Hill',
        category: 'Culture',
        stay: '45 mins',
        time: 'North City',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
        description: 'Visit the 14th-century temple marking the founding hill of the capital city.'
      },
      {
        title: 'Mekong Sunset Cruise',
        category: 'Leisure',
        stay: '1.5 hrs',
        time: 'Riverside',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
        description: 'Watch the capital skyline light up at sunset from a private double-decker wooden cruise boat.'
      }
    ],
    restaurant: {
      name: 'Malis Restaurant Phnom Penh',
      rating: 5,
      reason: 'High-end Courtyard dining by Master Chef Luu Meng. Renowned for luxury fish amok and Kampot pepper crab.'
    }
  },
  'mondulkiri': {
    province: 'Mondulkiri',
    confidence: 95,
    reason: 'Mondulkiri matches your desire for adventure, waterfalls, and nature. This route travels into the pine forests and hills, visiting rescued elephants and indigenous villages.',
    tags: ['Nature', 'Wildlife', 'Adventure', 'Highlands'],
    bestTime: 'November – May',
    budget: 140,
    distance: 375,
    drivingTime: '6 hr 15 min',
    vehicle: 'Luxury SUV',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80',
    attractions: [
      {
        title: 'Bousra Waterfall Tour',
        category: 'Nature',
        stay: '2 hrs',
        time: '45 mins away',
        image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80',
        description: 'Visit the massive double-tier waterfall surrounded by lush green valley forests.'
      },
      {
        title: 'Elephant Valley Project',
        category: 'Wildlife',
        stay: '4 hrs',
        time: '20 mins away',
        image: 'https://images.unsplash.com/photo-1581888227599-779811939961?auto=format&fit=crop&w=600&q=80',
        description: 'Trek through natural forests alongside elephants rescued from heavy logging.'
      },
      {
        title: 'Sea Forest Viewpoint',
        category: 'Sightseeing',
        stay: '1 hr',
        time: '15 mins away',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
        description: 'Look over hundreds of rolling hills covered in evergreen pines, resembling green sea waves.'
      },
      {
        title: 'Dak Dam Bunong Village',
        category: 'Culture',
        stay: '1.5 hrs',
        time: '30 mins away',
        image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80',
        description: 'Learn about tribal heritage, farming, and unique honey harvesting with Bunong hosts.'
      },
      {
        title: 'Coffee Farm Plantation',
        category: 'Food',
        stay: '1 hr',
        time: '10 mins away',
        image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
        description: 'Explore the high-altitude volcanic soil coffee plants and enjoy organic Robusta brews.'
      },
      {
        title: 'Pine Forest Sunset',
        category: 'Scenic',
        stay: '1 hr',
        time: '5 mins away',
        image: 'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?auto=format&fit=crop&w=600&q=80',
        description: 'Walk through symmetrical tall pine tree grids at golden hour, capturing stunning photos.'
      }
    ],
    restaurant: {
      name: 'Chili On The Rocks',
      rating: 4.8,
      reason: 'Warm, cozy wood-fire grill serving highland beef stews, local organic vegetables, and herbal teas.'
    }
  }
};
