import { CartProvider } from "@/components/store/CartContext";
import Header from "@/components/store/Header";
import CartDrawer from "@/components/store/CartDrawer";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <Header />
      <CartDrawer />
      <main>{children}</main>
    </CartProvider>
  );
}
