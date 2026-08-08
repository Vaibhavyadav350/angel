// ---------------------------------------------------------------------------
// Listing page identity.
//
// Every route on the storefront — four categories, fifteen sub-categories, five
// collections and eight fabrics — lands on the same listing page. Until now they
// were identical apart from the words, so browsing Jewellery felt exactly like
// browsing Menswear.
//
// This gives each context its own ground tint and editorial line, plus a
// photograph where one genuinely exists. The accent stays the house gold in every
// context — see below. Everything degrades: a context with no entry still gets
// the archive default, and one with no image simply renders without it rather
// than breaking the layout.
// ---------------------------------------------------------------------------

// The house accent. One colour, used everywhere something is a rule, a border or
// an active state.
//
// Each department briefly had its own — maroon for Women, olive for Menswear —
// which fragmented the identity: the header said one thing while the gold filter
// sidebar directly beneath it said another. Departments are already told apart by
// their ground tint and their own photography, which is the quiet way to do it.
const GOLD = '#C5A059';

const ARCHIVE = {
  eyebrow: 'Curated Archive',
  tint: '#F7EFE3',
  accent: GOLD,
  line: 'Every piece in the studio, from bridal heirlooms to everyday wear.',
  image: '/assets/landing/bridal-edit-center.jpg',
};

const CATEGORY = {
  Women: {
    eyebrow: 'The Women’s Archive',
    tint: '#F5E9E6',
    line: 'Lehengas, sarees and salwar kameez — cut for celebration.',
    image: '/assets/landing/cat-lehenga.jpg',
    banner: '/assets/landing/cat-women-banner.jpg',
  },
  Men: {
    eyebrow: 'Menswear',
    tint: '#EFE9E0',
    line: 'Sherwanis, jackets and kurtas, tailored with restraint.',
    image: '/assets/landing/cat-sherwani.jpg',
    banner: '/assets/landing/cat-men-banner.jpg',
  },
  Kids: {
    eyebrow: 'The Young Heirs',
    tint: '#F2EEE5',
    line: 'Miniature heirlooms, made with the same care as the rest.',
    image: '/assets/landing/cat-kids.jpg',
    banner: '/assets/landing/cat-kids-banner.jpg',
  },
  Jewelry: {
    eyebrow: 'Archival Adornments',
    tint: '#F6EFE1',
    line: 'Kundan, polki and pearl — finished by hand.',
    image: '/assets/landing/cat-jewelry.jpg',
    banner: '/assets/landing/cat-jewelry-banner.jpg',
  },
};

const COLLECTION = {
  'new arrivals': {
    eyebrow: 'Just Arrived',
    tint: '#F4EFE6',
    line: 'The newest pieces to enter the studio.',
    image: '/assets/landing/hero-lehenga.jpg',
  },
  sale: {
    eyebrow: 'The Sale',
    tint: '#F6E9E7',
    line: 'Selected pieces, reduced for a limited time.',
    image: '/assets/landing/cat-saree.jpg',
  },
  'best sellers': {
    eyebrow: 'Best Sellers',
    tint: '#F3EDE2',
    line: 'The pieces our customers return to most.',
    image: '/assets/landing/cat-anarkali.jpg',
  },
  'ready to ship': {
    eyebrow: 'Ready To Ship',
    tint: '#EFEDE6',
    line: 'In stock and on its way within a day.',
    image: '/assets/landing/occ-evening.jpg',
  },
  'plus sizes': {
    eyebrow: 'Plus Sizes',
    tint: '#F1ECE6',
    line: 'The same craft, cut across a fuller range of sizes.',
    image: '/assets/landing/salwar-1.jpg',
  },
};

// Cloth is an attribute rather than a department, so it gets no editorial
// portrait — but the home page circles already hold a photograph per cloth, and
// reusing them keeps the two surfaces speaking to each other. Rendered small and
// round here, exactly as they appear on the home page.
const FABRIC = {
  'A-Line': { tint: '#F4EFE7' },
  Fishtail: { tint: '#EFF0EC' },
  Banarasi: { tint: '#F6EDE1' },
  Silk: { tint: '#F5F0E6' },
  Velvet: { tint: '#F1EAEC' },
  Georgette: { tint: '#EEF0EE' },
  Net: { tint: '#F1EFEA' },
  Organza: { tint: '#F5F1E9' },
};

const fabricImage = (name) =>
  `/assets/landing/circ-${String(name).toLowerCase().replace('-', '')}.jpg`;

// Sub-category portraits.
//
// Drilling from Women into Sarees used to keep showing the same lehenga, so
// every one of the fifteen sub-categories looked like its parent. These are the
// images the home page catalogue grid already uses, so nothing new was shot and
// the two surfaces agree with each other.
//
// Keyed by product type first and sub-category second — the most specific match
// wins. Keys are matched case-insensitively because the taxonomy mixes
// 'Anarkali suits', 'WEDDING SAREES' and 'kurti'.
const SUBJECT = {
  // Women
  'anarkali suits': 'subcat_anarkali',
  'gharara suit': 'subcat_gharara',
  'palazzo suits': 'subcat_palazzo',
  'pant suits': 'subcat_pantsuit',
  'punjabi suits': 'subcat_punjabi',
  'sharara suits': 'subcat_sharara',
  'pakistani suits': 'subcat_pakistani',
  kurti: 'subcat_kurti',
  'wedding sarees': 'subcat_weddingsaree',
  'casual wear': 'subcat_casualsaree',
  'bridal lehengas': 'subcat_bridallehenga',
  'partywear lehengas': 'subcat_partywearlehenga',
  'indo western': 'subcat_indowestern',
  'salwar kameez': 'subcat_anarkali',
  sarees: 'subcat_weddingsaree',
  lehengas: 'subcat_bridallehenga',

  // Men
  'classic sherwani': 'subcat_classicsherwani',
  'indowestern sherwani': 'subcat_indowestern',
  'jacket sets': 'subcat_jacketset',
  'jodhpuri jaket sets': 'subcat_jodhpuri',
  'kurta pajama sets': 'subcat_kurtapajama',
  'long kurta set': 'subcat_longkurta',
  'short kurta set': 'subcat_shortkurta',
  sherwanis: 'subcat_classicsherwani',
  jacket: 'subcat_jacketset',
  kurtas: 'subcat_kurtapajama',

  // Kids
  'girls kidswear': 'subcat_girlskid',
  'boys kidswear': 'subcat_boyskid',
  girls: 'subcat_girlskid',
  boys: 'subcat_boyskid',

  // Jewelry
  'bridal wear jewelery': 'subcat_bridaljewelry',
  'casual wear jewelery': 'subcat_casualjewelry',
  necklaces: 'subcat_necklaces',
  chokers: 'subcat_chokers',
  earrings: 'subcat_earrings',
  'bracelets & bangles': 'subcat_bracelets',
  bracelets: 'subcat_bracelets',
  rings: 'subcat_rings',
  bridal: 'subcat_bridaljewelry',
  casual: 'subcat_casualjewelry',
};

const subjectImage = (...candidates) => {
  for (const c of candidates) {
    if (!c || c === 'all') continue;
    const file = SUBJECT[String(c).trim().toLowerCase()];
    if (file) return `/assets/landing/catalog/${file}.jpg`;
  }
  return null;
};

/**
 * Resolve the theme for the current filters, most specific first.
 * @param {{category?:string, subCategory?:string, productType?:string, collection?:string, fabric?:string}} filters
 */
export const collectionTheme = (filters = {}) => {
  const isSet = (v) => v && v !== 'all';

  if (isSet(filters.fabric)) {
    const f = FABRIC[filters.fabric] || {};
    return {
      ...ARCHIVE,
      ...f,
      eyebrow: 'By Cloth',
      line: `Every piece cut from ${String(filters.fabric).toLowerCase()}.`,
      image: fabricImage(filters.fabric),
      round: true, // small and circular, matching the home page strip
    };
  }

  if (isSet(filters.collection)) {
    const theme = COLLECTION[String(filters.collection).toLowerCase()];
    if (theme) return { ...ARCHIVE, ...theme };
  }

  if (isSet(filters.category)) {
    const theme = CATEGORY[filters.category];
    if (theme) {
      // Drilling into a sub-category keeps the department's colour and banner but
      // takes its own name and its own portrait, so Sarees still reads as part of
      // the Women's archive without showing a lehenga.
      if (isSet(filters.subCategory) || isSet(filters.productType)) {
        const portrait = subjectImage(filters.productType, filters.subCategory);
        return {
          ...ARCHIVE,
          ...theme,
          eyebrow: filters.category,
          line: '',
          image: portrait || theme.image,
        };
      }
      return { ...ARCHIVE, ...theme };
    }
  }

  return ARCHIVE;
};

export default collectionTheme;
