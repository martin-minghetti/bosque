// Generación de imágenes con Replicate FLUX 1.1 Pro.
// Run: REPLICATE_API_TOKEN=r8_xxx pnpm exec tsx scripts/gen-flux-images.ts
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const MODEL = "black-forest-labs/flux-1.1-pro";

const STYLE_BASE =
  "editorial product photography, dark moody lighting, shallow depth of field, premium artisan chocolate brand aesthetic, dark walnut wood surface, minimal styling, professional packshot, soft directional natural light, no text, no logos, no labels, no watermarks, hyperrealistic, 50mm lens";

type Target = {
  outFile: string;
  prompt: string;
  aspect: "1:1" | "3:2" | "16:9" | "4:5";
};

const TARGETS: Target[] = [
  // PRODUCTOS — square 1:1 para packshots
  {
    outFile: "products/frutos-rojos-70.jpg",
    aspect: "1:1",
    prompt: `dark chocolate bar 70% cocoa with raspberries and red berries crystallized on top, broken into pieces showing texture, deep red and dark brown tones, ${STYLE_BASE}`,
  },
  {
    outFile: "products/cacao-puro-85.jpg",
    aspect: "1:1",
    prompt: `pure dark chocolate 85% bar, matte finish, intense black-brown color, brutal minimalist, single bar isolated, sharp edges, no decoration, ${STYLE_BASE}`,
  },
  {
    outFile: "products/dulce-de-leche-relleno.jpg",
    aspect: "1:1",
    prompt: `milk chocolate bar broken open showing thick golden caramel dulce de leche filling oozing out, warm caramel tones, glossy interior, ${STYLE_BASE}`,
  },
  {
    outFile: "products/menta-glacial-70.jpg",
    aspect: "1:1",
    prompt: `dark chocolate bar 70% cocoa with fresh mint leaves arranged beside it, deep green and dark brown contrast, water droplets on mint, cold fresh mood, ${STYLE_BASE}`,
  },
  {
    outFile: "products/calafate-avellana.jpg",
    aspect: "1:1",
    prompt: `dark chocolate bar 65% with hazelnuts and dark berries embedded, rustic broken texture showing nuts, warm brown tones, artisan handmade, ${STYLE_BASE}`,
  },
  {
    outFile: "products/sauco-leche.jpg",
    aspect: "1:1",
    prompt: `milk chocolate bar with white elderflower clusters arranged beside it, soft cream and warm brown palette, delicate, floral, ${STYLE_BASE}`,
  },
  {
    outFile: "products/bombones-autor-x9.jpg",
    aspect: "1:1",
    prompt: `box of 9 handcrafted artisan chocolate bonbons arranged in a 3x3 grid, varied surfaces (some shiny, some matte, some dusted), painted finishes, dark chocolate base, premium presentation, top-down view, ${STYLE_BASE}`,
  },
  {
    outFile: "products/bombones-single-origin-x16.jpg",
    aspect: "1:1",
    prompt: `box of 16 dark chocolate bonbons arranged in a uniform 4x4 grid, all glossy dark spheres with subtle differences in shade, minimalist, top-down view, dark moody, ${STYLE_BASE}`,
  },
  {
    outFile: "products/tablon-clasico-350g.jpg",
    aspect: "1:1",
    prompt: `large thick chocolate slab with whole almonds and raisins embedded, rustic broken edges, generous size, warm brown wood background, ${STYLE_BASE}`,
  },
  {
    outFile: "products/tablon-degustacion-5x70.jpg",
    aspect: "1:1",
    prompt: `five different chocolate bars arranged side by side in a row, varied colors from dark to milk, each with different toppings (berries, nuts, plain, mint, caramel), tasting flight, minimalist arrangement, ${STYLE_BASE}`,
  },
  {
    outFile: "products/estuche-cordillera.jpg",
    aspect: "1:1",
    prompt: `kraft brown cardboard gift box opened revealing three chocolate bars with twine and minimal kraft paper, premium artisan packaging, no text, no labels, ${STYLE_BASE}`,
  },
  {
    outFile: "products/cacao-grano-250g.jpg",
    aspect: "1:1",
    prompt: `roasted whole cocoa beans piled on dark wood, some beans broken open showing nibs inside, raw cacao texture, warm brown earth tones, close-up macro, ${STYLE_BASE}`,
  },

  // HERO — landscape 3:2
  {
    outFile: "hero/main.jpg",
    aspect: "3:2",
    prompt: `panoramic landscape of Patagonian mountain lake at golden hour, snow-capped Andes peaks in background, deep turquoise lake water, evergreen forest in foreground, mist rising, cinematic, dramatic lighting, peaceful, no people, hyperrealistic 35mm`,
  },
  {
    outFile: "hero/origen.jpg",
    aspect: "3:2",
    prompt: `cocoa pods hanging from theobroma cacao tree, deep green leaves and yellow-orange ripe pods, tropical jungle background, soft sunlight filtering through canopy, cinematic, photorealistic, ${STYLE_BASE}`,
  },
  {
    outFile: "hero/produccion.jpg",
    aspect: "3:2",
    prompt: `close-up of artisan chocolatier hands tempering melted dark chocolate on marble surface, palette knife spreading chocolate, dark moody lighting, hands of craftsman in apron, dramatic side lighting, no face visible, ${STYLE_BASE}`,
  },
  {
    outFile: "hero/mayorista.jpg",
    aspect: "3:2",
    prompt: `interior of premium specialty coffee shop or chocolate boutique, dark walnut wood counter, glass display with products, warm pendant lighting, minimal decor, no people, no text, no logos, editorial Patagonian craftsman aesthetic, ${STYLE_BASE}`,
  },
  {
    outFile: "hero/tienda.jpg",
    aspect: "3:2",
    prompt: `top-down flat lay of assorted artisan chocolate bars, dark chocolate truffles, raw cocoa beans, dried red berries, all arranged on weathered dark walnut wood surface, dramatic side lighting, editorial product photography, no text, no logos, hyperrealistic, ${STYLE_BASE}`,
  },
  {
    outFile: "hero/contacto.jpg",
    aspect: "3:2",
    prompt: `dark moody desk scene with leather notebook, vintage fountain pen, ceramic coffee cup, cocoa beans scattered, warm pendant light overhead, dark walnut surface, hands resting nearby cropped out of frame, editorial atmosphere, ${STYLE_BASE}`,
  },
];

async function callReplicate(prompt: string, aspect: string): Promise<string> {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) throw new Error("REPLICATE_API_TOKEN not set");

  const res = await fetch(`https://api.replicate.com/v1/models/${MODEL}/predictions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: "wait",
    },
    body: JSON.stringify({
      input: {
        prompt,
        aspect_ratio: aspect,
        output_format: "jpg",
        output_quality: 90,
        safety_tolerance: 2,
      },
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`replicate ${res.status}: ${txt.slice(0, 300)}`);
  }

  const json = (await res.json()) as {
    status: string;
    output?: string | string[];
    error?: string;
    urls?: { get?: string };
    id?: string;
  };

  // Si Prefer:wait timeout antes de finalizar, polleamos
  if (json.status !== "succeeded" && json.urls?.get) {
    return await pollUntilDone(json.urls.get, token);
  }
  if (json.error) throw new Error(json.error);
  if (!json.output) throw new Error("no output");
  return Array.isArray(json.output) ? json.output[0] : json.output;
}

async function pollUntilDone(url: string, token: string): Promise<string> {
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = (await res.json()) as {
      status: string;
      output?: string | string[];
      error?: string;
    };
    if (json.status === "succeeded" && json.output) {
      return Array.isArray(json.output) ? json.output[0] : json.output;
    }
    if (json.status === "failed" || json.status === "canceled") {
      throw new Error(json.error ?? "prediction failed");
    }
  }
  throw new Error("poll timeout");
}

async function downloadImage(url: string, outPath: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(outPath, buf);
}

async function main() {
  if (!process.env.REPLICATE_API_TOKEN) {
    console.error("REPLICATE_API_TOKEN no seteado");
    process.exit(1);
  }
  mkdirSync("public/products", { recursive: true });
  mkdirSync("public/hero", { recursive: true });

  const force = process.argv.includes("--force");
  let total = 0;
  for (const t of TARGETS) {
    const outPath = join("public", t.outFile);
    if (existsSync(outPath) && !force) {
      console.log(`✓ existe: ${t.outFile}`);
      continue;
    }
    console.log(`→ generando: ${t.outFile} (${t.aspect})`);
    try {
      const url = await callReplicate(t.prompt, t.aspect);
      await downloadImage(url, outPath);
      total++;
      console.log(`  ✓ ${t.outFile}`);
    } catch (e) {
      console.error(`  ✗ ${t.outFile}: ${e instanceof Error ? e.message : e}`);
    }
  }
  console.log(`\nDone. Generated ${total} images. Estimated cost: $${(total * 0.04).toFixed(2)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
