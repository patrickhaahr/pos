import { getProducts } from "@/actions/products";
import { requireAdmin } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const products = await getProducts();
  return NextResponse.json(products);
}
