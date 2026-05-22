import { cn } from "@/lib/utils";

export function AdminTable({
  columns,
  rows,
  emptyLabel = "No records to show yet.",
}: {
  columns: string[];
  rows: React.ReactNode[][];
  emptyLabel?: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-line text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th key={column} scope="col" className="px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-slate">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.length ? (
              rows.map((row, index) => (
                <tr key={index} className="transition hover:bg-brand-soft/20">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className={cn("px-4 py-4 align-top", cellIndex === 0 && "font-bold text-ink")}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-sm font-bold text-slate">
                  {emptyLabel}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminFilterBar({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-line/80 bg-white p-4 shadow-soft md:flex-row md:items-center md:justify-between">
      <label className="sr-only" htmlFor="admin-search">
        Search admin records
      </label>
      <input
        id="admin-search"
        type="search"
        placeholder="Search customers, order numbers, services..."
        className="min-h-11 rounded-xl border border-line bg-white px-4 text-sm font-bold text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15 md:min-w-80"
      />
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
