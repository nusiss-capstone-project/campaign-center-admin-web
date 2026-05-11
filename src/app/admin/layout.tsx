import { CampaignCenterSidebar } from "@/components/admin/campaign-center-sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="dark flex min-h-dvh bg-zinc-950 text-zinc-50 antialiased">
      <CampaignCenterSidebar />
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col bg-zinc-950">
        {children}
      </div>
    </div>
  );
}
