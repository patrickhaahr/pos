"use server";

import { db } from "@/lib/db";
import { orders, orderItems, products } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/session";
import { revalidatePath } from "next/cache";

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

export async function createOrder(
  customerName: string,
  customerEmail: string,
  cartItems: CartItem[]
) {
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const [order] = await db
    .insert(orders)
    .values({
      customerName,
      customerEmail,
      total,
      status: "pending",
      createdAt: new Date().toISOString(),
    })
    .returning();

  await db.insert(orderItems).values(
    cartItems.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      priceAtTime: item.price,
    }))
  );

  revalidatePath("/admin/orders");
  return { success: true, orderId: order.id };
}

export async function getOrders() {
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function getOrderWithItems(orderId: number) {
  const order = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!order[0]) return null;

  const items = await db
    .select({
      id: orderItems.id,
      quantity: orderItems.quantity,
      priceAtTime: orderItems.priceAtTime,
      productName: products.name,
      productId: orderItems.productId,
    })
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId))
    .leftJoin(products, eq(orderItems.productId, products.id));

  return { order: order[0], items };
}

export async function updateOrderStatus(
  orderId: number,
  status: "pending" | "completed" | "cancelled"
) {
  const session = await requireAdmin();
  if (!session) return { error: "Unauthorized" };

  await db.update(orders).set({ status }).where(eq(orders.id, orderId));
  revalidatePath("/admin/orders");
  return { success: true };
}
