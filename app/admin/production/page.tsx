import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminProductionQueue } from "@/components/admin/admin-production-queue";
import { adminProductionQueue } from "@/data/admin";

export default function AdminProductionPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader title="Production queue" description="Jobs that are approved, printing, finishing, or waiting on dispatch." />
      <AdminProductionQueue jobs={adminProductionQueue} />
    </div>
  );
}
