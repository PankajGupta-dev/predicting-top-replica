import { Metadata } from "next";
import { NavigationHeader } from "@/components/layout/NavigationHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SubmitForm } from "@/components/submit/SubmitForm";

export const metadata: Metadata = {
  title: "Get Listed — Submit Your Polymarket or Kalshi Account | predicting.top",
  description:
    "Submit your prediction market wallet or Kalshi account to get tracked and listed on the predicting.top leaderboard.",
  openGraph: {
    title: "Get Listed — Submit Your Polymarket or Kalshi Account | predicting.top",
    description:
      "Submit your prediction market wallet or Kalshi account to get tracked and listed on the predicting.top leaderboard.",
    type: "website",
  },
};

export default function SubmitPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <NavigationHeader showBackButton={true} backHref="/" backLabel="Back" />
        <main className="w-full max-w-xl mx-auto px-4 sm:px-6 py-8">
          <SubmitForm />
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
