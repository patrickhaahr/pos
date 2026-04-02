import { getOrders } from "@/actions/orders";
import OrdersClient from "./OrdersClient";
import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  return (
    <AdminShell>
      <OrdersClient initialOrders={orders} />
    </AdminShell>
  );
}
