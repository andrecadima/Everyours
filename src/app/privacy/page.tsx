import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        This is a placeholder while our full policy is reviewed by counsel. It describes what this preview actually does.
      </p>
      <h2>What we collect</h2>
      <p>
        When you tell us you&rsquo;re interested in a lot, we store your name, email, phone number, country, preferred
        contact method, optional budget range and message, the lot you chose, and the time you gave consent.
      </p>
      <h2>What we don&rsquo;t collect</h2>
      <p>
        We never ask for payment details, Social Security numbers, identity documents, or bank information through this
        site. We don&rsquo;t store your IP address with your inquiry.
      </p>
      <h2>How we use it</h2>
      <p>Only to contact you about the property and your inquiry. We don&rsquo;t sell your information.</p>
      <h2>Your choices</h2>
      <p>You can ask us to delete your information at any time by replying to any message from our team.</p>
    </LegalPage>
  );
}
