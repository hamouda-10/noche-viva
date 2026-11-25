export type RegionKey = 'all' | 'europe' | 'middle-east' | 'americas' | 'caribbean' | 'asia';

export interface Villa {
  id: string;
  code: string;
  region: Exclude<RegionKey, 'all'>;
  nameAr: string;
  nameEn: string;
  locationAr: string;
  locationEn: string;
  countryAr: string;
  countryEn: string;
  coordinates: string;
  priceUsd: number;
  statusAr: string;
  statusEn: string;
  styleAr: string;
  styleEn: string;
  bedrooms: number;
  bathrooms: number;
  livingAreaSqm: number;
  plotAreaSqm: number;
  yearBuilt: number;
  ownershipAr: string;
  ownershipEn: string;
  annualTaxUsd: number;
  image: string;
  taglineAr: string;
  taglineEn: string;
  descriptionAr: string;
  descriptionEn: string;
  signatureAssetAr: string;
  signatureAssetEn: string;
  amenitiesAr: string[];
  amenitiesEn: string[];
  specifications: {
    labelAr: string;
    labelEn: string;
    valueAr: string;
    valueEn: string;
  }[];
}

export const VILLAS: Villa[] = [
  {
    id: 'pearl-crown-dubai',
    code: 'NV-DXB-01',
    region: 'middle-east',
    nameAr: 'قصر تاج اللؤلؤة',
    nameEn: 'The Pearl Crown Estate',
    locationAr: 'سعفة فروند جي، نخلة جميرا، دبي',
    locationEn: 'Frond G, Palm Jumeirah, Dubai',
    countryAr: 'الإمارات العربية المتحدة',
    countryEn: 'United Arab Emirates',
    coordinates: '25.1184° N, 55.1347° E',
    priceUsd: 52000000,
    statusAr: 'متاح للبيع المباشر',
    statusEn: 'Available Now',
    styleAr: 'عمارة ساحلية معاصرة',
    styleEn: 'Contemporary Waterfront',
    bedrooms: 7,
    bathrooms: 9,
    livingAreaSqm: 2400,
    plotAreaSqm: 3650,
    yearBuilt: 2025,
    ownershipAr: 'تملك حر كامل (Freehold)',
    ownershipEn: '100% Freehold Title',
    annualTaxUsd: 0,
    image: '/src/assets/images/villa_dubai_palm_estate_1795616673181.jpg',
    taglineAr: 'واجهة شاطئية خاصة بطول 120 متراً وإطلالة بانورامية على أفق دبي مارينا',
    taglineEn: '120 meters of private white sand beach facing the illuminated Dubai Marina skyline',
    descriptionAr:
      'تحفة معمارية نادرة على أرقى سعفة في نخلة جميرا، شُيّدت من الحجر الجيري الإيطالي والبرونز المصقول. تضم جلسة غائرة مضيئة وسط مسبح زجاجي لا متناهٍ، رصيف يخت خاص حتى 45 متراً، قاعة سينما دولبي أتموس بـ 18 مقعداً، ومركز سبا متكامل بإطلالة مباشرة على الخليج العربي.',
    descriptionEn:
      'An architectural landmark on Palm Jumeirah’s billionaire row, crafted from cantilevered Italian limestone and brushed bronze. Features a sunken fire-pit lounge suspended inside a glass-edged infinity pool, a 45-meter private yacht berth, an 18-seat Dolby Atmos cinema, and a full beachfront wellness spa.',
    signatureAssetAr: 'رصيف يخت 45م + شاطئ خاص 120م',
    signatureAssetEn: '45m Yacht Berth + 120m Private Beach',
    amenitiesAr: [
      'شاطئ رملي خاص بطول 120 متراً',
      'مرسى خاص لليخوت حتى 45 متراً',
      'مسبح لا متناهٍ بحواف زجاجية وجلسة نار غائرة',
      'قاعة سينما خاصة 18 مقعداً بنظام Dolby Atmos',
      'معرض سيارات تحت الأرض يتسع لـ 12 سيارة فائقة',
      'مصعد بانورامي زجاجي ونظام أتمتة ذكي بالكامل',
      'مطبخ عرض إيطالي من الرخام ومطبخ خدمة للطهاة',
      'جناح سبا، ساونا، حمام مغربي وصالة لياقة بحرية',
    ],
    amenitiesEn: [
      '120-meter private white-sand beach frontage',
      'Private deep-water yacht berth up to 45 meters',
      'Glass-edged infinity pool with sunken fire lounge',
      '18-seat private Dolby Atmos screening room',
      'Climate-controlled 12-supercar subterranean gallery',
      'Panoramic glass elevator & full KNX automation',
      'Bespoke Italian marble show kitchen & chef kitchen',
      'Oceanfront spa suite, hammam, sauna & private gym',
    ],
    specifications: [
      { labelAr: 'المساحة المبنية', labelEn: 'Built-Up Area', valueAr: '2,400 م²', valueEn: '2,400 m²' },
      { labelAr: 'مساحة الأرض', labelEn: 'Land Plot', valueAr: '3,650 م²', valueEn: '3,650 m²' },
      { labelAr: 'أجنحة النوم', labelEn: 'Master & Guest Suites', valueAr: '7 أجنحة ملكية', valueEn: '7 Royal Suites' },
      { labelAr: 'الحمامات', labelEn: 'Bathrooms', valueAr: '9 حمامات رخامية', valueEn: '9 Marble Baths' },
      { labelAr: 'مواقف السيارات', labelEn: 'Supercar Gallery', valueAr: '12 سيارة', valueEn: '12 Vehicles' },
      { labelAr: 'سنة البناء', labelEn: 'Completion Year', valueAr: '2025', valueEn: '2025' },
      { labelAr: 'نوع الملكية', labelEn: 'Title & Ownership', valueAr: 'تملك حر 100%', valueEn: '100% Freehold' },
      { labelAr: 'الضرائب العقارية السنوية', labelEn: 'Annual Property Tax', valueAr: '$0 (معفى)', valueEn: '$0 (Tax-Free)' },
    ],
  },
  {
    id: 'palazzo-bellagio-como',
    code: 'NV-ITA-02',
    region: 'europe',
    nameAr: 'بالاتسو بيلاجيو التاريخي',
    nameEn: 'Palazzo Bellagio',
    locationAr: 'بيلاجيو، بحيرة كومو، إيطاليا',
    locationEn: 'Bellagio, Lake Como, Italy',
    countryAr: 'إيطاليا',
    countryEn: 'Italy',
    coordinates: '45.9875° N, 9.2618° E',
    priceUsd: 48000000,
    statusAr: 'حصرية خارج السوق',
    statusEn: 'Off-Market Exclusive',
    styleAr: 'كلاسيكي إيطالي مُرمم',
    styleEn: 'Restored Neoclassical Palazzo',
    bedrooms: 9,
    bathrooms: 11,
    livingAreaSqm: 2100,
    plotAreaSqm: 6500,
    yearBuilt: 1894,
    ownershipAr: 'ملكية خاصة مع رصيف بحري مرخّص',
    ownershipEn: 'Private Freehold & Licensed Dock',
    annualTaxUsd: 68000,
    image: '/src/assets/images/villa_lake_como_palazzo_1795616685852.jpg',
    taglineAr: 'قصر نيوكلاسيكي مباشر على ضفاف بحيرة كومو مع مرسى ريفا وحدائق السرو',
    taglineEn: 'Direct waterfront Italian neoclassical estate with private Riva boat dock & cypress park',
    descriptionAr:
      'قصر إيطالي أسطوري يطل مباشرة على جبال الألب ومياه بحيرة كومو الصافية. خضع لترميم متحفي كامل يجمع بين الأسقف الجصية الأصلية المرسومة يدوياً وتجهيزات القرن الحادي والعشرين. يشمل رصيفاً خشبياً خاصاً لقوارب Riva، قبو نبيذ تاريخياً، وحدائق نباتية مسورة بمساحة 6,500 متر مربع.',
    descriptionEn:
      'A storied lakeside palazzo positioned directly on the mirror-still waters of Lake Como with sweeping Alpine vistas. Meticulously restored to museum standards, uniting hand-painted 19th-century fresco ceilings with discreet modern climate systems, a private wooden Riva boat dock, and 6,500 m² of manicured cypress grounds.',
    signatureAssetAr: 'مرسى قوارب ريفا خاص + 6,500 م² حدائق',
    signatureAssetEn: 'Private Riva Pier + 6,500 m² Park',
    amenitiesAr: [
      'رصيف خاص لقوارب Riva مع بيت قوارب مغلق',
      'حدائق إيطالية مسورة بمساحة 6,500 متر مربع',
      'قاعة استقبال ملكية بأسقف فريسكو أصلية بارتفاع 6 أمتار',
      'جناح سبا حراري داخلي بإطلالة على البحيرة',
      'قبو تذوق حجري يتسع لـ 3,200 زجاجة نادرة',
      'منزل ضيافة منفصل من 3 أجنحة وجناح للطاقم',
      'مهبط هليكوبتر معتمد على بُعد دقيقتين',
      'نظام أمان محيطي غير مرئي ومصعد رخامي',
    ],
    amenitiesEn: [
      'Private wooden Riva pier & enclosed boathouse',
      '6,500 m² walled Italian botanical & cypress gardens',
      'Grand ballroom with original 6m frescoed ceilings',
      'Lakeside indoor thermal spa & vitality pool',
      'Historic stone cellar holding 3,200 vintage bottles',
      'Detached 3-suite guest villa & staff quarters',
      'Licensed helipad access within 2 minutes',
      'Discreet perimeter security & marble elevator',
    ],
    specifications: [
      { labelAr: 'المساحة المبنية', labelEn: 'Built-Up Area', valueAr: '2,100 م²', valueEn: '2,100 m²' },
      { labelAr: 'مساحة الأرض', labelEn: 'Estate Grounds', valueAr: '6,500 م²', valueEn: '6,500 m²' },
      { labelAr: 'غرف النوم', labelEn: 'Bedrooms', valueAr: '9 أجنحة', valueEn: '9 Suites' },
      { labelAr: 'الحمامات', labelEn: 'Bathrooms', valueAr: '11 حماماً', valueEn: '11 Baths' },
      { labelAr: 'واجهة البحيرة', labelEn: 'Lake Frontage', valueAr: '145 متراً', valueEn: '145 Meters' },
      { labelAr: 'التاريخ / الترميم', labelEn: 'Built / Restored', valueAr: '1894 / 2024', valueEn: '1894 / 2024' },
      { labelAr: 'نوع الملكية', labelEn: 'Title & Ownership', valueAr: 'ملكية أوروبية حرة', valueEn: 'EU Freehold' },
      { labelAr: 'الضرائب السنوية المقدرة', labelEn: 'Est. Annual Tax', valueAr: '$68,000', valueEn: '$68,000' },
    ],
  },
  {
    id: 'solis-beverly-hills',
    code: 'NV-LAX-03',
    region: 'americas',
    nameAr: 'فيلا سوليس هيلتوب',
    nameEn: 'Villa Solis Sanctuary',
    locationAr: 'تروسديل إستيتس، بيفرلي هيلز، كاليفورنيا',
    locationEn: 'Trousdale Estates, Beverly Hills, USA',
    countryAr: 'الولايات المتحدة الأمريكية',
    countryEn: 'United States',
    coordinates: '34.0953° N, 118.3958° W',
    priceUsd: 42500000,
    statusAr: 'متاح للبيع المباشر',
    statusEn: 'Available Now',
    styleAr: 'حداثة كاليفورنية فاخرة',
    styleEn: 'Architectural Modernist',
    bedrooms: 8,
    bathrooms: 12,
    livingAreaSqm: 2050,
    plotAreaSqm: 3800,
    yearBuilt: 2026,
    ownershipAr: 'ملكية خاصة حرة (Fee Simple)',
    ownershipEn: 'Fee Simple Ownership',
    annualTaxUsd: 510000,
    image: '/src/assets/images/villa_beverly_hills_sanctuary_1795616685179.jpg',
    taglineAr: 'إطلالة 270 درجة من وسط لوس أنجلوس حتى المحيط الهادئ من قمة بيفرلي هيلز',
    taglineEn: '270-degree jetliner views from Downtown Los Angeles to the Pacific Ocean',
    descriptionAr:
      'تتربع فيلا سوليس على نتوء جبلي خاص في قلب تروسديل إستيتس بأسقف أفقية مهيبة من البازلت الداكن وخشب الأرز الدافئ. صمّمت جدرانها الزجاجية القابلة للسحب بالكامل لدمج الصالات المتحفية مع المسبح اللا متناهي المطل على أضواء لوس أنجلوس المتلألئة.',
    descriptionEn:
      'Commanding a private promontory in Trousdale Estates, Villa Solis pairs sweeping dark basalt cantilevers with warm western red cedar soffits. Motorized glass walls retract completely, uniting gallery-scale living salons with a mirror-like vanishing pool above the glittering Los Angeles basin.',
    signatureAssetAr: 'إطلالة 270° على لوس أنجلوس + خزنة أعمال فنية',
    signatureAssetEn: '270° Skyline Views + Climate Art Vault',
    amenitiesAr: [
      'إطلالة بانورامية 270° من المدينة حتى المحيط الهادئ',
      'مسبح عاكس لا متناهٍ بطول 32 متراً مع جلسة نار غائرة',
      'خزنة فنية محمية بمناخ متحفي لأندر اللوحات',
      'جناح عافية متكامل: علاج بالتبريد، ساونا تحت حمراء وتدليك',
      'معرض سيارات زجاجي يتسع لـ 10 سيارات ومنصة دوارة',
      'بار تذوق خاص وصالة بلياردو وسينما IMAX منزلية',
      'مطبخان مجهزان بأجهزة Gaggenau 400 الاحترافية',
      'بوابة مزدوجة وحراسة إلكترونية بخصوصية تامة',
    ],
    amenitiesEn: [
      'Unobstructed 270° city-to-ocean jetliner views',
      '32-meter vanishing reflection pool & sunken fire lounge',
      'Museum-grade climate-controlled private art vault',
      'Wellness wing with cryotherapy, infrared sauna & cold plunge',
      '10-car glass auto gallery with hydraulic turntable',
      'Private tasting bar, billiards lounge & home IMAX cinema',
      'Dual chef kitchens outfitted with Gaggenau 400 Series',
      'Double-gated promontory with biometric perimeter security',
    ],
    specifications: [
      { labelAr: 'المساحة المبنية', labelEn: 'Living Area', valueAr: '2,050 م²', valueEn: '2,050 m²' },
      { labelAr: 'مساحة الأرض', labelEn: 'Promontory Lot', valueAr: '3,800 م²', valueEn: '3,800 m²' },
      { labelAr: 'أجنحة النوم', labelEn: 'Bedrooms', valueAr: '8 أجنحة', valueEn: '8 Suites' },
      { labelAr: 'الحمامات', labelEn: 'Bathrooms', valueAr: '12 حماماً', valueEn: '12 Baths' },
      { labelAr: 'معرض السيارات', labelEn: 'Auto Gallery', valueAr: '10 سيارات', valueEn: '10 Vehicles' },
      { labelAr: 'سنة البناء', labelEn: 'Year Built', valueAr: '2026', valueEn: '2026' },
      { labelAr: 'نوع الملكية', labelEn: 'Ownership', valueAr: 'ملكية كاملة (Fee Simple)', valueEn: 'Fee Simple' },
      { labelAr: 'الضرائب السنوية المقدرة', labelEn: 'Est. Annual Tax', valueAr: '$510,000', valueEn: '$510,000' },
    ],
  },
  {
    id: 'mirador-marbella-spain',
    code: 'NV-ESP-04',
    region: 'europe',
    nameAr: 'فيلا ميرادور ديل مار',
    nameEn: 'Villa Mirador del Mar',
    locationAr: 'لا زاغاليتا وساحل ماربيا، إسبانيا',
    locationEn: 'Marbella Coast, Costa del Sol, Spain',
    countryAr: 'إسبانيا',
    countryEn: 'Spain',
    coordinates: '36.5099° N, 4.9565° W',
    priceUsd: 34500000,
    statusAr: 'متاح للبيع المباشر',
    statusEn: 'Available Now',
    styleAr: 'متوسطي معاصر من الترافرتين',
    styleEn: 'Mediterranean Travertine Modern',
    bedrooms: 8,
    bathrooms: 10,
    livingAreaSqm: 1850,
    plotAreaSqm: 4200,
    yearBuilt: 2025,
    ownershipAr: 'تملك حر كامل مع إقامة ذهبية أوروبية',
    ownershipEn: 'Full European Freehold Title',
    annualTaxUsd: 42000,
    image: '/src/assets/images/villa_marbella_cliff_1795616670410.jpg',
    taglineAr: 'فيلا معلّقة فوق البحر الأبيض المتوسط من حجر الترافرتين وحدائق الزيتون المعمرة',
    taglineEn: 'Cantilevered travertine sanctuary suspended above the Mediterranean Sea',
    descriptionAr:
      'تحفة متوسطية منحوتة من حجر الترافرتين الدافئ والزجاج المعماري المزدوج فوق جرف بحري خاص في ماربيا. تضم مسبحاً لا متناهياً معلقاً فوق الأمواج، مساراً خاصاً لخليج سباحة منعزل، مهبط طائرات عمودية، وقبو نبيذ أندلسي يتسع لـ 2,400 زجاجة.',
    descriptionEn:
      'Sculpted from honed warm travertine stone and floor-to-ceiling low-iron glass above a private Marbella headland. Includes a dramatic cantilevered sea-view infinity pool, direct cliff pathway to a secluded swimming cove, private helipad, and a 2,400-bottle Andalusian bodega.',
    signatureAssetAr: 'جرف بحري خاص + مهبط هليكوبتر',
    signatureAssetEn: 'Private Sea Cliff + Helipad',
    amenitiesAr: [
      'مسبح لا متناهٍ معلق بإطلالة مباشرة على البحر المتوسط',
      'مسار حجري خاص إلى خليج سباحة بحري منعزل',
      'حدائق أشجار زيتون معمرة وإضاءة معمارية دافئة',
      'مهبط هليكوبتر خاص معتمد للطيران المدني',
      'قبو نبيذ أندلسي مكيّف يتسع لـ 2,400 زجاجة',
      'ملعب بادل خاص ومنتجع صحي متكامل مع مسبح داخلي',
      'جراج سفلي واسع لـ 10 سيارات مع شواحن فائقة',
      'شرفة طعام مفتوحة ومطبخ خارجي بإطلالة غروب الشمس',
    ],
    amenitiesEn: [
      'Cantilevered infinity pool projecting over the Mediterranean',
      'Private stone pathway to secluded sea cove',
      'Sculpted ancient olive grove with architectural lighting',
      'Certified private helipad on estate grounds',
      'Temperature-controlled 2,400-bottle Andalusian wine cellar',
      'Private padel court & indoor heated lap pool spa',
      'Subterranean 10-car garage with high-speed EV bays',
      'Al-fresco sunset dining terrace & summer pavilion',
    ],
    specifications: [
      { labelAr: 'المساحة المبنية', labelEn: 'Built-Up Area', valueAr: '1,850 م²', valueEn: '1,850 m²' },
      { labelAr: 'مساحة الأرض', labelEn: 'Cliffside Plot', valueAr: '4,200 م²', valueEn: '4,200 m²' },
      { labelAr: 'أجنحة النوم', labelEn: 'Bedrooms', valueAr: '8 أجنحة', valueEn: '8 Suites' },
      { labelAr: 'الحمامات', labelEn: 'Bathrooms', valueAr: '10 حمامات', valueEn: '10 Baths' },
      { labelAr: 'مواقف السيارات', labelEn: 'Garage', valueAr: '10 سيارات', valueEn: '10 Vehicles' },
      { labelAr: 'سنة البناء', labelEn: 'Year Built', valueAr: '2025', valueEn: '2025' },
      { labelAr: 'نوع الملكية', labelEn: 'Ownership', valueAr: 'تملك حر أوروبي', valueEn: 'EU Freehold' },
      { labelAr: 'الضرائب السنوية المقدرة', labelEn: 'Est. Annual Tax', valueAr: '$42,000', valueEn: '$42,000' },
    ],
  },
  {
    id: 'casa-coralina-st-barths',
    code: 'NV-SBH-05',
    region: 'caribbean',
    nameAr: 'كاسا كورالينا الكاريبية',
    nameEn: 'Casa Coralina',
    locationAr: 'بوانت ميلو، سانت بارتس، الكاريبي',
    locationEn: 'Pointe Milou, St. Barths, Caribbean',
    countryAr: 'سانت بارتيليمي',
    countryEn: 'Saint Barthélemy',
    coordinates: '17.9082° N, 62.8154° W',
    priceUsd: 29500000,
    statusAr: 'متاح للبيع المباشر',
    statusEn: 'Available Now',
    styleAr: 'أجنحة استوائية من الحجر المرجاني',
    styleEn: 'Tropical Coral Stone Pavilion',
    bedrooms: 6,
    bathrooms: 7,
    livingAreaSqm: 1180,
    plotAreaSqm: 5100,
    yearBuilt: 2024,
    ownershipAr: 'ملكية حرة فرنسية كاملة',
    ownershipEn: 'French Caribbean Freehold',
    annualTaxUsd: 0,
    image: '/src/assets/images/villa_st_barths_coralina_1795616873330.jpg',
    taglineAr: 'أجنحة مفتوحة من حجر المرجان وخشب الساج تندمج مع أفق البحر الكاريبي الفيروزي',
    taglineEn: 'Open-air coral limestone and teak pavilions merging with the turquoise Caribbean horizon',
    descriptionAr:
      'ملاذ كاريبي استثنائي في أرقى زوايا سانت بارتس، بُني من الحجر المرجاني الطبيعي وأبواب خشب الساج المنحوتة يدوياً لتنفتح بالكامل على نسيم المحيط. تمتد حول مسبح فيروزي طويل يلتقي بالأفق مع وصول مباشر للبحيرة الهادئة وإطلالة غروب لا مثيل لها.',
    descriptionEn:
      'An ultra-private Caribbean sanctuary in Pointe Milou, crafted from local hand-dressed coral stone and solid Burmese teak louver doors that fold away to welcome ocean breezes. Centered around an elongated turquoise infinity pool facing legendary St. Barths sunsets.',
    signatureAssetAr: 'محمية ساحلية 5,100 م² + مرسى يخوت قريب',
    signatureAssetEn: '5,100 m² Coastal Reserve + Lagoon Access',
    amenitiesAr: [
      'أرض ساحلية محمية بمساحة 5,100 متر مربع',
      'مسبح لا متناهٍ فيروزي بطول 28 متراً بإطلالة غروب',
      'أجنحة معيشة مفتوحة من حجر المرجان وخشب الساج',
      'وصول خاص إلى البحيرة الفيروزية الهادئة',
      'شرفة طعام خارجية مع بار كوكتيلات ومنطقة شواء فاخرة',
      'جناح مستقل للطاهي الخاص والطاقم',
      'نظام طاقة شمسية صامت وخزانات تحلية مياه مستقلة',
      'على بُعد 8 دقائق من ميناء غوستافيا لليخوت الفائقة',
    ],
    amenitiesEn: [
      '5,100 m² elevated coastal sanctuary plot',
      '28-meter turquoise sunset infinity pool',
      'Open-air coral stone & Burmese teak living pavilions',
      'Private access pathway to tranquil coral lagoon',
      'Lantern-lit outdoor dining terrace & rum bar',
      'Dedicated private chef & household staff quarters',
      'Whisper-quiet solar microgrid & independent desalination',
      '8 minutes from Gustavia superyacht harbor',
    ],
    specifications: [
      { labelAr: 'المساحة المبنية', labelEn: 'Living Area', valueAr: '1,180 م²', valueEn: '1,180 m²' },
      { labelAr: 'مساحة الأرض', labelEn: 'Coastal Plot', valueAr: '5,100 م²', valueEn: '5,100 m²' },
      { labelAr: 'أجنحة النوم', labelEn: 'Pavilion Suites', valueAr: '6 أجنحة', valueEn: '6 Suites' },
      { labelAr: 'الحمامات', labelEn: 'Bathrooms', valueAr: '7 حمامات', valueEn: '7 Baths' },
      { labelAr: 'الإطلالة', labelEn: 'Orientation', valueAr: 'غروب كاريبي 180°', valueEn: '180° West Sunset' },
      { labelAr: 'سنة البناء', labelEn: 'Year Built', valueAr: '2024', valueEn: '2024' },
      { labelAr: 'نوع الملكية', labelEn: 'Ownership', valueAr: 'ملكية حرة (St. Barths)', valueEn: 'Full Freehold' },
      { labelAr: 'ضريبة الدخل العقاري', labelEn: 'Local Property Tax', valueAr: '$0 (إعفاء محلي)', valueEn: '$0 (Tax-Exempt)' },
    ],
  },
  {
    id: 'satori-cliff-bali',
    code: 'NV-DPS-06',
    region: 'asia',
    nameAr: 'فيلا ساتوري كليف',
    nameEn: 'Villa Satori Cliff',
    locationAr: 'جرف أولواتو البحري، بالي، إندونيسيا',
    locationEn: 'Uluwatu Limestone Cliffs, Bali, Indonesia',
    countryAr: 'إندونيسيا',
    countryEn: 'Indonesia',
    coordinates: '8.8291° S, 115.0849° E',
    priceUsd: 18900000,
    statusAr: 'متاح للبيع المباشر',
    statusEn: 'Available Now',
    styleAr: 'حجر البازلت البركاني وخشب الساج',
    styleEn: 'Volcanic Basalt & Teak Sanctuary',
    bedrooms: 6,
    bathrooms: 8,
    livingAreaSqm: 1420,
    plotAreaSqm: 4600,
    yearBuilt: 2025,
    ownershipAr: 'ملكية استثمارية كاملة عبر شركة PMA',
    ownershipEn: 'Full PMA Freehold / Title Structure',
    annualTaxUsd: 14500,
    image: '/src/assets/images/villa_bali_uluwatu_cliff_1795616840016.jpg',
    taglineAr: 'مسبح طائر بطول 40 متراً معلّق على ارتفاع 70 متراً فوق أمواج المحيط الهندي',
    taglineEn: '40-meter cantilevered pool suspended 70 meters above the Indian Ocean surf',
    descriptionAr:
      'واحدة من أجرأ الفلل المعمارية في آسيا، شُيّدت من حجر البازلت البركاني الأسود وخشب الساج البورمي فوق جرف أولواتو المهيب. يمتد مسبحها المعلّق فوق المحيط الهندي مع مصعد جبلي مائل (Funicular) يهبط مباشرة إلى شاطئ رملي أبيض منعزل.',
    descriptionEn:
      'One of Asia’s most dramatic architectural residences, forged from volcanic basalt and aged Burmese teak atop Uluwatu’s sheer limestone cliffs. Anchored by a 40-meter cantilevered infinity pool floating over the Indian Ocean and a private cliffside funicular descending to a secluded beach.',
    signatureAssetAr: 'مسبح معلق 40م + مصعد جبلي للشاطئ',
    signatureAssetEn: '40m Floating Pool + Private Beach Funicular',
    amenitiesAr: [
      'مسبح لا متناهٍ معلّق بطول 40 متراً فوق المحيط الهندي',
      'مصعد جبلي خاص (Funicular) مباشر إلى الشاطئ المنعزل',
      'جناح شاي وتأمل Zen محاط ببرك مائية عاكسة',
      'منتجع سبا بالي فاخر مع غرف تدليك مفتوحة على البحر',
      'قاعة طعام رئيسية تتسع لـ 20 ضيفاً ومطبخ احترافي',
      'صالة يوغا، سينما خاصة وصالة لياقة بانورامية',
      'نظام تنقية هواء ومياه متقدم ومولد طاقة احتياطي صامت',
      'إدارة فندقية وخدمة ضيافة اختيارية على مدار الساعة',
    ],
    amenitiesEn: [
      '40-meter cantilevered infinity pool over the Indian Ocean',
      'Private cliffside funicular directly to secluded beach',
      'Zen tea pavilion surrounded by volcanic reflection ponds',
      'Ocean-breeze Balinese spa & open-air treatment suites',
      '20-guest architectural dining hall & professional kitchen',
      'Sunrise yoga shala, private cinema & cliff-edge gym',
      'Advanced air/water filtration & silent backup power',
      'Optional 24/7 private estate hospitality management',
    ],
    specifications: [
      { labelAr: 'المساحة المبنية', labelEn: 'Built-Up Area', valueAr: '1,420 م²', valueEn: '1,420 m²' },
      { labelAr: 'مساحة الأرض', labelEn: 'Cliff Land Area', valueAr: '4,600 م²', valueEn: '4,600 m²' },
      { labelAr: 'أجنحة النوم', labelEn: 'Ocean Suites', valueAr: '6 أجنحة', valueEn: '6 Suites' },
      { labelAr: 'الحمامات', labelEn: 'Bathrooms', valueAr: '8 حمامات', valueEn: '8 Baths' },
      { labelAr: 'ارتفاع الجرف', labelEn: 'Cliff Elevation', valueAr: '70 متراً فوق البحر', valueEn: '70m Above Sea' },
      { labelAr: 'سنة البناء', labelEn: 'Year Built', valueAr: '2025', valueEn: '2025' },
      { labelAr: 'نوع الملكية', labelEn: 'Ownership', valueAr: 'ملكية PMA كاملة', valueEn: 'Full PMA Title' },
      { labelAr: 'الضرائب السنوية المقدرة', labelEn: 'Est. Annual Tax', valueAr: '$14,500', valueEn: '$14,500' },
    ],
  },
];

export const REGIONS: { key: RegionKey; labelAr: string; labelEn: string }[] = [
  { key: 'all', labelAr: 'جميع الوجهات', labelEn: 'All Regions' },
  { key: 'middle-east', labelAr: 'الشرق الأوسط', labelEn: 'Middle East' },
  { key: 'europe', labelAr: 'أوروبا', labelEn: 'Europe' },
  { key: 'americas', labelAr: 'أمريكا', labelEn: 'Americas' },
  { key: 'caribbean', labelAr: 'الكاريبي', labelEn: 'Caribbean' },
  { key: 'asia', labelAr: 'آسيا والمحيط', labelEn: 'Asia-Pacific' },
];

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}
