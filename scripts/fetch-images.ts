// Descarga imágenes libres desde Wikimedia Commons para los productos
// y secciones de la home. Filtra fotos de marcas comerciales obvias.
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const BLOCK_BRANDS = [
  "hershey",
  "cadbury",
  "nestle",
  "lindt",
  "milka",
  "ferrero",
  "godiva",
  "tcho",
  "ghirardelli",
  "mars",
  "snickers",
  "kitkat",
  "toblerone",
  "ritter",
  "mondelez",
  "green and black",
  "valrhona",
  "callebaut",
  "astor",
];

const BLOCK_KEYWORDS = [
  "logo",
  "label",
  "packaging",
  "tina",
  "milkshake",
  "cupcake",
  "cheezecake",
  "ice milk",
  "icecream",
  "ice cream",
];

type Target = {
  outFile: string;
  queries: string[];
  preferLandscape?: boolean;
};

const TARGETS: Target[] = [
  // Productos faltantes (re-fetch con queries mejor pensadas)
  {
    outFile: "products/frutos-rojos-70.jpg",
    queries: [
      "raspberries macro",
      "red berries close up",
      "ripe raspberries",
    ],
  },
  {
    outFile: "products/cacao-puro-85.jpg",
    queries: [
      "dark chocolate squares stacked",
      "broken dark chocolate",
      "chocolate macro texture",
    ],
  },
  {
    outFile: "products/tablon-clasico-350g.jpg",
    queries: [
      "chocolate slab nuts",
      "chocolate with nuts and raisins",
      "chocolate bark dark",
    ],
  },
  {
    outFile: "products/tablon-degustacion-5x70.jpg",
    queries: [
      "chocolate squares stacked dark",
      "chocolate bars assortment",
      "chocolate selection plate",
    ],
  },
  {
    outFile: "products/estuche-cordillera.jpg",
    queries: [
      "chocolate box opened pralines",
      "wooden gift box chocolate",
      "kraft paper chocolate",
    ],
  },

  // Hero mayorista (re-fetch)
  {
    outFile: "hero/mayorista.jpg",
    queries: [
      "rustic kitchen wood",
      "patagonia restaurant wood",
      "shop interior wood shelves",
    ],
    preferLandscape: true,
  },
];

type WikiPage = {
  title: string;
  imageinfo?: Array<{
    url: string;
    thumburl?: string;
    width: number;
    height: number;
    mime: string;
  }>;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url: string, retries = 3): Promise<unknown> {
  for (let attempt = 0; attempt < retries; attempt++) {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "BosqueDemo/1.0 (https://github.com/martin-minghetti/bosque; martin.minghetti@gmail.com) portfolio",
      },
    });
    if (res.ok) return res.json();
    if (res.status === 429) {
      console.warn(`  · 429, esperando ${(attempt + 1) * 5}s`);
      await sleep((attempt + 1) * 5000);
      continue;
    }
    throw new Error(`fetch ${res.status}`);
  }
  throw new Error("max retries");
}

async function searchWikimedia(query: string): Promise<WikiPage[]> {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrsearch: query,
    gsrnamespace: "6",
    gsrlimit: "20",
    prop: "imageinfo",
    iiprop: "url|size|mime",
    iiurlwidth: "1600",
  });
  const json = (await fetchJson(
    `https://commons.wikimedia.org/w/api.php?${params.toString()}`,
  )) as { query?: { pages?: Record<string, WikiPage> } };
  return Object.values(json.query?.pages ?? {});
}

function isAllowed(title: string): boolean {
  const t = title.toLowerCase();
  for (const b of BLOCK_BRANDS) if (t.includes(b)) return false;
  for (const k of BLOCK_KEYWORDS) if (t.includes(k)) return false;
  return true;
}

function pickBest(
  pages: WikiPage[],
  preferLandscape: boolean,
): WikiPage["imageinfo"] {
  const candidates = pages
    .filter((p) => isAllowed(p.title))
    .filter((p) => p.imageinfo?.[0]?.mime === "image/jpeg")
    .filter((p) => (p.imageinfo?.[0]?.width ?? 0) >= 800);

  candidates.sort((a, b) => {
    const ai = a.imageinfo?.[0];
    const bi = b.imageinfo?.[0];
    if (!ai || !bi) return 0;
    const aRatio = ai.width / ai.height;
    const bRatio = bi.width / bi.height;
    if (preferLandscape) {
      const aDist = Math.abs(aRatio - 1.5);
      const bDist = Math.abs(bRatio - 1.5);
      return aDist - bDist;
    }
    const aDist = Math.abs(aRatio - 1.0);
    const bDist = Math.abs(bRatio - 1.0);
    return aDist - bDist;
  });

  return candidates[0]?.imageinfo;
}

async function downloadImage(url: string, outPath: string, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "BosqueDemo/1.0 (https://github.com/martin-minghetti/bosque) portfolio",
      },
    });
    if (res.ok) {
      const buf = Buffer.from(await res.arrayBuffer());
      writeFileSync(outPath, buf);
      return;
    }
    if (res.status === 429) {
      await sleep((attempt + 1) * 5000);
      continue;
    }
    throw new Error(`download ${res.status}`);
  }
  throw new Error("max retries");
}

async function main() {
  const publicDir = "public";
  mkdirSync(join(publicDir, "products"), { recursive: true });
  mkdirSync(join(publicDir, "hero"), { recursive: true });

  for (const t of TARGETS) {
    const outPath = join(publicDir, t.outFile);
    if (existsSync(outPath)) {
      console.log(`✓ existe: ${t.outFile}`);
      continue;
    }
    let info: WikiPage["imageinfo"] | undefined;
    let usedQuery = "";
    for (const q of t.queries) {
      console.log(`→ buscando "${q}" para ${t.outFile}`);
      try {
        const pages = await searchWikimedia(q);
        info = pickBest(pages, t.preferLandscape ?? false);
        if (info?.[0]) {
          usedQuery = q;
          break;
        }
        console.log(`  · sin candidato válido para "${q}"`);
      } catch (e) {
        console.warn(`  · search error: ${e instanceof Error ? e.message : e}`);
      }
      await sleep(1500);
    }
    if (!info?.[0]) {
      console.warn(`  ✗ sin foto para ${t.outFile} — usando gradient`);
      continue;
    }
    try {
      const url = info[0].thumburl ?? info[0].url;
      await downloadImage(url, outPath);
      console.log(`  ✓ ${t.outFile} (${info[0].width}×${info[0].height}) [q="${usedQuery}"]`);
    } catch (e) {
      console.error(`  ✗ ${t.outFile}: ${e instanceof Error ? e.message : e}`);
    }
    await sleep(1500);
  }

  console.log("\nDone.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
