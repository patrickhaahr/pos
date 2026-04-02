import { getProducts } from "@/actions/products";
import ProductsClient from "./ProductsClient";
import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getProducts();
  return (
    <AdminShell>
      <ProductsClient initialProducts={products} />
    </AdminShell>
  );
}
