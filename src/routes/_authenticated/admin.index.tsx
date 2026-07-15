import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getAdminStatsFn } from "@/lib/api";
import { queryOptions } from "@tanstack/react-query";
import { useState, useMemo, useRef, useEffect } from "react";
import { Calendar, X } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

export const adminStatsQuery = queryOptions({
  queryKey: ["admin_stats"],
  queryFn: async () => getAdminStatsFn(),
});

export const Route = createFileRoute("/_authenticated/admin/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(adminStatsQuery),
  component: AdminDashboard,
});

// 🟢 Inline DatePicker component — isi file ke andar
function StyledDatePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedDate = value ? new Date(value + "T00:00:00") : undefined;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDisplay = (d: Date) =>
    d.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5 h-12 rounded-xl border border-border bg-background px-4 pr-3 text-sm font-medium transition-all duration-300 hover:border-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-[220px]"
      >
        <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className={selectedDate ? "text-foreground" : "text-muted-foreground"}>
          {selectedDate ? formatDisplay(selectedDate) : "Select a date"}
        </span>
        {value && (
          <span
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            className="ml-auto h-6 w-6 rounded-full bg-muted hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center shrink-0"
          >
            <X className="h-3.5 w-3.5" />
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 z-50 w-[320px] rounded-xl border border-border bg-background shadow-2xl p-4"
          style={{
            ["--rdp-accent-color" as any]: "var(--foreground)",
            ["--rdp-accent-background-color" as any]: "var(--muted)",
            ["--rdp-selected-color" as any]: "var(--background)",
            ["--rdp-today-color" as any]: "var(--primary)",
            ["--rdp-outline" as any]: "none",
            ["--rdp-outline-selected" as any]: "none",
          }}
        >
          <DayPicker
            mode="single"
            selected={selectedDate}
            captionLayout="dropdown"
            startMonth={new Date(new Date().getFullYear() - 3, 0)}
            endMonth={new Date()}
            onSelect={(d) => {
              if (d) {
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                onChange(key);
              }
              setOpen(false);
            }}
            classNames={{
              months: "flex",
              month: "space-y-3 w-full",
              month_caption: "flex justify-center items-center h-9 relative mb-1",
              caption_label: "text-sm font-semibold",
              dropdowns: "flex items-center gap-2",
              dropdown: "text-sm font-medium bg-muted border border-input rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer",
              nav: "flex items-center justify-between absolute inset-x-0 top-0 px-1",
              button_previous: "h-7 w-7 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-foreground disabled:opacity-30",
              button_next: "h-7 w-7 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-foreground disabled:opacity-30",
              month_grid: "w-full border-collapse mt-2",
              weekdays: "flex",
              weekday: "text-muted-foreground w-9 h-9 font-medium text-[11px] uppercase tracking-wide flex items-center justify-center",
              week: "flex w-full mt-1",
              day: "text-center text-sm p-0 relative w-9 h-9",
              day_button: "h-9 w-9 rounded-lg font-medium hover:bg-muted transition-colors flex items-center justify-center",
              selected: "[&>button]:bg-foreground [&>button]:text-background [&>button]:hover:bg-foreground [&>button]:hover:text-background",
              today: "[&>button]:border [&>button]:border-primary [&>button]:text-primary [&>button]:font-bold",
              outside: "[&>button]:text-muted-foreground/40",
              disabled: "[&>button]:text-muted-foreground/30",
            }}
          />
        </div>
      )}
    </div>
  );
}

function AdminDashboard() {
  const { data: stats } = useSuspenseQuery(adminStatsQuery);

  const [selectedDate, setSelectedDate] = useState<string>("");

  const toDateKey = (d: any) => new Date(d).toISOString().split("T")[0];

  const dateFilteredOrders = useMemo(() => {
    if (!selectedDate) return stats.orders;
    return stats.orders.filter((o: any) => toDateKey(o.createdAt || o.created_at) === selectedDate);
  }, [stats.orders, selectedDate]);

  const revenue = stats.orders.filter(o => o.status !== "cancelled").reduce((acc, o) => acc + o.total, 0);
  const pendingOrders = stats.orders.filter(o => o.status === "pending").length;

  const dateRevenue = dateFilteredOrders
    .filter((o: any) => o.status !== "cancelled")
    .reduce((acc: number, o: any) => acc + o.total, 0);
  const dateOrderCount = dateFilteredOrders.length;

  return (
    <div>
      <h1 className="font-display text-3xl">Dashboard</h1>
      <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
        Welcome to your GrandDecore admin control room. Here you can track real-time store performance,
        monitor your incoming sales revenue, and manage customer orders efficiently to ensure timely deliveries.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="bg-background border p-6 rounded-sm shadow-xs">
          <p className="text-xs uppercase tracking-widest  text-primary font-bold">Total Revenue</p>
          <p className="font-sans mt-3 text-black">
            <span className="text-sm font-normal tracking-wide mr-1">PKR</span>
            <span className="text-2xl font-bold">{revenue.toLocaleString()}</span>
          </p>
        </div>

        <div className="bg-background border p-6 rounded-sm">
          <p className="text-xs uppercase tracking-widest text-[red] font-bold">Total Orders</p>
          <p className="font-sans text-2xl mt-3 font-bold text-black">
            {stats.orders.length}
          </p>
        </div>

        <div className="bg-background border p-6 rounded-sm">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Pending Orders</p>
          <p className="font-sans text-2xl mt-3 font-bold text-primary">
            {pendingOrders}
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-gradient-to-br from-background via-background to-muted/20 shadow-lg">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 p-6 border-b border-border rounded-t-2xl">

          <div className="flex items-center gap-4">
            {/* <div className="h-12 w-12 rounded-xl bg-foreground text-background flex items-center justify-center shadow-md">
              <Calendar className="h-5 w-5" />
            </div> */}

            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Revenue Analytics
              </h2>
              <p className="text-sm text-muted-foreground">
                Track orders & revenue for a specific date
              </p>
            </div>
          </div>

          <StyledDatePicker value={selectedDate} onChange={setSelectedDate} />

        </div>

        <div className="p-6 rounded-b-2xl overflow-hidden">

          {selectedDate ? (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="group rounded-2xl border border-border bg-gradient-to-br from-muted/40 to-background p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                      Total Orders
                    </p>

                    <h3 className="mt-2 text-4xl font-bold">
                      {dateOrderCount}
                    </h3>

                    <p className="mt-2 text-sm text-muted-foreground">
                      {new Date(selectedDate).toLocaleDateString()}
                    </p>

                  </div>

                  <div className="h-14 w-14 rounded-xl bg-foreground text-background flex items-center justify-center group-hover:scale-110 transition">
                    <Calendar className="h-6 w-6" />
                  </div>

                </div>

              </div>

              <div className="group rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-background p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs uppercase tracking-[0.25em] text-primary">
                      Total Revenue
                    </p>

                    <div className="mt-2 flex items-end gap-2">

                      <span className="text-base font-medium text-primary">
                        PKR
                      </span>

                      <span className="text-4xl font-bold">
                        {dateRevenue.toLocaleString()}
                      </span>

                    </div>

                    <p className="mt-2 text-sm text-muted-foreground">
                      {new Date(selectedDate).toLocaleDateString()}
                    </p>

                  </div>

                </div>

              </div>

            </div>

          ) : (

            <div className="flex flex-col items-center justify-center text-center py-14 border-2 border-dashed border-border rounded-2xl bg-muted/20">

              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-5">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>

              <h3 className="text-lg font-semibold">
                No Date Selected
              </h3>

              <p className="mt-2 text-sm text-muted-foreground max-w-md">
                Select a date from above to view the total orders and revenue
                generated on that day.
              </p>

            </div>

          )}

        </div>

      </div>
    </div>
  );
}