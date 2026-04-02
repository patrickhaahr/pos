import Sidebar from "./Sidebar";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-espresso)" }}
    >
      <Sidebar />
      <div className="pl-64">
        <main className="min-h-screen p-8">{children}</main>
      </div>
    </div>
  );
}
