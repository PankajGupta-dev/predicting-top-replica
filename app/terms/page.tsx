import { Metadata } from "next";
import { NavigationHeader } from "@/components/layout/NavigationHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { TermsContent } from "@/components/terms/TermsContent";

export const metadata: Metadata = {
  title: "Terms of Service | predicting.top",
  description: "Terms of Service and legal disclaimers for predicting.top.",
  openGraph: {
    title: "Terms of Service | predicting.top",
    description: "Terms of Service and legal disclaimers for predicting.top.",
    type: "website",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <NavigationHeader showBackButton={true} backHref="/" backLabel="Back" />
        <main className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6">
          <TermsContent />
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
