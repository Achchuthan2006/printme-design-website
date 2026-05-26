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
    <div className="overflow-hidden rounded-[1.7rem] border border-white/75 bg-white/88 shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_18px_36px_rgba(18,17,16,0.07)]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-line text-left text-sm">
          <thead className="bg-[linear-gradient(180deg,rgba(248,244,239,0.92),rgba(255,255,255,0.7))]">
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
                <tr key={index} className="transition hover:bg-brand-soft/18">
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
    <div className="hero-panel flex flex-col gap-3 rounded-[1.7rem] p-4 md:flex-row md:items-center md:justify-between">
      <label className="sr-only" htmlFor="admin-search">
        Search admin records
      </label>
      <input
        id="admin-search"
        type="search"
        placeholder="Search customers, order numbers, services..."
        className="premium-input min-h-11 md:min-w-80"
      />
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
