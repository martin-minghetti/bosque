export type ProductCategory =
  | "tabletas"
  | "bombones"
  | "tablones"
  | "estuches"
  | "granos";

export type Product = {
  slug: string;
  name: string;
  shortName: string;
  category: ProductCategory;
  description: string;
  longDescription: string;
  cocoaPercent: number | null;
  origin: string;
  originLabel: string;
  weightG: number;
  priceArs: number;
  stock: number;
  active: boolean;
  accentColor: "cacao" | "dulce-leche" | "frutos-rojos" | "menta-glacial";
  heroGradient: string;
  flavorNotes: string[];
  batchSize: number;
  batchNumber: number;
  roastLevel: "medio" | "medio-alto" | "alto" | null;
  pairings: string[];
  contains: string[];
};

export const PRODUCTS: Product[] = [
  {
    slug: "frutos-rojos-70",
    name: "Frutos rojos · 70%",
    shortName: "Frutos rojos",
    category: "tabletas",
    description:
      "Tableta de cacao 70% con calafate, sauco y rosa mosqueta del corredor de los Andes.",
    longDescription:
      "Cacao single-origin de Tumaco, Colombia, conchado 36 horas. Frutos del bosque deshidratados a baja temperatura para preservar acidez. El calafate aporta el cuerpo, el sauco la frescura, la rosa mosqueta el dejo floral.",
    cocoaPercent: 70,
    origin: "tumaco_co",
    originLabel: "Tumaco, Colombia",
    weightG: 80,
    priceArs: 8900,
    stock: 47,
    active: true,
    accentColor: "frutos-rojos",
    heroGradient:
      "radial-gradient(80% 70% at 60% 40%, #d83a26 0%, #a8210f 60%, #5b0d04 100%)",
    flavorNotes: ["calafate", "sauco", "rosa mosqueta", "frutilla"],
    batchSize: 220,
    batchNumber: 14,
    roastLevel: "medio",
    pairings: ["malbec joven", "té rojo", "café especialidad filtrado"],
    contains: ["leche", "trazas de frutos secos"],
  },
  {
    slug: "cacao-puro-85",
    name: "Cacao puro · 85%",
    shortName: "Cacao 85%",
    category: "tabletas",
    description:
      "Tableta de cacao 85% sin endulzantes agregados. Tueste alto, perfil amargo limpio.",
    longDescription:
      "Para los que buscan cacao en estado casi crudo. 85% de pasta de cacao de Chuao, Venezuela, edulcorado al mínimo con azúcar mascabo. Tueste alto que saca notas tostadas, taninos largos, cero azúcar invasivo.",
    cocoaPercent: 85,
    origin: "chuao_ve",
    originLabel: "Chuao, Venezuela",
    weightG: 80,
    priceArs: 9500,
    stock: 32,
    active: true,
    accentColor: "cacao",
    heroGradient:
      "radial-gradient(80% 70% at 50% 35%, #6b3a1f 0%, #3d1f0f 55%, #1a0a04 100%)",
    flavorNotes: ["café tostado", "tabaco", "madera", "amargor cítrico"],
    batchSize: 180,
    batchNumber: 9,
    roastLevel: "alto",
    pairings: ["whisky de malta", "café espresso", "ron añejo"],
    contains: [],
  },
  {
    slug: "dulce-de-leche-relleno",
    name: "Tableta rellena · Dulce de leche",
    shortName: "Dulce de leche",
    category: "tabletas",
    description:
      "Chocolate con leche 45% relleno con dulce de leche de campo del Valle Inferior.",
    longDescription:
      "Una tableta argentina de manual: cacao Ucayali 45% en cobertura, relleno generoso de dulce de leche de campo de tambo familiar de Río Negro. El balance leche-cacao queda dulce sin empalagar.",
    cocoaPercent: 45,
    origin: "ucayali_pe",
    originLabel: "Ucayali, Perú",
    weightG: 90,
    priceArs: 7800,
    stock: 64,
    active: true,
    accentColor: "dulce-leche",
    heroGradient:
      "radial-gradient(80% 70% at 50% 40%, #e6a560 0%, #c8843a 55%, #6b4118 100%)",
    flavorNotes: ["dulce de leche", "leche tostada", "vainilla", "caramelo"],
    batchSize: 300,
    batchNumber: 22,
    roastLevel: "medio",
    pairings: ["café cortado", "Torrontés tardío", "té negro"],
    contains: ["leche"],
  },
  {
    slug: "menta-glacial-70",
    name: "Menta glacial · 70%",
    shortName: "Menta glacial",
    category: "tabletas",
    description:
      "Cacao 70% infusionado con menta fresca de cordillera. Final largo y limpio.",
    longDescription:
      "Cacao San Martín 70%, conchado con aceite esencial de menta peperina de altura. La sensación es frío químico breve y final largo herbal. Pensada para sobremesa.",
    cocoaPercent: 70,
    origin: "san_martin_pe",
    originLabel: "San Martín, Perú",
    weightG: 80,
    priceArs: 8900,
    stock: 38,
    active: true,
    accentColor: "menta-glacial",
    heroGradient:
      "radial-gradient(80% 70% at 50% 35%, #5fa395 0%, #3f7a6e 55%, #1a3d36 100%)",
    flavorNotes: ["menta peperina", "eucalipto suave", "regaliz", "hoja verde"],
    batchSize: 200,
    batchNumber: 7,
    roastLevel: "medio",
    pairings: ["digestivo Fernet", "café filtrado", "té verde sencha"],
    contains: [],
  },
  {
    slug: "calafate-avellana",
    name: "Calafate y avellana · 65%",
    shortName: "Calafate · avellana",
    category: "tabletas",
    description:
      "Cacao 65% con calafate y avellana tostada en horno de barro patagónico.",
    longDescription:
      "Tradición local: el que come calafate, vuelve. Tableta 65% con bayas enteras de calafate del bosque andino y avellana criolla tostada en horno de barro. Crocante y dulzor agreste.",
    cocoaPercent: 65,
    origin: "ucayali_pe",
    originLabel: "Ucayali, Perú",
    weightG: 80,
    priceArs: 9200,
    stock: 28,
    active: true,
    accentColor: "frutos-rojos",
    heroGradient:
      "radial-gradient(80% 70% at 60% 35%, #8e2a1e 0%, #5e1a10 55%, #2a0c06 100%)",
    flavorNotes: ["calafate", "avellana tostada", "miel", "leña"],
    batchSize: 160,
    batchNumber: 11,
    roastLevel: "medio-alto",
    pairings: ["Pinot Noir frío", "café americano", "cerveza stout"],
    contains: ["frutos secos"],
  },
  {
    slug: "sauco-leche",
    name: "Sauco y leche · 38%",
    shortName: "Sauco · leche",
    category: "tabletas",
    description:
      "Chocolate con leche 38% con polvo de sauco patagónico. Ácido floral.",
    longDescription:
      "Chocolate con leche estilo europeo, 38% cacao Ucayali. Polvo de sauco deshidratado del bosque cordillerano agrega acidez floral y aroma a flores blancas. Para los que rechazan el cacao porcentual y prefieren leche.",
    cocoaPercent: 38,
    origin: "ucayali_pe",
    originLabel: "Ucayali, Perú",
    weightG: 90,
    priceArs: 7800,
    stock: 51,
    active: true,
    accentColor: "dulce-leche",
    heroGradient:
      "radial-gradient(80% 70% at 50% 35%, #f0c98a 0%, #c8843a 55%, #6b4118 100%)",
    flavorNotes: ["sauco", "miel de azahar", "leche tostada", "manzanilla"],
    batchSize: 240,
    batchNumber: 18,
    roastLevel: "medio",
    pairings: ["café latte", "Sauvignon Blanc", "té chai"],
    contains: ["leche"],
  },
  {
    slug: "bombones-autor-x9",
    name: "Bombones de autor · Caja x9",
    shortName: "Bombones x9",
    category: "bombones",
    description:
      "Caja con 9 bombones de autor: dulce de leche, frutos rojos, menta, miel.",
    longDescription:
      "Selección rotativa de 9 bombones de autor pintados a mano. Cubierta de cacao Tumaco 70% sobre rellenos de temporada: dulce de leche de campo, ganache de frutos rojos, frescura de menta, miel de monte. La caja viene numerada.",
    cocoaPercent: 70,
    origin: "blend",
    originLabel: "Blend de origen",
    weightG: 135,
    priceArs: 14500,
    stock: 24,
    active: true,
    accentColor: "cacao",
    heroGradient:
      "radial-gradient(75% 70% at 50% 40%, #8b5a3c 0%, #4d2d1a 55%, #1f0f08 100%)",
    flavorNotes: ["dulce de leche", "frutos rojos", "menta", "miel", "cacao puro"],
    batchSize: 80,
    batchNumber: 31,
    roastLevel: "medio",
    pairings: ["café espresso", "Malbec joven", "té negro Earl Grey"],
    contains: ["leche", "frutos secos"],
  },
  {
    slug: "bombones-single-origin-x16",
    name: "Bombones single-origin · Caja x16",
    shortName: "Bombones single-origin",
    category: "bombones",
    description:
      "16 bombones, 4 orígenes: Tumaco, Chuao, San Martín, Ucayali. Sin rellenos.",
    longDescription:
      "Catador. 16 bombones puros sin rellenos, 4 orígenes a degustar comparativamente: Tumaco (CO), Chuao (VE), San Martín (PE), Ucayali (PE). Ideal para entender perfiles. Incluye ficha de notas para anotar tu cata.",
    cocoaPercent: 72,
    origin: "blend",
    originLabel: "4 orígenes",
    weightG: 240,
    priceArs: 24500,
    stock: 17,
    active: true,
    accentColor: "cacao",
    heroGradient:
      "radial-gradient(75% 70% at 45% 40%, #7d4a2c 0%, #3d1f0f 55%, #150805 100%)",
    flavorNotes: ["fruta tropical", "tabaco", "café", "frutos rojos", "tostado"],
    batchSize: 60,
    batchNumber: 5,
    roastLevel: "medio-alto",
    pairings: ["café filtrado V60", "whisky de malta", "vino dulce"],
    contains: [],
  },
  {
    slug: "tablon-clasico-350g",
    name: "Tablón clásico · 350g",
    shortName: "Tablón clásico",
    category: "tablones",
    description:
      "Tablón de 350g de chocolate semiamargo 60% con almendras enteras y pasas al malbec.",
    longDescription:
      "El tablón patagónico clásico, escalado y honesto. Cacao Ucayali 60%, almendras enteras tostadas, pasas de uva criollas remojadas en Malbec joven 24 horas. Para mesa larga, regalo, o cortar y compartir en parques.",
    cocoaPercent: 60,
    origin: "ucayali_pe",
    originLabel: "Ucayali, Perú",
    weightG: 350,
    priceArs: 24000,
    stock: 19,
    active: true,
    accentColor: "cacao",
    heroGradient:
      "radial-gradient(75% 70% at 50% 35%, #8e5a3a 0%, #4d2d1a 55%, #1f0f08 100%)",
    flavorNotes: ["almendra tostada", "pasa al vino", "cacao limpio"],
    batchSize: 120,
    batchNumber: 27,
    roastLevel: "medio",
    pairings: ["Malbec", "café", "leche caliente"],
    contains: ["frutos secos", "alcohol residual"],
  },
  {
    slug: "tablon-degustacion-5x70",
    name: "Tablón degustación · 5×70g",
    shortName: "Degustación 5",
    category: "tablones",
    description:
      "5 tabletas de 70g: las 5 firmadas de la casa. Para regalar o probar todo.",
    longDescription:
      "Set de degustación con las 5 referencias firmadas: Frutos rojos 70%, Cacao puro 85%, Dulce de leche, Menta glacial 70%, Calafate y avellana. Cada tableta de 70g sale con su ficha técnica. Ahorro vs comprarlas sueltas.",
    cocoaPercent: 70,
    origin: "blend",
    originLabel: "5 referencias",
    weightG: 350,
    priceArs: 39500,
    stock: 12,
    active: true,
    accentColor: "frutos-rojos",
    heroGradient:
      "radial-gradient(75% 70% at 50% 35%, #b73828 0%, #6b1a10 55%, #2a0805 100%)",
    flavorNotes: ["completo", "5 perfiles distintos"],
    batchSize: 60,
    batchNumber: 4,
    roastLevel: "medio",
    pairings: ["dependiendo de cada tableta"],
    contains: ["leche", "frutos secos"],
  },
  {
    slug: "estuche-cordillera",
    name: "Estuche Cordillera · 3 tabletas",
    shortName: "Estuche Cordillera",
    category: "estuches",
    description:
      "Caja de regalo: 3 tabletas signature en estuche numerado para envío.",
    longDescription:
      "Caja de regalo con 3 tabletas en estuche de cartulina patagónica numerado y firmado. Selección: Frutos rojos 70%, Calafate y avellana 65%, Menta glacial 70%. Pensada para envío a Buenos Aires con dedicatoria.",
    cocoaPercent: 70,
    origin: "blend",
    originLabel: "Selección Cordillera",
    weightG: 240,
    priceArs: 26000,
    stock: 21,
    active: true,
    accentColor: "menta-glacial",
    heroGradient:
      "radial-gradient(75% 70% at 50% 35%, #5fa395 0%, #2e5a51 55%, #0f1f1c 100%)",
    flavorNotes: ["3 tabletas firmadas", "regalo numerado"],
    batchSize: 100,
    batchNumber: 13,
    roastLevel: "medio",
    pairings: ["regalo, no se aplica"],
    contains: ["frutos secos"],
  },
  {
    slug: "cacao-grano-250g",
    name: "Cacao en grano tostado · 250g",
    shortName: "Cacao en grano",
    category: "granos",
    description:
      "Cacao en grano de Chuao tostado y descascarillado. Para infusión o crocar.",
    longDescription:
      "Granos enteros de cacao Chuao tostados y descascarillados a mano. Para hacer infusión tipo cascarilla, agregar a granolas, o comer crudo como cacao puro al 100%. Sin azúcar, sin proceso adicional.",
    cocoaPercent: 100,
    origin: "chuao_ve",
    originLabel: "Chuao, Venezuela",
    weightG: 250,
    priceArs: 11500,
    stock: 35,
    active: true,
    accentColor: "cacao",
    heroGradient:
      "radial-gradient(75% 70% at 50% 35%, #6b3a1f 0%, #2d150a 55%, #100804 100%)",
    flavorNotes: ["cacao puro", "tueste alto", "café tostado"],
    batchSize: 200,
    batchNumber: 16,
    roastLevel: "alto",
    pairings: ["leche caliente", "infusión", "granolas"],
    contains: [],
  },
];

export const CATEGORIES: { slug: ProductCategory; label: string }[] = [
  { slug: "tabletas", label: "Tabletas" },
  { slug: "bombones", label: "Bombones" },
  { slug: "tablones", label: "Tablones" },
  { slug: "estuches", label: "Estuches" },
  { slug: "granos", label: "Granos" },
];

export function findProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function productsByCategory(category: ProductCategory): Product[] {
  return PRODUCTS.filter((p) => p.category === category && p.active);
}

export function activeProducts(): Product[] {
  return PRODUCTS.filter((p) => p.active);
}
