import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Search, Package, Truck, CheckCircle2, ExternalLink, ChevronDown, ClipboardList } from "lucide-react";
import { StoreLayout } from "@/components/storefront/layout";
import { trackOrderFn } from "@/lib/api";

export const Route = createFileRoute("/track-order")({
  head: () => ({ meta: [{ title: "Track Order — GrandDecore" }] }),
  component: TrackOrderPage,
});

const COURIER_OPTIONS = [
  { id: "leopards", name: "Leopards Courier" },
  { id: "tcs", name: "TCS Express" },
  { id: "postex", name: "PostEx" },
];

function TrackOrderPage() {
  // 🟢 Tabs Toggle State: 'order' (Database) or 'courier' (Direct Live)
  const [activeTab, setActiveTab] = useState<"order" | "courier">("order");

  // Tab 1 States (Aapka original flow)
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);

  // Tab 2 States (Direct Live Courier)
  const [courier, setCourier] = useState("leopards");
  const [trackingId, setTrackingId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Dropdown close handler click outside par
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Aapka original exact submittion logic
  const handleOrderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setOrder(null);
    const fd = new FormData(e.currentTarget);
    const orderNumber = fd.get("orderNumber") as string;
    const phone = fd.get("phone") as string;

    try {
      const res = await trackOrderFn({ data: { orderNumber, phone } });
      if (!res) throw new Error("Order not found. Please check your details.");
      setOrder(res);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } {
      setLoading(false);
    }
  };

  // Direct Courier Form Handler
  const handleCourierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    window.open(getCourierLink(courier, trackingId), "_blank", "noopener,noreferrer");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered": return <CheckCircle2 className="h-8 w-8 text-black" />;
      case "shipped": return <Truck className="h-8 w-8 text-black" />;
      default: return <Package className="h-8 w-8 text-black" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    const s = status?.toLowerCase() || "";
    const base = "px-3 py-1 text-xs font-bold uppercase tracking-wider border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]";
    if (s === "pending") return `${base} bg-yellow-400 text-black`;
    if (s === "processing") return `${base} bg-purple-400 text-white`;
    if (s === "shipped") return `${base} bg-primary text-black`; // GrandDecore Green
    if (s === "delivered") return `${base} bg-green-500 text-white`;
    return `${base} bg-red-500 text-white`; // Cancelled / Failed
  };

  const getCourierLink = (courierName: string, id: string) => {
    if (!id) return "";
    const name = courierName?.toLowerCase() || "";
    if (name.includes("tcs")) return `https://www.tcsexpress.com/tracking?tracking-number=${id.trim()}`;
    if (name.includes("postex")) return `https://tracking.postex.pk/?track=${id.trim()}`;
    return `https://www.leopardscourier.com/leopards-tracking?tracknum=${id.trim()}`;
  };

  const selectedCourierName = COURIER_OPTIONS.find((c) => c.id === courier)?.name;

  return (
    <StoreLayout>
      <div className="container-x py-24 lg:py-32 max-w-xl mx-auto">

        {/* Header Setup */}
        <div className="text-center mb-10">
          <p className="eyebrow text-primary tracking-[0.2em] uppercase text-xs font-semibold">GrandDecore Atelier</p>
          <h1 className="font-display text-4xl font-normal mt-3 tracking-tight text-foreground">Track Your Piece</h1>
          <p className="mt-4 text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Choose your preferred tracking mode below to get instantaneous delivery status.
          </p>
        </div>

        {/* 🗂️ Luxury Segmented Tabs Control */}
        <div className="grid grid-cols-2 border-2 border-black p-1 bg-white mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] select-none">
          <button
            type="button"
            onClick={() => {
              setActiveTab("order");
              setOrder(null);
            }}
            className={`py-3.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 ${activeTab === "order" ? "bg-black text-white" : "text-black hover:bg-primary/20"
              }`}
          >
            <ClipboardList className="w-4 h-4" /> Order Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("courier")}
            className={`py-3.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 ${activeTab === "courier" ? "bg-black text-white" : "text-black hover:bg-primary/20"
              }`}
          >
            <Truck className="w-4 h-4" /> Direct Courier
          </button>
        </div>

        {/* 📦 TAB 1: ORIGINAL DATABASE ORDER TRACKING */}
        {activeTab === "order" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <form
              onSubmit={handleOrderSubmit}
              className="bg-white border-2 border-black p-8 space-y-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-black block">Order Number</label>
                <input
                  required
                  name="orderNumber"
                  placeholder="e.g. GD-12345"
                  className="w-full bg-white border-2 border-black px-4 py-3.5 text-sm text-black focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-black block">Phone Number</label>
                <input
                  required
                  name="phone"
                  placeholder="03XXXXXXXXX"
                  className="w-full bg-white border-2 border-black px-4 py-3.5 text-sm text-black focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>

              <button
                disabled={loading}
                className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-[0.25em] hover:bg-primary hover:text-black transition-all duration-300 border-2 border-black disabled:opacity-50 flex items-center justify-center gap-2 active:translate-y-0.5"
              >
                <Search className="h-4 w-4 stroke-[2.5]" /> {loading ? "Searching…" : "Track Order"}
              </button>
            </form>

            {/* Premium Output Card */}
            {order && (
              <div className="bg-white border-2 border-black p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-6 animate-in slide-in-from-bottom-3 duration-300">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-dashed border-black/20">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(order.status)}
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Current Status</span>
                      <h2 className="font-display text-xl font-normal capitalize text-black">{order.status}</h2>
                    </div>
                  </div>
                  <div>
                    <span className={getStatusBadgeClass(order.status)}>{order.status}</span>
                  </div>
                </div>

                <p className="text-sm text-black/80 leading-relaxed bg-muted/30 p-4 border border-black/10">
                  {order.status === "pending" && "We have received your order and are preparing it for dispatch."}
                  {order.status === "processing" && "Your piece is being carefully wrapped and packed in our atelier."}
                  {order.status === "shipped" && "Your order is on the way via our delivery partners."}
                  {order.status === "delivered" && "Your order has been delivered. Thank you for shopping with GrandDecore."}
                  {order.status === "cancelled" && "This order has been cancelled."}
                </p>

                {/* Live Courier Sub-section inside order data */}
                {(order.status === "shipped" || order.status === "delivered") && order.trackingNumber && (
                  <div className="p-4 border-2 border-black bg-white space-y-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Assigned Courier</p>
                      <p className="text-sm font-bold font-mono text-black capitalize">
                        {order.courierName || "Partner Network"}: {order.trackingNumber}
                      </p>
                    </div>
                    <a
                      href={getCourierLink(order.courierName, order.trackingNumber)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-black text-white py-3 text-xs font-bold uppercase tracking-[0.2em] hover:bg-primary hover:text-black transition-colors border-2 border-black flex items-center justify-center gap-2 text-center"
                    >
                      Track Live Location <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                {/* Bottom Meta Price Details */}
                <div className="pt-4 border-t border-black/10 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Order Total</p>
                    <p className="font-mono font-bold text-black mt-0.5">PKR {order.total?.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Date Placed</p>
                    <p className="font-medium text-black mt-0.5">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 🚚 TAB 2: DIRECT COURIER LIVE TRACKING */}
        {activeTab === "courier" && (
          <form
            onSubmit={handleCourierSubmit}
            className="bg-white border-2 border-black p-8 md:p-10 space-y-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-in fade-in duration-200"
          >
            {/* Custom Dropdown with Premium Green Hover */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-black block">Select Courier</label>
              <div className="relative" ref={dropdownRef}>
                <div
                  onClick={() => setIsOpen(!isOpen)}
                  className={`w-full bg-white border-2 border-black p-4 text-sm font-medium text-black flex items-center justify-between cursor-pointer transition-colors ${isOpen ? "border-primary ring-1 ring-primary" : "hover:border-primary"
                    }`}
                >
                  <span>{selectedCourierName}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180 text-primary" : "text-black"}`} />
                </div>

                {isOpen && (
                  <div className="absolute z-50 mt-1 w-full bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-in fade-in duration-100">
                    {COURIER_OPTIONS.map((option) => (
                      <div
                        key={option.id}
                        onClick={() => {
                          setCourier(option.id);
                          setIsOpen(false);
                        }}
                        className={`px-4 py-3 text-sm cursor-pointer transition-colors font-medium text-black hover:bg-primary ${courier === option.id ? "bg-muted font-bold border-l-4 border-black" : ""
                          }`}
                      >
                        {option.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Direct Input Field */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-black block">Tracking / Consignment ID</label>
              <input
                required
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="e.g. LE12345678"
                className="w-full bg-white border-2 border-black px-4 py-4 text-sm font-mono text-black placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary hover:border-primary transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-[0.25em] border-2 border-black hover:bg-primary hover:text-black transition-all duration-300 active:translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Search className="h-4 w-4 stroke-[2.5]" /> Launch Official Tracking <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </form>
        )}

      </div>
    </StoreLayout>
  );
}