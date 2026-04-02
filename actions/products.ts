"use server";

import { db } from "@/lib/db";
import { products, type NewProduct } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function getProducts() {
  return db.select().from(products).orderBy(products.createdAt);
}

export async function getProductById(id: number) {
  const result = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  return result[0] ?? null;
}

export async function createProduct(data: Omit<NewProduct, "id" | "createdAt">) {
  const session = await requireAdmin();
  if (!session) return { error: "Unauthorized" };

  await db.insert(products).values({
    ...data,
    createdAt: new Date().toISOString(),
  });
  revalidatePath("/");
  revalidatePath("/admin/products");
  return { success: true };
}

export async function updateProduct(
  id: number,
  data: Partial<Omit<NewProduct, "id" | "createdAt">>
) {
  const session = await requireAdmin();
  if (!session) return { error: "Unauthorized" };

  await db.update(products).set(data).where(eq(products.id, id));
  revalidatePath("/");
  revalidatePath("/admin/products");
  return { success: true };
}

export async function deleteProduct(id: number) {
  const session = await requireAdmin();
  if (!session) return { error: "Unauthorized" };

  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/");
  revalidatePath("/admin/products");
  return { success: true };
}
