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

// The page's own ground, straight from the Tailwind palette.
//
// Every band used to carry a tint of its own — near-white creams and greys that
// were close to champagne but not it. Against the champagne page below, "close
// but not it" is exactly what reads as a seam: the eye finds the edge instantly.
//
// The banner departments now sit on champagne itself, so the quiet left half of
// the band IS the page and there is no line to see. Ornament simply emerges on
// the right. Collections and cloth keep a hint of their own colour, which the
// bottom fade dissolves.
const CHAMPAGNE = '#F7E7CE';

const ARCHIVE = {
  eyebrow: 'Curated Archive',
  tint: CHAMPAGNE,
  accent: GOLD,
  line: 'Every piece in the studio, from bridal heirlooms to everyday wear.',
  image: '/assets/landing/bridal-edit-center.jpg',
};

const CATEGORY = {
  Women: {
    eyebrow: 'The Women’s Archive',
    // Sampled from the banner's own quiet left third, so the flat colour behind
    // the artwork and the artwork itself meet without a seam. The old #F5E9E6
    // belonged to the blush banner and was the one pink surface on the site.
    tint: CHAMPAGNE,
    line: 'Lehengas, sarees and salwar kameez — cut for celebration.',
    image: '/assets/landing/cat-lehenga.jpg',
    banner: '/assets/landing/cat-women-banner.jpg',
    bannerOpacity: 0.85,
  },
  Men: {
    eyebrow: 'Menswear',
    tint: CHAMPAGNE,
    line: 'Sherwanis, jackets and kurtas, tailored with restraint.',
    image: '/assets/landing/cat-sherwani.jpg',
    banner: '/assets/landing/cat-men-banner.jpg',
    bannerOpacity: 0.85,
  },
  Kids: {
    eyebrow: 'The Young Heirs',
    tint: CHAMPAGNE,
    line: 'Miniature heirlooms, made with the same care as the rest.',
    image: '/assets/landing/cat-kids.jpg',
    banner: '/assets/landing/cat-kids-banner.jpg',
    bannerOpacity: 0.85,
  },
  Jewelry: {
    eyebrow: 'Archival Adornments',
    tint: CHAMPAGNE,
    line: 'Kundan, polki and pearl — finished by hand.',
    image: '/assets/landing/cat-jewelry.jpg',
    banner: '/assets/landing/cat-jewelry-banner.jpg',
    // A photograph of jewellery rather than a flat textile: far busier, so it
    // stays held back where the embroidery banners can carry more weight.
    bannerOpacity: 0.55,
  },
};

const COLLECTION = {
  'new arrivals': {
    eyebrow: 'Just Arrived',
    tint: CHAMPAGNE,
    line: 'The newest pieces to enter the studio.',
    image: '/assets/landing/hero-lehenga.jpg',
  },
  sale: {
    eyebrow: 'The Sale',
    tint: CHAMPAGNE,
    line: 'Selected pieces, reduced for a limited time.',
    image: '/assets/landing/cat-saree.jpg',
  },
  'best sellers': {
    eyebrow: 'Best Sellers',
    tint: CHAMPAGNE,
    line: 'The pieces our customers return to most.',
    image: '/assets/landing/cat-anarkali.jpg',
  },
  'ready to ship': {
    eyebrow: 'Ready To Ship',
    tint: CHAMPAGNE,
    line: 'In stock and on its way within a day.',
    image: '/assets/landing/occ-evening.jpg',
  },
  'plus sizes': {
    eyebrow: 'Plus Sizes',
    tint: CHAMPAGNE,
    line: 'The same craft, cut across a fuller range of sizes.',
    image: '/assets/landing/salwar-1.jpg',
  },
};

// Cloth is an attribute rather than a department, so it gets no editorial
// portrait — but the home page circles already hold a photograph per cloth, and
// reusing them keeps the two surfaces speaking to each other. Rendered small and
// round here, exactly as they appear on the home page.
const FABRIC = {
  'A-Line': { tint: CHAMPAGNE },
  Fishtail: { tint: CHAMPAGNE },
  Banarasi: { tint: CHAMPAGNE },
  Silk: { tint: CHAMPAGNE },
  Velvet: { tint: CHAMPAGNE },
  Georgette: { tint: CHAMPAGNE },
  Net: { tint: CHAMPAGNE },
  Organza: { tint: CHAMPAGNE },
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
