import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { settingsQuery } from "@/lib/queries";
import { adminSaveSettingsFn } from "@/lib/api";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  loader: ({ context }) => context.queryClient.ensureQueryData(settingsQuery),
  component: AdminSettings,
});

function AdminSettings() {
  const { data: settings } = useSuspenseQuery(settingsQuery);
  const qc = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data: any) => adminSaveSettingsFn({ data }),
    onSuccess: () => {
      toast.success("Settings saved");
      qc.invalidateQueries({ queryKey: ["store_settings"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    updateMutation.mutate(data);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl">Settings</h1>
      <p className="text-muted-foreground mt-1 mb-8">Manage store configuration.</p>

      <form onSubmit={submit} className="bg-background border rounded-sm p-6 space-y-6">
        <div className="space-y-4">
          <h2 className="font-display text-xl">General</h2>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Store Name</label>
            <input name="store_name" defaultValue={settings.store_name} required className="w-full border-b py-2 focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
              <input type="email" name="email" defaultValue={settings.email} required className="w-full border-b py-2 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Phone</label>
              <input name="phone" defaultValue={settings.phone} required className="w-full border-b py-2 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">WhatsApp Number</label>
            <input name="whatsapp" defaultValue={settings.whatsapp} required className="w-full border-b py-2 focus:outline-none" />
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t">
          <h2 className="font-display text-xl">Shipping & Fees</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Standard Shipping Fee (PKR)</label>
              <input type="number" name="shipping_fee" defaultValue={settings.shipping_fee} required className="w-full border-b py-2 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Free Shipping Over (PKR)</label>
              <input type="number" name="free_shipping_over" defaultValue={settings.free_shipping_over} required className="w-full border-b py-2 focus:outline-none" />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t flex justify-end">
          <button disabled={updateMutation.isPending} className="bg-foreground text-background px-8 py-3 text-xs uppercase tracking-widest hover:bg-primary disabled:opacity-50">Save Settings</button>
        </div>
      </form>
    </div>
  );
}
