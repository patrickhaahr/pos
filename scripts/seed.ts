import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { products } from "../lib/schema";
import path from "path";

const DB_PATH = path.join(process.cwd(), "brewhaus.db");

const client = createClient({ url: `file:${DB_PATH}` });
const db = drizzle(client);

// Init tables first
await client.execute(`PRAGMA journal_mode = WAL`);
await client.execute(`PRAGMA foreign_keys = ON`);
await client.execute(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT NOT NULL,
    in_stock INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);
await client.execute(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    total REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);
await client.execute(`
  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price_at_time REAL NOT NULL
  )
`);

const seedProducts = [
  {
    name: "Signature Espresso",
    description: "A bold double shot with notes of dark chocolate and caramel, pulled to perfection.",
    price: 3.5,
    category: "drink" as const,
    imageUrl: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&q=80",
    inStock: true,
  },
  {
    name: "Oat Milk Latte",
    description: "Silky oat milk steamed to a velvety foam, poured over our house espresso blend.",
    price: 5.5,
    category: "drink" as const,
    imageUrl: "https://images.unsplash.com/photo-1561047029-3000c68339ca?w=800&q=80",
    inStock: true,
  },
  {
    name: "Cold Brew Reserve",
    description: "Steeped 18 hours in cold water. Smooth, low-acid, dangerously drinkable.",
    price: 5.0,
    category: "drink" as const,
    imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80",
    inStock: true,
  },
  {
    name: "Honey Matcha Latte",
    description: "Ceremonial grade matcha whisked with warm oat milk and a touch of local wildflower honey.",
    price: 6.0,
    category: "drink" as const,
    imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80",
    inStock: true,
  },
  {
    name: "Cappuccino",
    description: "Equal parts espresso, steamed milk, and thick microfoam. Classic and uncompromising.",
    price: 4.5,
    category: "drink" as const,
    imageUrl: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=800&q=80",
    inStock: true,
  },
  {
    name: "Iced Caramel Macchiato",
    description: "Vanilla syrup, cold milk, espresso, and our house caramel drizzle over ice.",
    price: 6.0,
    category: "drink" as const,
    imageUrl: "https://images.unsplash.com/photo-1485808191679-5f86510bd9d4?w=800&q=80",
    inStock: true,
  },
  {
    name: "Butter Croissant",
    description: "Laminated in 48 layers of premium French butter. Flaky, golden, and still warm.",
    price: 4.0,
    category: "snack" as const,
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80",
    inStock: true,
  },
  {
    name: "Almond Cardamom Muffin",
    description: "Moist almond meal base with ground cardamom and a toasted almond crust.",
    price: 4.5,
    category: "snack" as const,
    imageUrl: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=800&q=80",
    inStock: true,
  },
  {
    name: "Dark Chocolate Brownie",
    description: "70% single-origin dark chocolate, fudgy center, crinkled top. No compromises.",
    price: 4.0,
    category: "snack" as const,
    imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80",
    inStock: true,
  },
  {
    name: "Avocado Toast",
    description: "Sourdough, smashed avocado, flaked sea salt, chili flakes, and a drizzle of olive oil.",
    price: 8.5,
    category: "snack" as const,
    imageUrl: "https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=800&q=80",
    inStock: true,
  },
];

// Check if already seeded
const existing = await db.select().from(products);
if (existing.length > 0) {
  console.log(`Database already has ${existing.length} products. Skipping seed.`);
  process.exit(0);
}

console.log("Seeding database...");
for (const product of seedProducts) {
  await db.insert(products).values({
    ...product,
    createdAt: new Date().toISOString(),
  });
}
console.log(`Seeded ${seedProducts.length} products successfully!`);
