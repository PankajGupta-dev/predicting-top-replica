import React from "react";

export function TermsContent() {
  return (
    <article className="w-full max-w-2xl mx-auto space-y-6 pb-12 text-foreground">
      {/* Title & Last Updated */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-foreground">
          Terms of Service
        </h1>
        <p className="text-xs text-muted-foreground">
          Last updated: December 29, 2025
        </p>
      </div>

      {/* Sections */}
      <section className="space-y-6 text-xs sm:text-sm text-muted-foreground leading-relaxed">
        <div>
          <h2 className="text-sm sm:text-base font-semibold text-foreground mb-1.5">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using Predicting.top (&ldquo;the Site&rdquo;), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Site.
          </p>
        </div>

        <div>
          <h2 className="text-sm sm:text-base font-semibold text-foreground mb-1.5">
            2. Informational Purposes Only
          </h2>
          <p>
            The Site displays publicly available trading data and statistics from prediction markets. All information is provided for <strong className="text-foreground font-medium">informational and entertainment purposes only</strong>. The Site does not provide financial, investment, legal, or tax advice.
          </p>
        </div>

        <div>
          <h2 className="text-sm sm:text-base font-semibold text-foreground mb-1.5">
            3. No Financial Advice
          </h2>
          <p>
            Nothing on this Site constitutes a recommendation to buy, sell, or hold any financial instrument or to engage in any trading strategy. Past performance of any trader shown on the Site is not indicative of future results. You should consult a qualified financial advisor before making any investment decisions.
          </p>
        </div>

        <div>
          <h2 className="text-sm sm:text-base font-semibold text-foreground mb-1.5">
            4. No Warranty
          </h2>
          <p>
            The Site is provided &ldquo;as is&rdquo; without warranties of any kind, either express or implied. We do not guarantee the accuracy, completeness, reliability, or timeliness of any data displayed. Trading data may be delayed, incomplete, or contain errors. We make no representations about the suitability of this information for any purpose.
          </p>
        </div>

        <div>
          <h2 className="text-sm sm:text-base font-semibold text-foreground mb-1.5">
            5. Limitation of Liability
          </h2>
          <p>
            To the fullest extent permitted by law, Predicting.top and its operators shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of the Site, reliance on any information provided, or any trading decisions you make. This includes, but is not limited to, loss of profits, data, or other intangible losses.
          </p>
        </div>

        <div>
          <h2 className="text-sm sm:text-base font-semibold text-foreground mb-1.5">
            6. Third-Party Links
          </h2>
          <p>
            The Site contains links to third-party websites, including but not limited to Polymarket and Kalshi. We are not responsible for the content, terms, privacy practices, or actions of these third-party sites. Your use of third-party platforms is at your own risk and subject to their respective terms of service.
          </p>
        </div>

        <div>
          <h2 className="text-sm sm:text-base font-semibold text-foreground mb-1.5">
            7. Changes to Terms
          </h2>
          <p>
            We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to the Site. Your continued use of the Site following the posting of revised terms constitutes your acceptance of the changes.
          </p>
        </div>

        <div>
          <h2 className="text-sm sm:text-base font-semibold text-foreground mb-1.5">
            8. Contact
          </h2>
          <p>
            For questions about these Terms of Service, please contact us on X at{" "}
            <a
              href="https://x.com/HiveLiveHQ"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              @HiveLiveHQ
            </a>
            .
          </p>
        </div>
      </section>
    </article>
  );
}
