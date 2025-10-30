import { LayoutProvider } from "@/components/shared/layout.provider";
import { AuthProvider } from "@/features/auth";
import { SummaryPage } from "@/features/summary/components/summary.page";

export default async function Home() {
  return (
    <AuthProvider>
      <LayoutProvider className="flex-col absolute inset-0">
        <SummaryPage />
      </LayoutProvider>
    </AuthProvider>
  );
}
