import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminWorkflowAudit } from "@/components/admin/admin-workflow-audit";
import { adminWorkflowAudit } from "@/data/admin";

export default function AdminOptimizationPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader title="Optimization" description="Workflow improvements staged for the current admin model." />
      <AdminWorkflowAudit items={adminWorkflowAudit} />
    </div>
  );
}
