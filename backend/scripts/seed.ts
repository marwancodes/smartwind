import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { products } from "../src/db/schema.js";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

const CATALOG = [
  {
    slug: "aurora-headphones",
    name: "Aurora ANC Headphones",
    category: "Audio",
    description:
      "Hybrid active noise cancellation, 40mm titanium drivers, 32-hour battery (ANC on), multipoint Bluetooth 5.3, fold-flat case included. Tuned for balanced mids — ideal for travel and focused work.",
    priceCents: 24900,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
  },
  {
    slug: "nova-watch",
    name: "Nova Smart Watch Pro",
    category: "Wearables",
    description:
      'Always-on AMOLED 1.4", SpO₂ & ECG-ready sensors, sleep stages, 5 ATM swim-proof, 18-day battery in saver mode. GPS + GLONASS for outdoor workouts.',
    priceCents: 19900,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
  },
  {
    slug: "pulse-speaker",
    name: "Pulse Go Speaker",
    category: "Audio",
    description:
      "360° sound with dual passive radiators, IP67 dust/water, 14h playtime, stereo pairing. USB-C fast charge — party-ready footprint.",
    priceCents: 8900,
    imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80",
  },
  {
    slug: "vertex-laptop-stand",
    name: "Vertex Aluminum Stand",
    category: "Workspace",
    description:
      'Ergonomic 6-step height, silicone pads, supports up to 10 kg. Folds flat for commute. Fits 11–17" laptops.',
    priceCents: 7900,
    imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
  },
  {
    slug: "lumen-keyboard",
    name: "Lumen Mechanical Keyboard",
    category: "Workspace",
    description:
      "Hot-swappable linear switches, PBT keycaps, gasket mount, tri-mode (USB-C / BT / 2.4G). Per-key RGB with onboard profiles.",
    priceCents: 15900,
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
  },
  {
    slug: "orbit-mouse",
    name: "Orbit Ergo Mouse",
    category: "Workspace",
    description:
      "Vertical 57° grip, silent main buttons, 4000 DPI sensor, 70-day battery, USB-C. Reduces wrist pronation during long sessions.",
    priceCents: 6900,
    imageUrl: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&q=80",
  },
  {
    slug: "cascade-monitor-lamp",
    name: "Cascade Monitor Light Bar",
    category: "Workspace",
    description:
      "Asymmetric optics avoid screen glare, RA>95, auto-dimming via ambient sensor. Touch controls + warm/cool CCT presets.",
    priceCents: 9900,
    imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
  },
  {
    slug: "ember-kettle",
    name: "Ember Smart Kettle",
    category: "Home",
    description:
      "Variable temperature 40 100°C, keep-warm 2h, stainless interior, boil-dry protection. App scheduling (Wi‑Fi).",
    priceCents: 12900,
    imageUrl: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80",
  },
  {
    slug: "linen-air-purifier",
    name: "Linen HEPA Air Purifier",
    category: "Home",
    description:
      "CADR 350 m³/h, H13 HEPA + carbon, whisper 24 dB sleep mode, filter life indicator. Rooms up to 40 m².",
    priceCents: 22900,
    imageUrl: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80",
  },
  {
    slug: "traveloo-backpack",
    name: "Traveloo 30L Backpack",
    category: "Travel",
    description:
      'Water-resistant 30L, padded laptop compartment, anti-theft zippers, USB-C charging port. TSA-approved for carry-on.',
    priceCents: 4900,
    imageUrl: "https://images.unsplash.com/photo-1505308144658-03c69861061a?w=800&q=80",
  },
  {
    slug: "voyage-organizer",
    name: "Voyage Tech Organizer",
    category: "Travel",
    description:
      "Ripstop panels, elastic grids for cables & adapters, RFID pocket, slim profile for carry-on.",
    priceCents: 4500,
    imageUrl: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80",
  },
  {
    slug: "apex-mirrorless",
    name: "Apex Mirrorless Body",
    category: "Cameras",
    description:
      "24 MP BSI sensor, 4K60 10-bit internal, 5-axis IBIS, dual SD. Weather-sealed magnesium chassis — body only.",
    priceCents: 149900,
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
  },
  {
    slug: "black-nikon-dslr-camera",
    name: "Black Nikon DSLR Camera",
    category: "Cameras",
    description:
      "24.2 MP, 4K UHD video, 3-inch LCD, 11-point AF system, built-in Wi-Fi and Bluetooth. Ideal for photography enthusiasts.",
    priceCents: 79900,
    imageUrl: "https://images.unsplash.com/photo-1624913503273-5f9c4e980dba?w=800&q=80",
  },
  {
    slug: "nimbus-hub",
    name: "Nimbus USB-C Hub",
    category: "Accessories",
    description:
      "2x USB-A 10 Gbps, HDMI 2.1 4K120, SD/microSD UHS-II, 100 W PD passthrough. Aluminum unibody, braided cable.",
    priceCents: 7900,
    imageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80",
  },
  {
    slug: "solstice-power-bank",
    name: "Solstice 20K Power Bank",
    category: "Accessories",
    description:
      "20000 mAh, 140 W PD PPS, dual USB-C + USB-A, airline-safe. OLED charge readout, soft-touch shell.",
    priceCents: 8900,
    imageUrl: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80",
  },
  {
    slug: "huawei-earbuds",
    name: "Huawei FreeBuds Pro 2",
    category: "Audio",
    description:
      "Hybrid active noise cancellation, 11 mm dynamic drivers, 6 microphones, 4 mics for ANC, 2 for voice pickup. 30h total battery with charging case.",
    priceCents: 6500,
    imageUrl: "https://images.unsplash.com/photo-1731616331098-739bf45618f7?w=800&q=80",
  },
  {
    slug: "gamer-pc",
    name: "Gamer PC",
    category: "Computers",
    description:
      "High-performance gaming desktop with latest graphics and processing power.",
    priceCents: 129900,
    imageUrl: "https://images.unsplash.com/photo-1738245494097-9b1e3971c3eb?w=800&q=80",
  },
  {
    slug: "salomon-shoes",
    name: "Salomon Trail Shoes",
    category: "Travel",
    description:
      "Lightweight trail running shoes with excellent grip and comfort for outdoor adventures.",
    priceCents: 12900,
    imageUrl: "https://images.unsplash.com/photo-1631287381310-925554130169?w=800&q=80",
  },
  {
    slug: "mclaren-steering-wheel",
    name: "McLaren Steering Wheel",
    category: "Computers",
    description:
      "High-end racing steering wheel for immersive driving simulation experiences.",
    priceCents: 49900,
    imageUrl: "https://images.unsplash.com/photo-1594071737848-95cae1e3b6e8?w=800&q=80",
  },
  {
    slug: "apple-imac",
    name: "Apple iMac",
    category: "Computers",
    description:
      "24-inch 4.5K Retina display, M1 chip, 8GB RAM, 256GB SSD.",
    priceCents: 220,
    imageUrl: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=800&q=80",
  },
  {
    slug: "apple-iphone-17",
    name: "Apple iPhone 17",
    category: "Computers",
    description:
      "6.1-inch Super Retina XDR display, A17 Bionic chip, 256GB storage.",
    priceCents: 899,
    imageUrl: "https://images.unsplash.com/photo-1757709608566-4b9fd41a7af5?w=800&q=80",
  },
];

async function main() {
  const rows = CATALOG.map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.category,
    description: p.description,
    priceCents: p.priceCents,
    currency: "gbp",
    imageUrl: p.imageUrl,
    active: true,
  }));

  for (const row of rows) {
    await db
      .insert(products)
      .values(row)
      .onConflictDoUpdate({
        target: products.slug,
        set: {
          name: row.name,
          category: row.category,
          description: row.description,
          priceCents: row.priceCents,
          currency: row.currency,
          imageUrl: row.imageUrl,
          active: row.active,
        },
      });
  }
  console.log(`Seed complete (${CATALOG.length} products upserted).`);
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});