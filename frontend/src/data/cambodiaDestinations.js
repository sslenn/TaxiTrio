const keywordImage = (query) => {
  const cleanQuery = query
    .toLowerCase()
    .replace(/for|in|cambodia|traveler|photo|private|suv|sedan/g, '')
    .replace(/[^a-z0-9]+/g, ',')
    .replace(/^,+|,+$/g, '');
  return `https://loremflickr.com/1600/1100/cambodia,${cleanQuery}`;
};

const image = (src, alt) => ({ src, alt });

const keyword = (query, alt) => image(keywordImage(query), alt);

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const DESTINATION_IMAGE_SETS = {
  'phnom-penh': {
    cardImage: image(
      'https://upload.wikimedia.org/wikipedia/commons/1/1e/Le_Palais_Royal_%28Phnom_Penh%29_%286997773481%29.jpg',
      'Royal Palace in Phnom Penh, Cambodia'
    ),
    heroImage: image(
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/2016_Phnom_Penh%2C_Pa%C5%82ac_Kr%C3%B3lewski%2C_Preah_Tineang_Phhochani_%2814%29.jpg/1920px-2016_Phnom_Penh%2C_Pa%C5%82ac_Kr%C3%B3lewski%2C_Preah_Tineang_Phhochani_%2814%29.jpg',
      'Royal Palace pavilion in Phnom Penh, Cambodia'
    ),
    galleryImages: [
      image(
        'https://upload.wikimedia.org/wikipedia/commons/1/1e/Le_Palais_Royal_%28Phnom_Penh%29_%286997773481%29.jpg',
        'Royal Palace in Phnom Penh, Cambodia'
      ),
      image(
        'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Silverpagoda.jpg/3840px-Silverpagoda.jpg',
        'Silver Pagoda in Phnom Penh, Cambodia'
      ),
      image(
        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/2016_Phnom_Penh%2C_Pa%C5%82ac_Kr%C3%B3lewski%2C_Srebrna_Pagoda_%2802%29.jpg/1920px-2016_Phnom_Penh%2C_Pa%C5%82ac_Kr%C3%B3lewski%2C_Srebrna_Pagoda_%2802%29.jpg',
        'Silver Pagoda roof detail in Phnom Penh, Cambodia'
      ),
      keyword('Phnom Penh riverside Mekong Cambodia', 'Phnom Penh riverside along the Mekong River'),
      keyword('private SUV hotel pickup Cambodia', 'Private SUV hotel pickup in Cambodia'),
    ],
  },
  'siem-reap': {
    cardImage: image(
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Sunrise_at_Angkor_Wat_Cambodia.jpg/1920px-Sunrise_at_Angkor_Wat_Cambodia.jpg',
      'Angkor Wat sunrise in Siem Reap, Cambodia'
    ),
    heroImage: image(
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Angkor_Wat_in_Cambodia.jpg/1920px-Angkor_Wat_in_Cambodia.jpg',
      'Angkor Wat temple towers in Siem Reap, Cambodia'
    ),
    galleryImages: [
      image(
        'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Sunrise_at_Angkor_Wat_Cambodia.jpg/1920px-Sunrise_at_Angkor_Wat_Cambodia.jpg',
        'Angkor Wat sunrise in Siem Reap, Cambodia'
      ),
      image(
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/20191210_Angkor_Wat_Southern_Reflection_Pond-2.jpg/1920px-20191210_Angkor_Wat_Southern_Reflection_Pond-2.jpg',
        'Angkor Wat reflection pond in Siem Reap, Cambodia'
      ),
      image(
        'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Bayon%2C_Angkor_Thom%2C_Camboya%2C_2013-08-16%2C_DD_09.jpg/1920px-Bayon%2C_Angkor_Thom%2C_Camboya%2C_2013-08-16%2C_DD_09.jpg',
        'Bayon Temple faces at Angkor Thom in Cambodia'
      ),
      image(
        'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Ta_Phrom%2C_Angkor%2C_Camboya%2C_2013-08-16%2C_DD_41.JPG/1920px-Ta_Phrom%2C_Angkor%2C_Camboya%2C_2013-08-16%2C_DD_41.JPG',
        'Ta Prohm Temple roots in Siem Reap, Cambodia'
      ),
      keyword('Cambodia private luxury SUV Angkor tour', 'Private SUV for an Angkor temple tour in Cambodia'),
    ],
    itineraryImages: {
      'hotel-pickup': keyword('private SUV hotel pickup Siem Reap Cambodia', 'Private hotel pickup in Siem Reap, Cambodia'),
      'angkor-wat-sunrise': image(
        'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Sunrise_at_Angkor_Wat_Cambodia.jpg/1920px-Sunrise_at_Angkor_Wat_Cambodia.jpg',
        'Angkor Wat sunrise in Siem Reap, Cambodia'
      ),
      'angkor-thom': image(
        'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Bayon%2C_Angkor_Thom%2C_Camboya%2C_2013-08-16%2C_DD_09.jpg/1920px-Bayon%2C_Angkor_Thom%2C_Camboya%2C_2013-08-16%2C_DD_09.jpg',
        'Bayon Temple at Angkor Thom in Cambodia'
      ),
      'ta-prohm': image(
        'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Ta_Phrom%2C_Angkor%2C_Camboya%2C_2013-08-16%2C_DD_41.JPG/1920px-Ta_Phrom%2C_Angkor%2C_Camboya%2C_2013-08-16%2C_DD_41.JPG',
        'Ta Prohm Temple in Cambodia'
      ),
    },
  },
  kampot: {
    cardImage: image(
      'https://upload.wikimedia.org/wikipedia/commons/3/33/Bokor_palace_hotel_Cambodia.jpg',
      'Bokor Hill Station in Kampot, Cambodia'
    ),
    heroImage: image(
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Kirche_auf_dem_Gel%C3%A4nde_der_Bokor_Hill_Station%2C_Ansicht_2.jpg/1920px-Kirche_auf_dem_Gel%C3%A4nde_der_Bokor_Hill_Station%2C_Ansicht_2.jpg',
      'Historic church at Bokor Hill Station in Kampot, Cambodia'
    ),
    galleryImages: [
      image(
        'https://upload.wikimedia.org/wikipedia/commons/3/33/Bokor_palace_hotel_Cambodia.jpg',
        'Bokor Hill Station in Kampot, Cambodia'
      ),
      image(
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Kirche_auf_dem_Gel%C3%A4nde_der_Bokor_Hill_Station%2C_Ansicht_2.jpg/1920px-Kirche_auf_dem_Gel%C3%A4nde_der_Bokor_Hill_Station%2C_Ansicht_2.jpg',
        'Historic Bokor Hill Station church in Kampot, Cambodia'
      ),
      image(
        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/03-La_Plantation_Pepper_Farm%2C_Kampot_Province-nX-12.jpg/1920px-03-La_Plantation_Pepper_Farm%2C_Kampot_Province-nX-12.jpg',
        'Kampot pepper plantation in Cambodia'
      ),
      keyword('Kampot salt fields Cambodia', 'Kampot salt fields in Cambodia'),
      keyword('Bokor Mountain road Kampot Cambodia', 'Bokor Mountain road in Kampot, Cambodia'),
    ],
    itineraryImages: {
      'hotel-pickup': keyword('private SUV hotel pickup Kampot Cambodia', 'Private SUV hotel pickup in Kampot, Cambodia'),
      'salt-fields': keyword('Kampot salt fields Cambodia', 'Kampot salt fields in Cambodia'),
      'pepper-plantation': image(
        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/03-La_Plantation_Pepper_Farm%2C_Kampot_Province-nX-12.jpg/1920px-03-La_Plantation_Pepper_Farm%2C_Kampot_Province-nX-12.jpg',
        'Kampot pepper plantation in Cambodia'
      ),
      'bokor-mountain': image(
        'https://upload.wikimedia.org/wikipedia/commons/3/33/Bokor_palace_hotel_Cambodia.jpg',
        'Bokor Hill Station in Kampot, Cambodia'
      ),
    },
  },
  kep: {
    cardImage: image('https://upload.wikimedia.org/wikipedia/commons/e/e6/Crab_statue_Kep_Cambodia.jpg', 'Kep Crab Statue in Kep, Cambodia'),
    heroImage: image('https://upload.wikimedia.org/wikipedia/commons/e/e6/Crab_statue_Kep_Cambodia.jpg', 'Kep Crab Statue in Kep, Cambodia'),
    galleryImages: [
      keyword('Kep Crab Market Cambodia seafood', 'Kep Crab Market seafood in Cambodia'),
      keyword('Kep beach Cambodia', 'Kep beach in Cambodia'),
      keyword('fresh crab seafood Kep Cambodia', 'Fresh crab seafood in Kep, Cambodia'),
      keyword('Kep National Park Cambodia sea view', 'Kep National Park sea view in Cambodia'),
      keyword('private SUV coastal Cambodia tour', 'Private SUV coastal tour in Cambodia'),
    ],
  },
  'preah-sihanouk': {
    cardImage: image(
      'https://upload.wikimedia.org/wikipedia/commons/2/23/Sok_San_Bungalows_koh_Rong_island_Cambodia.jpg',
      'Koh Rong island beach in Cambodia'
    ),
    heroImage: image(
      'https://upload.wikimedia.org/wikipedia/commons/2/23/Sok_San_Bungalows_koh_Rong_island_Cambodia.jpg',
      'White sand beach on Koh Rong island in Cambodia'
    ),
    galleryImages: [
      image(
        'https://upload.wikimedia.org/wikipedia/commons/2/23/Sok_San_Bungalows_koh_Rong_island_Cambodia.jpg',
        'Koh Rong island beach in Cambodia'
      ),
      keyword('Koh Rong Sanloem clear water Cambodia', 'Clear water at Koh Rong Sanloem in Cambodia'),
      keyword('Sihanoukville beach Cambodia', 'Sihanoukville beach in Cambodia'),
      keyword('Cambodia island seafood beach restaurant', 'Island seafood dining in Cambodia'),
      keyword('private SUV ferry transfer Sihanoukville Cambodia', 'Private SUV ferry transfer in Sihanoukville, Cambodia'),
    ],
  },
  'koh-kong': {
    cardImage: image('https://upload.wikimedia.org/wikipedia/commons/b/b3/Cardamom_Mountains_rainforest.jpg', 'Cardamom Mountains rainforest in Koh Kong, Cambodia'),
    heroImage: image('https://upload.wikimedia.org/wikipedia/commons/b/b3/Cardamom_Mountains_rainforest.jpg', 'Cardamom Mountains rainforest in Koh Kong, Cambodia'),
    galleryImages: [
      keyword('Tatai Waterfall Koh Kong Cambodia', 'Tatai Waterfall in Koh Kong, Cambodia'),
      keyword('Cardamom jungle river Koh Kong Cambodia', 'Cardamom jungle river in Koh Kong, Cambodia'),
      keyword('Koh Kong mangrove forest Cambodia', 'Koh Kong mangrove forest in Cambodia'),
      keyword('Koh Kong river eco lodge Cambodia', 'River eco lodge in Koh Kong, Cambodia'),
      keyword('private SUV Cardamom Mountains Cambodia', 'Private SUV in the Cardamom Mountains of Cambodia'),
    ],
  },
  battambang: {
    cardImage: image(
      'https://upload.wikimedia.org/wikipedia/commons/0/07/Norrydisassembled01.JPG',
      'Battambang bamboo train in Cambodia'
    ),
    heroImage: image(
      'https://upload.wikimedia.org/wikipedia/commons/0/07/Norrydisassembled01.JPG',
      'Bamboo train railway experience in Battambang, Cambodia'
    ),
    galleryImages: [
      image(
        'https://upload.wikimedia.org/wikipedia/commons/0/07/Norrydisassembled01.JPG',
        'Battambang bamboo train in Cambodia'
      ),
      image(
        'https://upload.wikimedia.org/wikipedia/commons/7/7d/Aerial_view_of_Battambang_city.jpg',
        'Aerial view of Battambang city in Cambodia'
      ),
      keyword('Battambang countryside Cambodia rice fields', 'Battambang countryside in Cambodia'),
      keyword('Phnom Sampov Battambang Cambodia', 'Phnom Sampov in Battambang, Cambodia'),
      keyword('Battambang local food Cambodia', 'Local food in Battambang, Cambodia'),
    ],
  },
  mondulkiri: {
    cardImage: image(
      'https://upload.wikimedia.org/wikipedia/commons/a/ad/Mondulkiri_province_Northeastern_Cambodia.jpg',
      'Green hills in Mondulkiri Province, Cambodia'
    ),
    heroImage: image(
      'https://upload.wikimedia.org/wikipedia/commons/a/ad/Mondulkiri_province_Northeastern_Cambodia.jpg',
      'Green hills in Mondulkiri Province, Cambodia'
    ),
    galleryImages: [
      keyword('Mondulkiri elephants Cambodia', 'Elephants in Mondulkiri, Cambodia'),
      keyword('Elephant Valley Project Cambodia', 'Elephant Valley Project in Mondulkiri, Cambodia'),
      image(
        'https://upload.wikimedia.org/wikipedia/commons/a/ad/Mondulkiri_province_Northeastern_Cambodia.jpg',
        'Green hills in Mondulkiri Province, Cambodia'
      ),
      keyword('Bou Sra Waterfall Mondulkiri Cambodia', 'Bou Sra Waterfall in Mondulkiri, Cambodia'),
      keyword('Bunong village Mondulkiri Cambodia', 'Bunong village culture in Mondulkiri, Cambodia'),
    ],
  },
  kratie: {
    cardImage: image(
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/20171123_Sunset_over_Mekong_Kratie_3996_DxO.jpg/3840px-20171123_Sunset_over_Mekong_Kratie_3996_DxO.jpg',
      'Mekong River sunset in Kratie, Cambodia'
    ),
    heroImage: image(
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/20171123_Sunset_over_Mekong_Kratie_3996_DxO.jpg/3840px-20171123_Sunset_over_Mekong_Kratie_3996_DxO.jpg',
      'Mekong River sunset in Kratie, Cambodia'
    ),
    galleryImages: [
      keyword('Irrawaddy dolphins Kratie Cambodia', 'Irrawaddy dolphins in Kratie, Cambodia'),
      keyword('Mekong River dolphins Cambodia', 'Mekong River dolphins in Cambodia'),
      image(
        'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/20171123_Sunset_over_Mekong_Kratie_3996_DxO.jpg/3840px-20171123_Sunset_over_Mekong_Kratie_3996_DxO.jpg',
        'Mekong River sunset in Kratie, Cambodia'
      ),
      keyword('Koh Trong island Kratie Cambodia', 'Koh Trong island in Kratie, Cambodia'),
      keyword('Kratie riverside Cambodia local food', 'Riverside local food in Kratie, Cambodia'),
    ],
  },
  'preah-vihear': {
    cardImage: image(
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/03_Prasat_Preah_Vihear-nX-06478.jpg/3840px-03_Prasat_Preah_Vihear-nX-06478.jpg',
      'Preah Vihear Temple in Cambodia'
    ),
    heroImage: image(
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/03_Prasat_Preah_Vihear-nX-06478.jpg/3840px-03_Prasat_Preah_Vihear-nX-06478.jpg',
      'Clifftop Preah Vihear Temple in Cambodia'
    ),
    galleryImages: [
      image(
        'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/03_Prasat_Preah_Vihear-nX-06478.jpg/3840px-03_Prasat_Preah_Vihear-nX-06478.jpg',
        'Preah Vihear Temple in Cambodia'
      ),
      keyword('cliff temple Preah Vihear Cambodia', 'Cliff temple view at Preah Vihear, Cambodia'),
      keyword('ancient Khmer temple mountain Cambodia', 'Ancient Khmer mountain temple in Cambodia'),
      keyword('Dangrek Mountains Preah Vihear Cambodia', 'Dangrek Mountains in Preah Vihear, Cambodia'),
      keyword('private SUV Preah Vihear temple road Cambodia', 'Private SUV road to Preah Vihear Temple in Cambodia'),
    ],
  },
  ratanakiri: {
    cardImage: image(
      'https://upload.wikimedia.org/wikipedia/commons/2/25/Banlung_Yaklom_2.jpg',
      'Yeak Laom Lake in Ratanakiri, Cambodia'
    ),
    heroImage: image(
      'https://upload.wikimedia.org/wikipedia/commons/2/25/Banlung_Yaklom_2.jpg',
      'Yeak Laom Lake in Ratanakiri, Cambodia'
    ),
    galleryImages: [
      keyword('Yeak Laom Lake Ratanakiri Cambodia', 'Yeak Laom Lake in Ratanakiri, Cambodia'),
      keyword('volcanic crater lake Cambodia', 'Volcanic crater lake in Cambodia'),
      keyword('Ratanakiri jungle lake Cambodia', 'Ratanakiri jungle lake in Cambodia'),
      keyword('Ratanakiri waterfall Cambodia', 'Waterfall in Ratanakiri, Cambodia'),
      keyword('Banlung market Ratanakiri Cambodia', 'Banlung market in Ratanakiri, Cambodia'),
    ],
  },
  'kampong-chhnang': {
    cardImage: image(
      'https://upload.wikimedia.org/wikipedia/commons/a/a9/Kong_Rei_Mountain_by_Sovithya_-_panoramio.jpg',
      'Kampong Chhnang countryside landscape in Cambodia'
    ),
    heroImage: image(
      'https://upload.wikimedia.org/wikipedia/commons/a/a9/Kong_Rei_Mountain_by_Sovithya_-_panoramio.jpg',
      'Kampong Chhnang countryside landscape in Cambodia'
    ),
    galleryImages: [
      keyword('Kampong Chhnang floating village', 'Floating village in Kampong Chhnang, Cambodia'),
      keyword('Tonle Sap floating village Cambodia', 'Tonle Sap floating village in Cambodia'),
      keyword('Kampong Chhnang pottery village', 'Pottery village in Kampong Chhnang, Cambodia'),
      image(
        'https://upload.wikimedia.org/wikipedia/commons/a/a9/Kong_Rei_Mountain_by_Sovithya_-_panoramio.jpg',
        'Kampong Chhnang countryside landscape in Cambodia'
      ),
      keyword('Cambodia private lake tour vehicle', 'Private lake tour vehicle in Cambodia'),
    ],
  },
  'kampong-thom': {
    cardImage: image(
      'https://upload.wikimedia.org/wikipedia/commons/0/07/Sambor_Prei_Kuk_%2810%29.jpg',
      'Sambor Prei Kuk temple in Kampong Thom, Cambodia'
    ),
    heroImage: image(
      'https://upload.wikimedia.org/wikipedia/commons/0/07/Sambor_Prei_Kuk_%2810%29.jpg',
      'Sambor Prei Kuk forest temple in Cambodia'
    ),
    galleryImages: [
      keyword('Sambor Prei Kuk Cambodia temple', 'Sambor Prei Kuk temple in Kampong Thom, Cambodia'),
      keyword('Kampong Thom ancient temple Cambodia', 'Ancient temple in Kampong Thom, Cambodia'),
      keyword('pre Angkorian temple Cambodia forest', 'Pre-Angkorian forest temple in Cambodia'),
      keyword('Kampong Thom local food Cambodia', 'Local food in Kampong Thom, Cambodia'),
      keyword('private SUV Sambor Prei Kuk Cambodia', 'Private SUV tour to Sambor Prei Kuk in Cambodia'),
    ],
  },
  pursat: {
    cardImage: image(
      'https://upload.wikimedia.org/wikipedia/commons/5/52/Tonle_Sap_floating_village_houses.jpg',
      'Tonle Sap floating village houses in Pursat, Cambodia'
    ),
    heroImage: image(
      'https://upload.wikimedia.org/wikipedia/commons/5/52/Tonle_Sap_floating_village_houses.jpg',
      'Tonle Sap floating village houses in Pursat, Cambodia'
    ),
    galleryImages: [
      keyword('Cardamom Mountains Cambodia', 'Cardamom Mountains in Cambodia'),
      keyword('Pursat Cambodia mountains', 'Pursat mountains in Cambodia'),
      keyword('Phnom Samkos wildlife sanctuary Cambodia', 'Phnom Samkos Wildlife Sanctuary in Cambodia'),
      keyword('Pursat floating village Tonle Sap Cambodia', 'Floating village near Pursat, Cambodia'),
      keyword('Pursat Cambodia marble carving', 'Marble carving in Pursat, Cambodia'),
    ],
  },
  'kampong-cham': {
    cardImage: image(
      'https://upload.wikimedia.org/wikipedia/commons/0/09/Kompong_Cham%2C_Bamboo_Bridge%2C_Cambodia.jpg',
      'Kampong Cham bamboo bridge in Cambodia'
    ),
    heroImage: image(
      'https://upload.wikimedia.org/wikipedia/commons/0/09/Kompong_Cham%2C_Bamboo_Bridge%2C_Cambodia.jpg',
      'Kampong Cham bamboo bridge in Cambodia'
    ),
    galleryImages: [
      keyword('Kampong Cham bamboo bridge Cambodia', 'Kampong Cham bamboo bridge in Cambodia'),
      keyword('Koh Paen bamboo bridge Cambodia', 'Koh Paen bamboo bridge in Cambodia'),
      keyword('Mekong River Kampong Cham Cambodia', 'Mekong River in Kampong Cham, Cambodia'),
      keyword('Kampong Cham local market Cambodia', 'Local market in Kampong Cham, Cambodia'),
      keyword('private SUV Mekong Cambodia countryside', 'Private SUV tour through Mekong countryside in Cambodia'),
    ],
  },
  kandal: {
    cardImage: image(
      'https://upload.wikimedia.org/wikipedia/commons/1/12/Oudong_01.jpg',
      'Oudong Mountain stupas in Kandal, Cambodia'
    ),
    heroImage: image(
      'https://upload.wikimedia.org/wikipedia/commons/1/12/Oudong_01.jpg',
      'Oudong Mountain in Kandal, Cambodia'
    ),
    galleryImages: [
      image(
        'https://upload.wikimedia.org/wikipedia/commons/1/12/Oudong_01.jpg',
        'Oudong Mountain stupas in Kandal, Cambodia'
      ),
      keyword('Oudong stupas Cambodia', 'Oudong stupas in Cambodia'),
      keyword('Kandal Cambodia pagoda hill', 'Pagoda hill in Kandal, Cambodia'),
      keyword('Cambodia countryside near Oudong', 'Countryside near Oudong, Cambodia'),
      keyword('private SUV Oudong Cambodia', 'Private SUV tour to Oudong, Cambodia'),
    ],
  },
  takeo: {
    cardImage: image(
      'https://upload.wikimedia.org/wikipedia/commons/6/67/Wat_asram_moha_russei.jpg',
      'Ancient temple near Phnom Da in Takeo, Cambodia'
    ),
    heroImage: image(
      'https://upload.wikimedia.org/wikipedia/commons/6/67/Wat_asram_moha_russei.jpg',
      'Phnom Da temple area in Takeo, Cambodia'
    ),
    galleryImages: [
      image(
        'https://upload.wikimedia.org/wikipedia/commons/6/67/Wat_asram_moha_russei.jpg',
        'Ancient temple near Phnom Da in Takeo, Cambodia'
      ),
      keyword('Phnom Da Temple Takeo Cambodia', 'Phnom Da Temple in Takeo, Cambodia'),
      keyword('Takeo Angkor Borei Cambodia', 'Angkor Borei in Takeo, Cambodia'),
      keyword('Tonle Bati Takeo Cambodia', 'Tonle Bati in Takeo, Cambodia'),
      keyword('Takeo Cambodia local food', 'Local food in Takeo, Cambodia'),
    ],
  },
  'kampong-speu': {
    cardImage: image(
      'https://upload.wikimedia.org/wikipedia/commons/0/05/Kirirom_National_Park.jpg',
      'Kirirom National Park in Kampong Speu, Cambodia'
    ),
    heroImage: image(
      'https://upload.wikimedia.org/wikipedia/commons/0/05/Kirirom_National_Park.jpg',
      'Pine forest at Kirirom National Park in Cambodia'
    ),
    galleryImages: [
      image(
        'https://upload.wikimedia.org/wikipedia/commons/0/05/Kirirom_National_Park.jpg',
        'Kirirom National Park in Kampong Speu, Cambodia'
      ),
      keyword('Kampong Speu pine forest Cambodia', 'Pine forest in Kampong Speu, Cambodia'),
      keyword('Kirirom mountain lake Cambodia', 'Kirirom mountain lake in Cambodia'),
      keyword('Kirirom waterfall Cambodia', 'Waterfall in Kirirom National Park, Cambodia'),
      keyword('private SUV Kirirom Cambodia', 'Private SUV tour to Kirirom National Park in Cambodia'),
    ],
  },
  'banteay-meanchey': {
    cardImage: image(
      'https://upload.wikimedia.org/wikipedia/commons/8/88/Banteay_Chhmar_Temple_Entrance.JPG',
      'Banteay Chhmar Temple in Banteay Meanchey, Cambodia'
    ),
    heroImage: image(
      'https://upload.wikimedia.org/wikipedia/commons/8/88/Banteay_Chhmar_Temple_Entrance.JPG',
      'Ancient Khmer ruins at Banteay Chhmar Temple in Cambodia'
    ),
    galleryImages: [
      image(
        'https://upload.wikimedia.org/wikipedia/commons/8/88/Banteay_Chhmar_Temple_Entrance.JPG',
        'Banteay Chhmar Temple in Banteay Meanchey, Cambodia'
      ),
      keyword('Banteay Meanchey ancient temple Cambodia', 'Ancient temple in Banteay Meanchey, Cambodia'),
      keyword('Khmer ruins Banteay Chhmar Cambodia', 'Khmer ruins at Banteay Chhmar in Cambodia'),
      keyword('Banteay Chhmar village Cambodia', 'Village near Banteay Chhmar Temple in Cambodia'),
      keyword('private SUV Banteay Chhmar Cambodia', 'Private SUV tour to Banteay Chhmar in Cambodia'),
    ],
  },
  'oddar-meanchey': {
    cardImage: image('https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200&auto=format&fit=crop', 'Oddar Meanchey mountain road in Cambodia'),
    heroImage: image('https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200&auto=format&fit=crop', 'Oddar Meanchey mountain road in Cambodia'),
    galleryImages: [
      keyword('Anlong Veng Cambodia historical site', 'Anlong Veng historical site in Cambodia'),
      keyword('Dangrek Mountains Cambodia', 'Dangrek Mountains in Cambodia'),
      keyword('Oddar Meanchey historical site Cambodia', 'Historical site in Oddar Meanchey, Cambodia'),
      keyword('Anlong Veng mountain viewpoint Cambodia', 'Mountain viewpoint in Anlong Veng, Cambodia'),
      keyword('private SUV northern Cambodia mountain road', 'Private SUV on a northern Cambodia mountain road'),
    ],
  },
  pailin: {
    cardImage: image('https://upload.wikimedia.org/wikipedia/commons/2/2a/Wat_Phnom_Yat%2C_Pailin.jpg', 'Phnom Yat in Pailin, Cambodia'),
    heroImage: image('https://upload.wikimedia.org/wikipedia/commons/2/2a/Wat_Phnom_Yat%2C_Pailin.jpg', 'Wat Phnom Yat in Pailin, Cambodia'),
    galleryImages: [
      keyword('Phnom Yat Pailin Cambodia', 'Phnom Yat in Pailin, Cambodia'),
      keyword('Pailin mountain temple Cambodia', 'Pailin mountain temple in Cambodia'),
      keyword('Pailin countryside Cambodia', 'Pailin countryside in Cambodia'),
      keyword('Pailin Cambodia orchard', 'Orchard countryside in Pailin, Cambodia'),
      keyword('private SUV Pailin Cambodia', 'Private SUV tour in Pailin, Cambodia'),
    ],
  },
  'stung-treng': {
    cardImage: image('https://upload.wikimedia.org/wikipedia/commons/e/e5/Mekong_flooded_forest_Stung_Treng.jpg', 'Mekong River in Stung Treng, Cambodia'),
    heroImage: image('https://upload.wikimedia.org/wikipedia/commons/e/e5/Mekong_flooded_forest_Stung_Treng.jpg', 'Ramsar wetlands in Stung Treng, Cambodia'),
    galleryImages: [
      keyword('Stung Treng Mekong River Cambodia', 'Mekong River in Stung Treng, Cambodia'),
      keyword('Ramsar wetlands Cambodia', 'Ramsar wetlands in Cambodia'),
      keyword('Mekong flooded forest Stung Treng Cambodia', 'Mekong flooded forest in Stung Treng, Cambodia'),
      keyword('Stung Treng river island Cambodia', 'River island in Stung Treng, Cambodia'),
      keyword('private boat Stung Treng Mekong Cambodia', 'Private boat on the Mekong in Stung Treng, Cambodia'),
    ],
  },
  'svay-rieng': {
    cardImage: image('https://images.unsplash.com/photo-1562979314-bee7453e911c?q=80&w=1200&auto=format&fit=crop', 'Svay Rieng countryside in Cambodia'),
    heroImage: image('https://images.unsplash.com/photo-1562979314-bee7453e911c?q=80&w=1200&auto=format&fit=crop', 'Rice fields in Svay Rieng, Cambodia'),
    galleryImages: [
      keyword('Svay Rieng Cambodia countryside', 'Svay Rieng countryside in Cambodia'),
      keyword('Bavet Cambodia', 'Bavet border area in Svay Rieng, Cambodia'),
      keyword('Cambodia rice fields countryside', 'Rice fields in the Cambodian countryside'),
      keyword('Svay Rieng Cambodia pagoda', 'Pagoda in Svay Rieng, Cambodia'),
      keyword('private sedan Cambodia countryside road', 'Private sedan on a Cambodia countryside road'),
    ],
  },
  'prey-veng': {
    cardImage: image('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop', 'Ba Phnom in Prey Veng, Cambodia'),
    heroImage: image('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop', 'Ancient hill temple in Prey Veng, Cambodia'),
    galleryImages: [
      keyword('Ba Phnom Prey Veng Cambodia', 'Ba Phnom in Prey Veng, Cambodia'),
      keyword('Prey Veng Cambodia countryside', 'Prey Veng countryside in Cambodia'),
      keyword('ancient hill temple Prey Veng Cambodia', 'Ancient hill temple in Prey Veng, Cambodia'),
      keyword('Prey Veng local market Cambodia', 'Local market in Prey Veng, Cambodia'),
      keyword('private SUV Prey Veng Cambodia countryside', 'Private SUV in Prey Veng countryside, Cambodia'),
    ],
  },
  'tbong-khmum': {
    cardImage: image('https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1200&auto=format&fit=crop', 'Rubber plantation in Tbong Khmum, Cambodia'),
    heroImage: image('https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1200&auto=format&fit=crop', 'Rubber plantation countryside in Tbong Khmum, Cambodia'),
    galleryImages: [
      keyword('Tbong Khmum rubber plantation Cambodia', 'Rubber plantation in Tbong Khmum, Cambodia'),
      keyword('Cambodia rubber plantation', 'Rubber plantation in Cambodia'),
      keyword('Tbong Khmum countryside Cambodia', 'Tbong Khmum countryside in Cambodia'),
      keyword('Mekong temple Tbong Khmum Cambodia', 'Mekong temple in Tbong Khmum, Cambodia'),
      keyword('private SUV rubber plantation Cambodia', 'Private SUV near a Cambodian rubber plantation'),
    ],
  },
};

const defaultIncluded = [
  'Private SUV',
  'Professional driver',
  'Fuel',
  'Toll fees',
  'Cold drinking water',
  'Hotel pickup',
  'English speaking guide',
  'Parking',
];

const defaultExcluded = [
  'Meals',
  'Entrance tickets',
  'Personal expenses',
  'Tips',
  'Travel insurance',
  'Souvenirs',
];

export const TOUR_CATEGORIES = [
  'All',
  'Historical',
  'Nature',
  'Adventure',
  'Wildlife',
  'Beaches',
  'Waterfalls',
  'Mountains',
  'Cultural',
  'Family Friendly',
  'Luxury',
  'Eco Tourism',
];

const rawDestinations = [
  {
    province: 'Phnom Penh',
    destination: 'Royal Palace & Riverside',
    title: 'Royal Palace & Riverside Private City Tour',
    category: 'Cultural',
    categories: ['Historical', 'Cultural', 'Luxury', 'Family Friendly'],
    shortDescription: 'A refined capital city journey through royal architecture, riverfront life, temples, and Khmer art.',
    description:
      'Discover Phnom Penh with a private driver and carefully paced city routing. This experience blends the Royal Palace, Silver Pagoda, National Museum, Wat Phnom, and the Mekong riverside into a polished introduction to Cambodia capital.',
    price: 95,
    durationDays: 1,
    maxPersons: 4,
    popularity: 95,
    rating: 4.9,
    reviewCount: 184,
    coordinates: { lat: 11.5564, lng: 104.9282 },
    pickupArea: 'Central Phnom Penh hotels, riverside, BKK1, and Tonle Bassac',
    vehicle: 'Executive Sedan or Luxury SUV',
    imageQuery: 'Royal Palace Phnom Penh Cambodia',
    highlights: ['Royal architecture', 'Mekong riverside', 'Khmer art', 'Photography spots'],
    stops: [
      ['08:00 AM', 'Hotel Pickup', 'Meet your private driver and begin the city loop from your hotel.', '30 min'],
      ['08:30 AM', 'Royal Palace', 'Walk the palace grounds and admire the Silver Pagoda complex.', '2 hr'],
      ['11:00 AM', 'National Museum', 'Explore Khmer sculpture and heritage collections.', '1 hr'],
      ['01:30 PM', 'Wat Phnom', 'Visit the hilltop temple that anchors the city origin story.', '45 min'],
      ['03:00 PM', 'Riverside Drive', 'Cruise Sisowath Quay and stop for riverfront photos.', '1 hr'],
      ['05:00 PM', 'Return to Hotel', 'Relax on the return transfer or request an evening drop-off.', '30 min'],
    ],
    nearbyProvinces: ['Kandal', 'Kampong Speu', 'Takeo'],
    nearbyAttractions: ['National Museum', 'Wat Phnom', 'Independence Monument', 'Mekong Riverside'],
  },
  {
    province: 'Banteay Meanchey',
    destination: 'Banteay Chhmar Temple',
    title: 'Banteay Chhmar Remote Temple Expedition',
    category: 'Historical',
    categories: ['Historical', 'Adventure', 'Cultural', 'Eco Tourism'],
    shortDescription: 'A private expedition to one of Cambodia most atmospheric Angkorian temple complexes.',
    description:
      'Travel beyond the usual temple circuit to Banteay Chhmar, where quiet ruins, sandstone galleries, and village life create a rare heritage experience with a strong sense of discovery.',
    price: 190,
    durationDays: 2,
    maxPersons: 4,
    popularity: 79,
    rating: 4.8,
    reviewCount: 68,
    coordinates: { lat: 14.071, lng: 103.101 },
    pickupArea: 'Siem Reap or Sisophon hotels',
    vehicle: 'Luxury SUV',
    imageQuery: 'Banteay Chhmar temple Cambodia',
    highlights: ['Angkorian ruins', 'Remote heritage', 'Village encounters', 'Photography spots'],
    stops: [
      ['07:30 AM', 'Hotel Pickup', 'Depart by private SUV toward northwest Cambodia.', '30 min'],
      ['10:00 AM', 'Sisophon Break', 'Short coffee stop before the rural temple road.', '30 min'],
      ['11:30 AM', 'Banteay Chhmar Temple', 'Explore galleries, towers, and quiet courtyards.', '3 hr'],
      ['03:00 PM', 'Community Lunch', 'Enjoy a village-hosted Khmer meal near the temple.', '1 hr'],
      ['04:30 PM', 'Satellite Temples', 'Visit smaller ruins around the main complex.', '1 hr'],
      ['08:00 AM', 'Countryside Morning', 'Optional sunrise walk before returning to Siem Reap.', '2 hr'],
    ],
    nearbyProvinces: ['Siem Reap', 'Oddar Meanchey', 'Battambang'],
    nearbyAttractions: ['Banteay Torp', 'Sisophon Market', 'Ang Trapeang Thmor'],
  },
  {
    province: 'Battambang',
    destination: 'Bamboo Train',
    title: 'Battambang Bamboo Train & Colonial Quarter',
    category: 'Cultural',
    categories: ['Cultural', 'Family Friendly', 'Historical', 'Adventure'],
    shortDescription: 'A relaxed private tour of colonial streets, countryside lanes, caves, and the famous bamboo train.',
    description:
      'Battambang rewards slow travel. Ride the bamboo train, visit village workshops, explore French-era architecture, and finish with countryside views shaped by rice fields and limestone hills.',
    price: 120,
    durationDays: 1,
    maxPersons: 5,
    popularity: 88,
    rating: 4.8,
    reviewCount: 132,
    coordinates: { lat: 13.0957, lng: 103.2022 },
    pickupArea: 'Battambang city hotels and bus station arrivals',
    vehicle: 'Premium SUV',
    imageQuery: 'Battambang bamboo train Cambodia',
    highlights: ['Bamboo train', 'Colonial streets', 'Local workshops', 'Countryside views'],
    stops: [
      ['08:00 AM', 'Hotel Pickup', 'Meet your driver and start with the old town quarter.', '20 min'],
      ['08:30 AM', 'Colonial Quarter', 'See French-era streets, shop houses, and riverside views.', '1 hr'],
      ['10:00 AM', 'Bamboo Train', 'Ride the classic countryside rail experience.', '1 hr'],
      ['12:00 PM', 'Local Workshop Route', 'Visit rice paper, banana chip, and village craft stops.', '2 hr'],
      ['03:30 PM', 'Phnom Sampov', 'Explore the hill area and scenic viewpoints.', '1.5 hr'],
      ['06:00 PM', 'Return to Hotel', 'Return after sunset or request dinner drop-off.', '30 min'],
    ],
    nearbyProvinces: ['Pailin', 'Pursat', 'Banteay Meanchey'],
    nearbyAttractions: ['Phnom Sampov', 'Wat Ek Phnom', 'Sangker River'],
  },
  {
    province: 'Kampong Cham',
    destination: 'Bamboo Bridge',
    title: 'Kampong Cham Bamboo Bridge & Mekong Escape',
    category: 'Cultural',
    categories: ['Cultural', 'Nature', 'Family Friendly', 'Historical'],
    shortDescription: 'A Mekong province escape with the Koh Paen bamboo bridge, river scenery, and quiet island life.',
    description:
      'Cross into Kampong Cham daily life through the famous bamboo bridge route, Koh Paen island villages, Mekong river views, and relaxed countryside stops. The route is gentle, scenic, and ideal for travelers who prefer authentic local rhythm.',
    price: 115,
    durationDays: 1,
    maxPersons: 4,
    popularity: 75,
    rating: 4.7,
    reviewCount: 54,
    coordinates: { lat: 12.0, lng: 105.46 },
    pickupArea: 'Phnom Penh or Kampong Cham hotels',
    vehicle: 'Executive SUV',
    imageQuery: 'Kampong Cham bamboo bridge Cambodia',
    highlights: ['Bamboo bridge', 'Mekong views', 'Island village', 'Local culture'],
    stops: [
      ['07:30 AM', 'Hotel Pickup', 'Depart toward the Mekong corridor.', '30 min'],
      ['09:30 AM', 'Bamboo Bridge', 'Visit the seasonal bamboo bridge route toward Koh Paen.', '1 hr'],
      ['11:00 AM', 'Mekong River View', 'Pause for photos above the river landscape.', '30 min'],
      ['01:00 PM', 'Koh Paen Island', 'Explore quiet lanes, orchards, and island communities.', '2 hr'],
      ['04:00 PM', 'Riverside Cafe Stop', 'Unwind by the river before the return drive.', '45 min'],
      ['06:00 PM', 'Return Transfer', 'Arrive back at your hotel.', '30 min'],
    ],
    nearbyProvinces: ['Tbong Khmum', 'Prey Veng', 'Kandal'],
    nearbyAttractions: ['Koh Paen Bamboo Bridge', 'Mekong River', 'Kampong Cham riverside'],
  },
  {
    province: 'Kampong Chhnang',
    destination: 'Floating Village & Pottery',
    title: 'Kampong Chhnang Floating Life & Pottery Trail',
    category: 'Cultural',
    categories: ['Cultural', 'Nature', 'Family Friendly', 'Eco Tourism'],
    shortDescription: 'A graceful lakeside journey into pottery villages, floating homes, and Tonle Sap culture.',
    description:
      'Kampong Chhnang is known for ceramics and water communities. This private day trip pairs village pottery demonstrations with a boat experience through floating neighborhoods and lake-edge scenery.',
    price: 125,
    durationDays: 1,
    maxPersons: 4,
    popularity: 72,
    rating: 4.7,
    reviewCount: 49,
    coordinates: { lat: 12.25, lng: 104.6667 },
    pickupArea: 'Phnom Penh, Oudong, or Kampong Chhnang hotels',
    vehicle: 'Premium SUV',
    imageQuery: 'Kampong Chhnang pottery floating village Cambodia',
    highlights: ['Pottery village', 'Floating homes', 'Tonle Sap culture', 'Family friendly'],
    stops: [
      ['08:00 AM', 'Hotel Pickup', 'Depart with a private driver toward the lakeside province.', '30 min'],
      ['10:00 AM', 'Pottery Village', 'Watch traditional ceramic shaping and kiln work.', '1.5 hr'],
      ['12:00 PM', 'Local Lunch Stop', 'Pause at a simple Khmer restaurant.', '1 hr'],
      ['01:30 PM', 'Floating Village Boat', 'Cruise through water communities near the Tonle Sap.', '1.5 hr'],
      ['03:30 PM', 'Countryside Viewpoint', 'Stop for photography over fields and palms.', '45 min'],
      ['05:30 PM', 'Return Transfer', 'Return to your hotel in comfort.', '30 min'],
    ],
    nearbyProvinces: ['Pursat', 'Kampong Speu', 'Kampong Thom'],
    nearbyAttractions: ['Phnom Neang Kang Rey', 'Tonle Sap floating village', 'Pottery villages'],
  },
  {
    province: 'Kampong Speu',
    destination: 'Kirirom National Park',
    title: 'Kirirom Pine Forest Mountain Retreat',
    category: 'Mountains',
    categories: ['Mountains', 'Nature', 'Adventure', 'Family Friendly'],
    shortDescription: 'A cool mountain escape with pine forests, waterfalls, picnic viewpoints, and gentle hiking.',
    description:
      'Kirirom offers a refreshing contrast to the lowlands. Travel by private SUV to pine forests, forest trails, small waterfalls, and quiet viewpoints suited to couples, families, and nature-focused travelers.',
    price: 135,
    durationDays: 1,
    maxPersons: 4,
    popularity: 81,
    rating: 4.8,
    reviewCount: 73,
    coordinates: { lat: 11.315, lng: 104.065 },
    pickupArea: 'Phnom Penh, Kampong Speu, or airport pickup',
    vehicle: 'High-clearance SUV',
    imageQuery: 'Kirirom National Park Cambodia pine forest',
    highlights: ['Pine forest', 'Mountain air', 'Waterfall stop', 'Scenic views'],
    stops: [
      ['07:30 AM', 'Hotel Pickup', 'Leave Phnom Penh for the mountain road.', '30 min'],
      ['09:30 AM', 'Kirirom Park Gate', 'Enter the national park and begin the forest route.', '30 min'],
      ['10:00 AM', 'Pine Forest Walk', 'Enjoy a gentle walk under cool pine canopy.', '1.5 hr'],
      ['12:30 PM', 'Picnic Viewpoint', 'Stop for lunch with open mountain scenery.', '1 hr'],
      ['02:00 PM', 'Waterfall Trail', 'Visit a seasonal waterfall and nearby forest path.', '1.5 hr'],
      ['05:30 PM', 'Return to Hotel', 'Comfortable transfer back to Phnom Penh.', '30 min'],
    ],
    nearbyProvinces: ['Phnom Penh', 'Kampot', 'Koh Kong'],
    nearbyAttractions: ['Kirirom Waterfall', 'Pine Forest', 'Mountain viewpoints'],
  },
  {
    province: 'Kampong Thom',
    destination: 'Sambor Prei Kuk',
    title: 'Sambor Prei Kuk UNESCO Heritage Journey',
    category: 'Historical',
    categories: ['Historical', 'Cultural', 'Nature', 'Family Friendly'],
    shortDescription: 'A forest temple journey through pre-Angkorian sanctuaries and quiet archaeological paths.',
    description:
      'Sambor Prei Kuk reveals Cambodia before Angkor. Explore brick sanctuaries surrounded by forest, learn about Chenla-era architecture, and enjoy a quiet heritage route between Phnom Penh and Siem Reap.',
    price: 150,
    durationDays: 1,
    maxPersons: 4,
    popularity: 83,
    rating: 4.8,
    reviewCount: 86,
    coordinates: { lat: 12.872, lng: 105.04 },
    pickupArea: 'Kampong Thom, Siem Reap, or Phnom Penh hotels',
    vehicle: 'Luxury SUV',
    imageQuery: 'Sambor Prei Kuk Cambodia temple forest',
    highlights: ['UNESCO Site', 'Forest temples', 'Pre-Angkor history', 'Photography spots'],
    stops: [
      ['08:00 AM', 'Hotel Pickup', 'Start the heritage route with flexible pickup options.', '30 min'],
      ['09:30 AM', 'Sambor Prei Kuk Entry', 'Meet the local guide and begin the forest circuit.', '30 min'],
      ['10:00 AM', 'North Group Temples', 'Explore brick towers and atmospheric paths.', '1.5 hr'],
      ['12:30 PM', 'Local Lunch', 'Pause for regional Khmer dishes nearby.', '1 hr'],
      ['02:00 PM', 'Central Sanctuary', 'See the main temple group and carved details.', '1.5 hr'],
      ['04:30 PM', 'Return Transfer', 'Continue to your next city or return to hotel.', '30 min'],
    ],
    nearbyProvinces: ['Siem Reap', 'Preah Vihear', 'Kampong Cham'],
    nearbyAttractions: ['Sambor Prei Kuk', 'Stung Sen River', 'Phnom Santuk'],
  },
  {
    province: 'Kampot',
    destination: 'Bokor Mountain',
    title: 'Bokor Mountain & Kampot Pepper Coast',
    category: 'Mountains',
    categories: ['Mountains', 'Nature', 'Adventure', 'Luxury', 'Cultural'],
    shortDescription: 'A premium mountain and coast itinerary with Bokor viewpoints, salt fields, and pepper farms.',
    description:
      'Explore Kampot at a relaxed luxury pace. The journey includes traditional salt fields, a guided Kampot pepper experience, the scenic road to Bokor Mountain, and atmospheric hill station landmarks.',
    price: 160,
    durationDays: 1,
    maxPersons: 4,
    popularity: 91,
    rating: 4.9,
    reviewCount: 164,
    coordinates: { lat: 10.634, lng: 104.026 },
    pickupArea: 'Kampot, Kep, or Phnom Penh hotels',
    vehicle: 'Luxury SUV',
    imageQuery: 'Bokor Mountain Kampot Cambodia',
    highlights: ['Scenic Views', 'Pepper plantation', 'Salt fields', 'Mountain drive'],
    stops: [
      ['08:00 AM', 'Hotel Pickup', 'Meet your private driver in Kampot or Kep.', '30 min'],
      ['09:00 AM', 'Salt Fields', 'Learn traditional salt production during the season.', '45 min'],
      ['11:00 AM', 'Pepper Plantation', 'Enjoy a guided farm experience and tasting.', '1.5 hr'],
      ['02:00 PM', 'Bokor Mountain', 'Explore the historic hill station and scenic viewpoints.', '2 hr'],
      ['04:30 PM', 'Old Catholic Church', 'Stop for photography and mountain atmosphere.', '45 min'],
      ['06:00 PM', 'Return to Hotel', 'Descend the mountain and return to your hotel.', '30 min'],
    ],
    nearbyProvinces: ['Kep', 'Preah Sihanouk', 'Koh Kong'],
    nearbyAttractions: ['Bokor Hill Station', 'Kampot Pepper Farm', 'Salt Fields', 'Kampot River'],
  },
  {
    province: 'Kandal',
    destination: 'Oudong Mountain',
    title: 'Oudong Mountain Stupas & Kandal Countryside',
    category: 'Cultural',
    categories: ['Cultural', 'Historical', 'Family Friendly', 'Luxury'],
    shortDescription: 'A refined countryside journey to Oudong Mountain, royal stupas, pagoda hills, and rural Kandal scenery.',
    description:
      'Just outside Phnom Penh, Oudong Mountain offers royal history, hilltop stupas, broad countryside views, and a calm temple atmosphere. This private route is ideal for a soft cultural escape close to the capital.',
    price: 85,
    durationDays: 1,
    maxPersons: 4,
    popularity: 77,
    rating: 4.7,
    reviewCount: 58,
    coordinates: { lat: 11.65, lng: 104.96 },
    pickupArea: 'Phnom Penh hotels and riverside addresses',
    vehicle: 'Executive Sedan',
    imageQuery: 'Oudong Mountain Cambodia',
    highlights: ['Royal stupas', 'Pagoda hill', 'Countryside views', 'Family friendly'],
    stops: [
      ['08:30 AM', 'Hotel Pickup', 'Begin with a private transfer from Phnom Penh toward Oudong.', '20 min'],
      ['09:45 AM', 'Oudong Mountain', 'Walk the hilltop route and visit royal stupas.', '1.5 hr'],
      ['11:30 AM', 'Pagoda Viewpoint', 'Pause for photos over the Kandal countryside.', '45 min'],
      ['12:30 PM', 'Local Lunch', 'Optional Khmer lunch in a quiet countryside setting.', '1 hr'],
      ['02:00 PM', 'Countryside Drive', 'Explore rural lanes, temples, and village scenery.', '1.5 hr'],
      ['03:30 PM', 'Return Transfer', 'Return to Phnom Penh or riverside drop-off.', '30 min'],
    ],
    nearbyProvinces: ['Phnom Penh', 'Kampong Cham', 'Prey Veng'],
    nearbyAttractions: ['Oudong stupas', 'Kandal pagoda hills', 'Phnom Penh countryside'],
  },
  {
    province: 'Kep',
    destination: 'Kep Beach & Crab Market',
    title: 'Kep Beach, Crab Market & Coastal Leisure',
    category: 'Beaches',
    categories: ['Beaches', 'Cultural', 'Family Friendly', 'Luxury'],
    shortDescription: 'A polished coastal day with seafood culture, sea views, national park trails, and beach time.',
    description:
      'Kep combines relaxed coastal charm with Cambodia best-known seafood market. Visit the Crab Market, enjoy Kep Beach, take a gentle national park walk, and travel in private comfort.',
    price: 130,
    durationDays: 1,
    maxPersons: 4,
    popularity: 86,
    rating: 4.8,
    reviewCount: 117,
    coordinates: { lat: 10.483, lng: 104.316 },
    pickupArea: 'Kep, Kampot, or Phnom Penh hotels',
    vehicle: 'Comfort Sedan or SUV',
    imageQuery: 'Kep Beach Crab Market Cambodia',
    highlights: ['Fresh seafood', 'Beach views', 'National park', 'Family friendly'],
    stops: [
      ['08:30 AM', 'Hotel Pickup', 'Begin with a relaxed coastal transfer.', '30 min'],
      ['10:00 AM', 'Kep Crab Market', 'Watch fresh catches and explore seafood stalls.', '1 hr'],
      ['12:00 PM', 'Seaside Lunch', 'Enjoy fresh crab and coastal Khmer flavors.', '1.5 hr'],
      ['02:00 PM', 'Kep Beach', 'Relax by the beach with time for photos.', '1 hr'],
      ['03:30 PM', 'National Park Walk', 'Take a short scenic walk with sea views.', '1 hr'],
      ['05:00 PM', 'Return Transfer', 'Return to hotel or dinner drop-off.', '30 min'],
    ],
    nearbyProvinces: ['Kampot', 'Preah Sihanouk', 'Takeo'],
    nearbyAttractions: ['Crab Market', 'Kep Beach', 'Kep National Park', 'Rabbit Island pier'],
  },
  {
    province: 'Koh Kong',
    destination: 'Tatai Waterfall',
    title: 'Tatai Waterfall & Cardamom Eco Retreat',
    category: 'Waterfalls',
    categories: ['Waterfalls', 'Nature', 'Adventure', 'Eco Tourism', 'Luxury'],
    shortDescription: 'A lush Cardamom Mountains journey with river scenery, waterfalls, and soft adventure.',
    description:
      'Koh Kong is Cambodia wild coastal frontier. Travel by private SUV to Tatai, cruise the river, cool off near waterfalls, and experience the Cardamom landscape with a premium eco-tour rhythm.',
    price: 210,
    durationDays: 2,
    maxPersons: 4,
    popularity: 84,
    rating: 4.9,
    reviewCount: 96,
    coordinates: { lat: 11.567, lng: 103.12 },
    pickupArea: 'Koh Kong, Sihanoukville, or Phnom Penh by request',
    vehicle: 'High-clearance Luxury SUV',
    imageQuery: 'Tatai Waterfall Koh Kong Cambodia',
    highlights: ['Waterfall swim', 'Cardamom rainforest', 'River cruise', 'Eco tourism'],
    stops: [
      ['07:00 AM', 'Hotel Pickup', 'Depart early for the Cardamom route.', '30 min'],
      ['11:00 AM', 'Koh Kong Arrival', 'Pause for lunch and river orientation.', '1 hr'],
      ['01:30 PM', 'Tatai River Cruise', 'Travel by boat through jungle-lined waterways.', '1.5 hr'],
      ['03:00 PM', 'Tatai Waterfall', 'Swim, photograph, and relax near the falls.', '2 hr'],
      ['08:30 AM', 'Eco Lodge Morning', 'Enjoy a quiet river morning and optional kayak.', '2 hr'],
      ['01:00 PM', 'Return Transfer', 'Private drive back to your selected drop-off.', '4 hr'],
    ],
    nearbyProvinces: ['Preah Sihanouk', 'Kampot', 'Kampong Speu'],
    nearbyAttractions: ['Tatai Waterfall', 'Cardamom Mountains', 'Mangrove forest', 'Koh Kong Bridge'],
  },
  {
    province: 'Kratie',
    destination: 'Irrawaddy Dolphins',
    title: 'Kratie Irrawaddy Dolphin & Mekong Island Tour',
    category: 'Wildlife',
    categories: ['Wildlife', 'Eco Tourism', 'Nature', 'Family Friendly'],
    shortDescription: 'A respectful Mekong wildlife journey to see rare Irrawaddy dolphins and island villages.',
    description:
      'Kratie is one of the best places to experience the Mekong quietly. Visit the dolphin pool by boat, explore Koh Trong island, and enjoy sunset along one of Cambodia most peaceful riverfronts.',
    price: 175,
    durationDays: 2,
    maxPersons: 4,
    popularity: 87,
    rating: 4.8,
    reviewCount: 104,
    coordinates: { lat: 12.488, lng: 106.019 },
    pickupArea: 'Kratie hotels or Phnom Penh transfer add-on',
    vehicle: 'Premium SUV',
    imageQuery: 'Irrawaddy dolphins Kratie Cambodia Mekong',
    highlights: ['Rare wildlife', 'Mekong scenery', 'Island cycling', 'Eco tourism'],
    stops: [
      ['08:00 AM', 'Hotel Pickup', 'Begin the Mekong wildlife route from Kratie.', '20 min'],
      ['09:00 AM', 'Kampi Dolphin Pool', 'Board a local boat for dolphin watching.', '1.5 hr'],
      ['11:30 AM', 'Mekong View Lunch', 'Pause at a riverside restaurant.', '1 hr'],
      ['02:00 PM', 'Koh Trong Island', 'Explore island lanes and orchards.', '2 hr'],
      ['05:30 PM', 'Kratie Sunset', 'Watch the riverfront soften at golden hour.', '45 min'],
      ['09:00 AM', 'Morning Market', 'Optional local market visit before departure.', '1 hr'],
    ],
    nearbyProvinces: ['Stung Treng', 'Kampong Cham', 'Mondulkiri'],
    nearbyAttractions: ['Kampi Dolphin Pool', 'Koh Trong', 'Mekong riverfront'],
  },
  {
    province: 'Mondulkiri',
    destination: 'Elephant Valley',
    title: 'Mondulkiri Elephant Valley Nature Escape',
    category: 'Wildlife',
    categories: ['Wildlife', 'Nature', 'Eco Tourism', 'Adventure'],
    shortDescription: 'A highland wildlife experience with elephant conservation, forest scenery, and waterfalls.',
    description:
      'Mondulkiri feels expansive and cool. Visit an elephant conservation area, admire rolling highland views, and continue to waterfalls and indigenous Bunong cultural context with thoughtful pacing.',
    price: 240,
    durationDays: 2,
    maxPersons: 4,
    popularity: 90,
    rating: 4.9,
    reviewCount: 142,
    coordinates: { lat: 12.455, lng: 107.188 },
    pickupArea: 'Sen Monorom hotels or Phnom Penh transfer add-on',
    vehicle: 'High-clearance Luxury SUV',
    imageQuery: 'Mondulkiri elephant sanctuary Cambodia',
    highlights: ['Elephant conservation', 'Highland views', 'Waterfalls', 'Bunong culture'],
    stops: [
      ['08:00 AM', 'Hotel Pickup', 'Start from Sen Monorom with a private driver.', '20 min'],
      ['09:00 AM', 'Elephant Valley', 'Observe elephants in a conservation-focused setting.', '3 hr'],
      ['01:00 PM', 'Highland Lunch', 'Pause with views over Mondulkiri hills.', '1 hr'],
      ['02:30 PM', 'Bou Sra Waterfall', 'Visit the province most famous waterfall.', '2 hr'],
      ['08:30 AM', 'Bunong Village Context', 'Learn about highland traditions with a local stop.', '1.5 hr'],
      ['11:00 AM', 'Return Transfer', 'Depart for your next destination or hotel.', '30 min'],
    ],
    nearbyProvinces: ['Kratie', 'Ratanakiri', 'Tbong Khmum'],
    nearbyAttractions: ['Elephant Valley', 'Bou Sra Waterfall', 'Sea Forest viewpoint'],
  },
  {
    province: 'Oddar Meanchey',
    destination: 'Anlong Veng Heritage Route',
    title: 'Anlong Veng Mountain Heritage Route',
    category: 'Historical',
    categories: ['Historical', 'Mountains', 'Cultural', 'Adventure'],
    shortDescription: 'A sensitive northern heritage route through mountain viewpoints and modern history sites.',
    description:
      'This route explores Cambodia northern edge with careful historical framing. Visit Anlong Veng, mountain viewpoints, and local heritage sites while traveling privately through a less-visited province.',
    price: 185,
    durationDays: 1,
    maxPersons: 4,
    popularity: 66,
    rating: 4.6,
    reviewCount: 31,
    coordinates: { lat: 14.233, lng: 104.08 },
    pickupArea: 'Siem Reap hotels or Anlong Veng guesthouses',
    vehicle: 'Premium SUV',
    imageQuery: 'Anlong Veng Cambodia mountain',
    highlights: ['Modern history', 'Mountain viewpoints', 'Northern route', 'Local culture'],
    stops: [
      ['07:30 AM', 'Hotel Pickup', 'Depart from Siem Reap for the northern road.', '30 min'],
      ['10:30 AM', 'Anlong Veng Town', 'Begin the heritage route with local context.', '45 min'],
      ['11:30 AM', 'Mountain Viewpoint', 'Drive to the escarpment for broad landscape views.', '1 hr'],
      ['01:00 PM', 'Local Lunch', 'Pause at a simple regional restaurant.', '1 hr'],
      ['02:30 PM', 'Heritage Stops', 'Visit selected historical points with sensitive pacing.', '1.5 hr'],
      ['06:00 PM', 'Return Transfer', 'Arrive back in Siem Reap.', '30 min'],
    ],
    nearbyProvinces: ['Preah Vihear', 'Banteay Meanchey', 'Siem Reap'],
    nearbyAttractions: ['Dangrek Mountains', 'Anlong Veng viewpoint', 'Ta Mok house area'],
  },
  {
    province: 'Pailin',
    destination: 'Phnom Yat Gem Heritage',
    title: 'Pailin Gem Heritage & Phnom Yat Hill',
    category: 'Mountains',
    categories: ['Mountains', 'Cultural', 'Nature', 'Family Friendly'],
    shortDescription: 'A quiet western journey through gem heritage, hilltop pagodas, waterfalls, and orchard scenery.',
    description:
      'Pailin offers a compact but characterful escape near the Thai border. Explore Phnom Yat, learn about the province gem history, and enjoy gentle mountain and orchard landscapes.',
    price: 145,
    durationDays: 1,
    maxPersons: 4,
    popularity: 63,
    rating: 4.6,
    reviewCount: 28,
    coordinates: { lat: 12.848, lng: 102.609 },
    pickupArea: 'Battambang hotels or Pailin town',
    vehicle: 'Premium SUV',
    imageQuery: 'Pailin Cambodia Phnom Yat',
    highlights: ['Hilltop pagoda', 'Gem heritage', 'Waterfall stop', 'Quiet scenery'],
    stops: [
      ['08:00 AM', 'Hotel Pickup', 'Depart from Battambang or Pailin town.', '30 min'],
      ['09:30 AM', 'Phnom Yat', 'Visit the hilltop pagoda and viewpoint.', '1 hr'],
      ['11:00 AM', 'Gem Heritage Stop', 'Learn about the province gem trading history.', '45 min'],
      ['12:30 PM', 'Local Lunch', 'Pause at a regional restaurant.', '1 hr'],
      ['02:00 PM', 'Countryside Waterfall', 'Visit a seasonal nature stop outside town.', '1.5 hr'],
      ['05:00 PM', 'Return Transfer', 'Return to hotel or continue to Battambang.', '30 min'],
    ],
    nearbyProvinces: ['Battambang', 'Pursat', 'Banteay Meanchey'],
    nearbyAttractions: ['Phnom Yat', 'Pailin market', 'Orchard countryside'],
  },
  {
    province: 'Preah Vihear',
    destination: 'Preah Vihear Temple',
    title: 'Preah Vihear Temple Clifftop UNESCO Expedition',
    category: 'Historical',
    categories: ['Historical', 'Mountains', 'Adventure', 'Cultural'],
    shortDescription: 'A dramatic clifftop temple journey to one of Cambodia most powerful UNESCO landscapes.',
    description:
      'Preah Vihear Temple sits high on the Dangrek escarpment with extraordinary views. This private expedition combines long-distance comfort, heritage interpretation, and careful timing for photography.',
    price: 230,
    durationDays: 2,
    maxPersons: 4,
    popularity: 85,
    rating: 4.9,
    reviewCount: 91,
    coordinates: { lat: 14.39, lng: 104.68 },
    pickupArea: 'Siem Reap, Preah Vihear town, or Kampong Thom',
    vehicle: 'High-clearance Luxury SUV',
    imageQuery: 'Preah Vihear Temple Cambodia cliff',
    highlights: ['UNESCO Site', 'Clifftop views', 'Ancient Khmer temple', 'Photography spots'],
    stops: [
      ['07:00 AM', 'Hotel Pickup', 'Depart early for the northern temple route.', '30 min'],
      ['10:30 AM', 'Temple Base', 'Transfer to the access route and prepare for the ascent.', '45 min'],
      ['11:30 AM', 'Preah Vihear Temple', 'Explore the processional axis, sanctuaries, and carvings.', '3 hr'],
      ['03:00 PM', 'Clifftop Viewpoint', 'Photograph the sweeping plains below.', '45 min'],
      ['08:30 AM', 'Optional Koh Ker Add-on', 'Add a nearby temple route if timing allows.', '2 hr'],
      ['01:00 PM', 'Return Transfer', 'Private transfer to Siem Reap or next hotel.', '4 hr'],
    ],
    nearbyProvinces: ['Kampong Thom', 'Siem Reap', 'Oddar Meanchey'],
    nearbyAttractions: ['Preah Vihear Temple', 'Dangrek Mountains', 'Koh Ker route'],
  },
  {
    province: 'Prey Veng',
    destination: 'Ba Phnom',
    title: 'Prey Veng Ba Phnom Cultural Countryside',
    category: 'Cultural',
    categories: ['Cultural', 'Family Friendly', 'Nature', 'Historical'],
    shortDescription: 'A soft countryside day with sacred hills, pagodas, rice fields, and village life.',
    description:
      'Prey Veng is ideal for travelers who want calm rural Cambodia near Phnom Penh. Visit Ba Phnom, local pagodas, market life, and open rice-field roads with a private driver.',
    price: 105,
    durationDays: 1,
    maxPersons: 4,
    popularity: 61,
    rating: 4.6,
    reviewCount: 25,
    coordinates: { lat: 11.486, lng: 105.326 },
    pickupArea: 'Phnom Penh, Neak Loeung, or Prey Veng town',
    vehicle: 'Executive Sedan',
    imageQuery: 'Prey Veng Cambodia countryside',
    highlights: ['Countryside roads', 'Sacred hill', 'Pagodas', 'Local markets'],
    stops: [
      ['08:00 AM', 'Hotel Pickup', 'Depart from Phnom Penh toward eastern Cambodia.', '30 min'],
      ['09:30 AM', 'Neak Loeung Crossing Area', 'Pause near the Mekong corridor.', '30 min'],
      ['10:30 AM', 'Ba Phnom', 'Visit the sacred hill and surrounding pagodas.', '1.5 hr'],
      ['12:30 PM', 'Local Lunch', 'Enjoy a relaxed countryside meal.', '1 hr'],
      ['02:00 PM', 'Village Market Stop', 'Explore daily life and seasonal produce.', '1 hr'],
      ['05:00 PM', 'Return Transfer', 'Return to Phnom Penh or regional hotel.', '30 min'],
    ],
    nearbyProvinces: ['Kandal', 'Svay Rieng', 'Kampong Cham'],
    nearbyAttractions: ['Ba Phnom', 'Neak Loeung', 'Prey Veng market'],
  },
  {
    province: 'Pursat',
    destination: 'Cardamom Gateway',
    title: 'Pursat Cardamom Gateway & Floating Life',
    category: 'Nature',
    categories: ['Nature', 'Eco Tourism', 'Adventure', 'Cultural'],
    shortDescription: 'A nature-forward route linking Tonle Sap floating life, marble craft, and Cardamom foothills.',
    description:
      'Pursat sits between lake culture and mountain wilderness. This private experience blends floating communities, local craft, and the first touch of the Cardamom landscape.',
    price: 155,
    durationDays: 1,
    maxPersons: 4,
    popularity: 68,
    rating: 4.7,
    reviewCount: 39,
    coordinates: { lat: 12.538, lng: 103.916 },
    pickupArea: 'Pursat, Battambang, or Phnom Penh by request',
    vehicle: 'Premium SUV',
    imageQuery: 'Pursat Cambodia Cardamom Mountains floating village',
    highlights: ['Floating life', 'Cardamom foothills', 'Local craft', 'Eco route'],
    stops: [
      ['08:00 AM', 'Hotel Pickup', 'Start from Pursat or connect from Battambang.', '30 min'],
      ['09:00 AM', 'Marble Craft Stop', 'See local stone carving and workshop traditions.', '45 min'],
      ['10:30 AM', 'Tonle Sap Edge', 'Travel toward floating communities and lake scenery.', '1.5 hr'],
      ['01:00 PM', 'Local Lunch', 'Pause for a simple countryside meal.', '1 hr'],
      ['02:30 PM', 'Cardamom Foothills', 'Drive toward forested landscapes and viewpoints.', '1.5 hr'],
      ['05:30 PM', 'Return Transfer', 'Return to hotel or continue onward.', '30 min'],
    ],
    nearbyProvinces: ['Battambang', 'Kampong Chhnang', 'Koh Kong'],
    nearbyAttractions: ['Tonle Sap communities', 'Pursat marble workshops', 'Cardamom foothills'],
  },
  {
    province: 'Ratanakiri',
    destination: 'Yeak Laom Lake',
    title: 'Ratanakiri Yeak Laom Lake & Red Earth Highlands',
    category: 'Nature',
    categories: ['Nature', 'Adventure', 'Eco Tourism', 'Waterfalls'],
    shortDescription: 'A highland escape with volcanic lake swimming, red earth roads, waterfalls, and forest culture.',
    description:
      'Ratanakiri is vivid and remote. Visit Yeak Laom crater lake, follow red earth roads to waterfalls, and experience a greener, wilder corner of Cambodia with private overland comfort.',
    price: 260,
    durationDays: 3,
    maxPersons: 4,
    popularity: 82,
    rating: 4.8,
    reviewCount: 88,
    coordinates: { lat: 13.739, lng: 107.014 },
    pickupArea: 'Banlung hotels or regional airport transfer',
    vehicle: 'High-clearance Luxury SUV',
    imageQuery: 'Yeak Laom Lake Ratanakiri Cambodia',
    highlights: ['Volcanic lake', 'Waterfalls', 'Highland scenery', 'Eco tourism'],
    stops: [
      ['08:30 AM', 'Hotel Pickup', 'Begin from Banlung with a private highland route.', '20 min'],
      ['09:00 AM', 'Yeak Laom Lake', 'Walk the crater lake path and swim if desired.', '2 hr'],
      ['12:00 PM', 'Local Lunch', 'Pause in Banlung for regional food.', '1 hr'],
      ['02:00 PM', 'Waterfall Circuit', 'Visit selected waterfalls around the red earth roads.', '2 hr'],
      ['09:00 AM', 'Highland Village Context', 'Learn about local culture with a respectful stop.', '2 hr'],
      ['08:00 AM', 'Scenic Departure', 'Transfer to your next regional destination.', '3 hr'],
    ],
    nearbyProvinces: ['Mondulkiri', 'Stung Treng', 'Kratie'],
    nearbyAttractions: ['Yeak Laom Lake', 'Ka Tieng Waterfall', 'Banlung market'],
  },
  {
    province: 'Siem Reap',
    destination: 'Angkor Wat',
    title: 'Angkor Wat Sunrise Luxury Temple Journey',
    category: 'Historical',
    categories: ['Historical', 'Cultural', 'Luxury', 'Family Friendly'],
    shortDescription: 'A signature Angkor experience with sunrise, ancient temples, shaded transfers, and expert pacing.',
    description:
      'Experience Cambodia most iconic destination with premium private transport and a carefully sequenced temple route. Sunrise at Angkor Wat, Angkor Thom, Ta Prohm, and Banteay Srei are arranged for comfort and atmosphere.',
    price: 220,
    durationDays: 2,
    maxPersons: 4,
    popularity: 100,
    rating: 5.0,
    reviewCount: 312,
    coordinates: { lat: 13.4125, lng: 103.867 },
    pickupArea: 'Siem Reap hotels, airport, and private villas',
    vehicle: 'Luxury SUV',
    imageQuery: 'Angkor Wat sunrise Cambodia',
    localImage: '/images/tour_package.jpg',
    highlights: ['UNESCO Site', 'Sunrise photography', 'Ancient temples', 'Luxury pacing'],
    stops: [
      ['05:00 AM', 'Hotel Pickup', 'Early private pickup for sunrise at Angkor Wat.', '20 min'],
      ['05:30 AM', 'Angkor Wat Sunrise', 'Watch dawn rise behind the temple towers.', '1.5 hr'],
      ['08:30 AM', 'Angkor Thom', 'Explore Bayon, gates, and royal city landmarks.', '2 hr'],
      ['11:30 AM', 'Ta Prohm', 'Visit the atmospheric jungle temple.', '1 hr'],
      ['02:30 PM', 'Banteay Srei', 'See the pink sandstone carvings north of town.', '1.5 hr'],
      ['04:30 PM', 'Tonle Sap Option', 'Add a floating village or return for leisure.', '1.5 hr'],
    ],
    nearbyProvinces: ['Kampong Thom', 'Preah Vihear', 'Banteay Meanchey'],
    nearbyAttractions: ['Angkor Wat', 'Bayon Temple', 'Ta Prohm', 'Banteay Srei'],
  },
  {
    province: 'Preah Sihanouk',
    destination: 'Koh Rong Island',
    title: 'Koh Rong Island Beach Transfer & Leisure',
    category: 'Beaches',
    categories: ['Beaches', 'Luxury', 'Family Friendly', 'Adventure'],
    shortDescription: 'A seamless coastal transfer and island beach escape to turquoise water and white sand.',
    description:
      'Travel comfortably to Sihanoukville pier and continue toward Koh Rong island life. This package focuses on easy logistics, beach time, optional snorkeling, and premium door-to-pier coordination.',
    price: 195,
    durationDays: 2,
    maxPersons: 4,
    popularity: 89,
    rating: 4.8,
    reviewCount: 156,
    coordinates: { lat: 10.665, lng: 103.272 },
    pickupArea: 'Phnom Penh, Kampot, Sihanoukville, or airport pickup',
    vehicle: 'Luxury SUV plus ferry coordination',
    imageQuery: 'Koh Rong Island Cambodia beach',
    highlights: ['White sand beach', 'Island ferry', 'Snorkeling option', 'Luxury transfer'],
    stops: [
      ['07:30 AM', 'Hotel Pickup', 'Private transfer to Sihanoukville pier.', '30 min'],
      ['11:30 AM', 'Pier Coordination', 'Driver assists with ferry timing and luggage.', '45 min'],
      ['01:00 PM', 'Koh Rong Arrival', 'Check in and settle into island leisure.', '2 hr'],
      ['03:30 PM', 'Beach Time', 'Enjoy swimming, photos, or optional snorkeling.', '2 hr'],
      ['09:00 AM', 'Island Morning', 'Relax by the sea before ferry departure.', '2 hr'],
      ['01:00 PM', 'Return Transfer', 'Private pickup from pier to your next hotel.', '3 hr'],
    ],
    nearbyProvinces: ['Kampot', 'Kep', 'Koh Kong'],
    nearbyAttractions: ['Koh Rong', 'Otres Beach', 'Ream National Park', 'Sihanoukville pier'],
  },
  {
    province: 'Stung Treng',
    destination: 'Mekong Ramsar Wetlands',
    title: 'Stung Treng Ramsar Wetlands & River Islands',
    category: 'Eco Tourism',
    categories: ['Eco Tourism', 'Wildlife', 'Nature', 'Adventure'],
    shortDescription: 'A quiet river expedition through protected wetlands, islands, birdlife, and Mekong scenery.',
    description:
      'Stung Treng is a serene northern Mekong base. Explore Ramsar wetlands, kayak-friendly channels, sandbars, and river islands with an itinerary designed for nature lovers.',
    price: 215,
    durationDays: 2,
    maxPersons: 4,
    popularity: 71,
    rating: 4.7,
    reviewCount: 47,
    coordinates: { lat: 13.525, lng: 105.969 },
    pickupArea: 'Stung Treng town, Kratie, or Laos border transfer',
    vehicle: 'Premium SUV plus boat coordination',
    imageQuery: 'Stung Treng Mekong Ramsar Cambodia wetlands',
    highlights: ['Ramsar wetlands', 'Birdlife', 'River islands', 'Eco tourism'],
    stops: [
      ['08:00 AM', 'Hotel Pickup', 'Meet your driver and river guide in Stung Treng.', '20 min'],
      ['09:00 AM', 'Wetland Boat Route', 'Cruise protected Mekong channels and sandbars.', '2 hr'],
      ['12:00 PM', 'River Lunch', 'Pause near the river for a simple local meal.', '1 hr'],
      ['02:00 PM', 'Island Village Stop', 'Visit a quiet Mekong island community.', '1.5 hr'],
      ['08:30 AM', 'Optional Kayak Segment', 'Add a gentle paddle if water levels suit.', '2 hr'],
      ['12:30 PM', 'Return Transfer', 'Depart toward Kratie, Ratanakiri, or hotel.', '30 min'],
    ],
    nearbyProvinces: ['Kratie', 'Ratanakiri', 'Preah Vihear'],
    nearbyAttractions: ['Mekong Ramsar wetlands', 'Koh Han', 'Sekong River confluence'],
  },
  {
    province: 'Svay Rieng',
    destination: 'Bavet Border Heritage & Pagodas',
    title: 'Svay Rieng Border Heritage & Pagoda Route',
    category: 'Cultural',
    categories: ['Cultural', 'Family Friendly', 'Historical'],
    shortDescription: 'An eastern province route through pagodas, market culture, and Cambodia-Vietnam border life.',
    description:
      'Svay Rieng offers a distinctive borderland perspective. This private route visits local pagodas, markets, and Bavet area culture with comfortable overland service from Phnom Penh.',
    price: 125,
    durationDays: 1,
    maxPersons: 4,
    popularity: 58,
    rating: 4.5,
    reviewCount: 22,
    coordinates: { lat: 11.087, lng: 105.799 },
    pickupArea: 'Phnom Penh, Prey Veng, Svay Rieng, or Bavet',
    vehicle: 'Executive Sedan',
    imageQuery: 'Svay Rieng Cambodia pagoda countryside',
    highlights: ['Border culture', 'Pagodas', 'Local markets', 'Countryside'],
    stops: [
      ['07:30 AM', 'Hotel Pickup', 'Depart from Phnom Penh or regional pickup point.', '30 min'],
      ['10:00 AM', 'Svay Rieng Town', 'Explore town landmarks and local market culture.', '1 hr'],
      ['11:30 AM', 'Pagoda Stop', 'Visit a peaceful regional pagoda.', '45 min'],
      ['01:00 PM', 'Local Lunch', 'Try simple eastern Cambodian dishes.', '1 hr'],
      ['02:30 PM', 'Bavet Area Drive', 'See the borderland corridor and daily commerce.', '1 hr'],
      ['05:30 PM', 'Return Transfer', 'Return to Phnom Penh or continue to Bavet.', '30 min'],
    ],
    nearbyProvinces: ['Prey Veng', 'Kandal', 'Tbong Khmum'],
    nearbyAttractions: ['Svay Rieng market', 'Bavet border area', 'Regional pagodas'],
  },
  {
    province: 'Takeo',
    destination: 'Phnom Da & Tonle Bati',
    title: 'Takeo Phnom Da, Tonle Bati & Ancient Canal Route',
    category: 'Historical',
    categories: ['Historical', 'Cultural', 'Family Friendly', 'Nature'],
    shortDescription: 'A southern heritage day through pre-Angkor history, lakeside temples, and countryside canals.',
    description:
      'Takeo is one of Cambodia oldest cultural landscapes. Visit Tonle Bati, Phnom Da, Angkor Borei context, and rural waterways on a polished private day from Phnom Penh.',
    price: 140,
    durationDays: 1,
    maxPersons: 4,
    popularity: 76,
    rating: 4.7,
    reviewCount: 64,
    coordinates: { lat: 10.994, lng: 104.78 },
    pickupArea: 'Phnom Penh, Takeo, or Kampot transfer add-on',
    vehicle: 'Premium SUV',
    imageQuery: 'Takeo Phnom Da Cambodia temple',
    highlights: ['Ancient history', 'Lakeside temple', 'Countryside route', 'Photography spots'],
    stops: [
      ['08:00 AM', 'Hotel Pickup', 'Depart Phnom Penh for the southern heritage route.', '30 min'],
      ['09:00 AM', 'Tonle Bati', 'Visit lakeside Ta Prohm and Yeay Peau temples.', '1 hr'],
      ['11:00 AM', 'Takeo Town', 'Pause for market and coffee stop.', '45 min'],
      ['12:30 PM', 'Local Lunch', 'Enjoy a regional meal before the ancient canal area.', '1 hr'],
      ['02:00 PM', 'Phnom Da', 'Explore the hill temple and ancient landscape.', '1.5 hr'],
      ['05:30 PM', 'Return Transfer', 'Return to Phnom Penh or continue south.', '30 min'],
    ],
    nearbyProvinces: ['Kampot', 'Kep', 'Kandal'],
    nearbyAttractions: ['Phnom Da', 'Tonle Bati', 'Angkor Borei Museum'],
  },
  {
    province: 'Tbong Khmum',
    destination: 'Rubber Plantation & Mekong Temples',
    title: 'Tbong Khmum Rubber Plantation & Mekong Temple Route',
    category: 'Cultural',
    categories: ['Cultural', 'Nature', 'Eco Tourism', 'Family Friendly'],
    shortDescription: 'A graceful eastern route through rubber landscapes, Mekong communities, and local temples.',
    description:
      'Tbong Khmum is calm and green, with rubber plantations and river communities shaping the landscape. This private route is ideal for travelers seeking a quiet, authentic province experience.',
    price: 130,
    durationDays: 1,
    maxPersons: 4,
    popularity: 60,
    rating: 4.6,
    reviewCount: 27,
    coordinates: { lat: 11.889, lng: 105.876 },
    pickupArea: 'Kampong Cham, Phnom Penh, or Tbong Khmum hotels',
    vehicle: 'Premium SUV',
    imageQuery: 'Tbong Khmum Cambodia rubber plantation Mekong',
    highlights: ['Rubber plantations', 'Mekong temples', 'Countryside', 'Eco route'],
    stops: [
      ['08:00 AM', 'Hotel Pickup', 'Begin from Kampong Cham or Phnom Penh.', '30 min'],
      ['10:00 AM', 'Rubber Plantation', 'Learn about plantation landscapes and local production.', '1 hr'],
      ['11:30 AM', 'Mekong Temple Stop', 'Visit a peaceful temple near river communities.', '1 hr'],
      ['01:00 PM', 'Local Lunch', 'Pause for regional Khmer food.', '1 hr'],
      ['02:30 PM', 'Countryside Drive', 'Enjoy open rural roads and photo stops.', '1.5 hr'],
      ['05:00 PM', 'Return Transfer', 'Return to hotel or continue onward.', '30 min'],
    ],
    nearbyProvinces: ['Kampong Cham', 'Kratie', 'Prey Veng'],
    nearbyAttractions: ['Rubber plantations', 'Mekong villages', 'Regional pagodas'],
  },
];

const makeItinerary = (destination, imageSet) => {
  const gallery = imageSet.galleryImages || [];
  return destination.stops.map(([time, location, description, duration], index) => {
    const locationKey = slugify(location);
    
    // 1. Check if we have an explicit itinerary image
    let imageObject = imageSet.itineraryImages?.[locationKey];
    
    // 2. If not, see if we can find a matching image in the gallery by searching the alt text or prompt for location keywords
    if (!imageObject && gallery.length > 0) {
      const locationWords = location.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      const matchedImage = gallery.find(img => {
        const altLower = (img.alt || '').toLowerCase();
        return locationWords.some(word => altLower.includes(word));
      });
      if (matchedImage) {
        imageObject = matchedImage;
      }
    }
    
    // 3. If still not found, fall back to index-based gallery image (if available) or the destination card image
    if (!imageObject) {
      if (gallery.length > 0) {
        imageObject = gallery[index % gallery.length];
      } else {
        imageObject = imageSet.cardImage || imageSet.heroImage;
      }
    }
    
    // 4. If still not found, generate the keyword image as final fallback
    if (!imageObject) {
      imageObject = keyword(
        `${destination.province} ${location} ${destination.destination} Cambodia`,
        `${location} during the ${destination.destination} tour in ${destination.province}, Cambodia`
      );
    }

    return {
      time,
      location,
      title: location,
      description,
      desc: description,
      duration,
      image: imageObject,
    };
  });
};

const makeGallery = (destination, imageSet) => {
  if (imageSet.galleryImages?.length) {
    return imageSet.galleryImages;
  }

  const base = destination.imageQuery;
  const queries = [
    base,
    `${destination.destination} Cambodia attraction`,
    `${destination.province} Cambodia local food`,
    `${destination.province} Cambodia scenic view`,
    `${destination.destination} Cambodia culture`,
    'Cambodia private luxury SUV travel',
  ];

  return queries.map((query) =>
    keyword(query, `${query} for ${destination.destination} in ${destination.province}, Cambodia`)
  );
};

const makeReviews = (destination, index) => {
  const reviewers = [
    ['Amelia Hart', 'United Kingdom'],
    ['Kenji Sato', 'Japan'],
    ['Sophie Laurent', 'France'],
    ['Daniel Weber', 'Germany'],
    ['Maya Chen', 'Singapore'],
    ['Lucas Miller', 'United States'],
  ];

  return reviewers.slice(0, 3).map(([name, country], reviewIndex) => ({
    name,
    country,
    date: `2026-0${(reviewIndex % 6) + 1}-${String(((12 + reviewIndex + index) % 26) + 1).padStart(2, '0')}`,
    rating: reviewIndex === 1 && destination.rating < 4.8 ? 4 : 5,
    verified: true,
    avatar: `https://i.pravatar.cc/120?img=${((index + reviewIndex) % 60) + 1}`,
    photo: keywordImage(`${destination.destination} Cambodia traveler photo ${reviewIndex}`),
    comment:
      reviewIndex === 0
        ? `Beautifully paced and very comfortable. ${destination.destination} felt memorable without ever feeling rushed.`
        : reviewIndex === 1
          ? 'The driver was punctual, calm, and thoughtful with every stop. The routing made the day feel effortless.'
          : 'Excellent private tour quality with refined service, clean vehicle, and strong local recommendations.',
  }));
};

export const cambodiaDestinations = rawDestinations.map((destination, index) => {
  const provinceSlug = slugify(destination.province);
  const destinationSlug = slugify(destination.destination);
  const imageSet = DESTINATION_IMAGE_SETS[provinceSlug] || {};
  const cardImage =
    imageSet.cardImage ||
    keyword(destination.imageQuery, `${destination.destination} in ${destination.province}, Cambodia`);
  const heroImage = imageSet.heroImage || cardImage;

  return {
    ...destination,
    id: `${provinceSlug}-${destinationSlug}`,
    provinceSlug,
    destinationSlug,
    image: cardImage.src,
    cardImage,
    heroImage,
    bannerImage: heroImage.src,
    galleryImages: makeGallery(destination, imageSet),
    itinerary: makeItinerary(destination, imageSet),
    includedItems: destination.includedItems || defaultIncluded,
    excludedItems: destination.excludedItems || defaultExcluded,
    reviews: {
      rating: destination.rating,
      count: destination.reviewCount,
      breakdown: [
        { label: 'Excellent', value: 82 },
        { label: 'Very Good', value: 14 },
        { label: 'Good', value: 4 },
        { label: 'Fair', value: 0 },
        { label: 'Poor', value: 0 },
      ],
      list: makeReviews(destination, index),
    },
    suggestedDuration: `${destination.durationDays} ${destination.durationDays === 1 ? 'day' : 'days'}`,
    routePath: `/tours/${provinceSlug}/${destinationSlug}`,
  };
});

export const findDestinationByParams = ({ id, provinceSlug, destinationSlug }) => {
  if (provinceSlug && destinationSlug) {
    return cambodiaDestinations.find(
      (tour) => tour.provinceSlug === provinceSlug && tour.destinationSlug === destinationSlug
    );
  }

  if (id) {
    return cambodiaDestinations.find(
      (tour) => tour.id === id || tour.destinationSlug === id || tour.provinceSlug === id
    );
  }

  return null;
};

export const getSimilarDestinations = (current, limit = 6) => {
  if (!current) return [];

  return cambodiaDestinations
    .filter((tour) => tour.id !== current.id)
    .map((tour) => {
      const sameProvince = tour.province === current.province ? 4 : 0;
      const nearby = current.nearbyProvinces.includes(tour.province) ? 3 : 0;
      const categoryOverlap = tour.categories.filter((category) => current.categories.includes(category)).length;
      return { tour, score: sameProvince + nearby + categoryOverlap };
    })
    .sort((a, b) => b.score - a.score || b.tour.popularity - a.tour.popularity)
    .slice(0, limit)
    .map(({ tour }) => tour);
};

export const getNearbyDestinations = (current, limit = 4) => {
  if (!current) return [];

  const nearby = current.nearbyProvinces
    .map((province) => cambodiaDestinations.find((tour) => tour.province === province))
    .filter(Boolean);

  return nearby.length > 0 ? nearby.slice(0, limit) : getSimilarDestinations(current, limit);
};
