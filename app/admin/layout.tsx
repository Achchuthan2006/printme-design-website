import type { Metadata } from "next";
import { ProtectedAdmin } from "@/components/admin/protected-admin";

export const metadata: Metadata = {
  title: "Admin Operations",
  description: "Internal PrintMe operations dashboard for orders, quotes, uploads, customers, invoices, and status workflows.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedAdmin>{children}</ProtectedAdmin>;
}
