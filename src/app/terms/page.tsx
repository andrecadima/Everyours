import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms">
      <p>This is a placeholder while our full terms are reviewed by counsel.</p>
      <h2>Demo listings</h2>
      <p>
        This preview shows fictional demonstration listings. Lots, prices, payment plans, and coordinates are
        illustrative and are not offers to sell.
      </p>
      <h2>Inquiries</h2>
      <p>
        Sending your details is an inquiry. It does not reserve, hold, or purchase any land, and it does not create any
        financing commitment. Final terms are confirmed in writing by the Everyours team.
      </p>
      <h2>No financial promises</h2>
      <p>
        Everyours does not promise investment returns, appreciation, income, residency, or visas. Land ownership involves
        costs and risks you should consider carefully.
      </p>
    </LegalPage>
  );
}
