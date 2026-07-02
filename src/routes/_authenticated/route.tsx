import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getAdminSessionFn } from "@/lib/api";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const session = await getAdminSessionFn();
    if (!session || !session.isAdmin) throw redirect({ to: "/auth" });
    return { user: session.user, isAdmin: session.isAdmin };
  },
  component: () => <Outlet />,
});
