import { Metadata } from "next";
import { NavigationHeader } from "@/components/layout/NavigationHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ApiDocsView } from "@/components/docs/ApiDocsView";

export const metadata: Metadata = {
  title: "Free Prediction Market API — Polymarket & Kalshi Trader Data | predicting.top",
  description:
    "Free read-only JSON API for Polymarket and Kalshi leaderboards, trader profiles, positions, and trades. CORS enabled, no API key required.",
  openGraph: {
    title: "Free Prediction Market API — Polymarket & Kalshi Trader Data | predicting.top",
    description:
      "Free read-only JSON API for Polymarket and Kalshi leaderboards, trader profiles, positions, and trades. CORS enabled, no API key required.",
    type: "website",
  },
};

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <NavigationHeader showBackButton={true} backHref="/" backLabel="Back" />
        <main className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6">
          <ApiDocsView />
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
