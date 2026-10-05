import { CONTACT_EMAIL, Page } from "@/components/site";

export default function Privacy() {
  return (
    <Page seo={{ title: "Privacy Notice", description: "How Net Zero International collects and uses personal information submitted through this website.", canonical: "/privacy" }}>
      <div className="container-narrow py-14 md:py-20">
        <p className="eyebrow mb-4">Privacy</p>
        <h1 className="h-display">Privacy notice</h1>
        <div className="article mt-10">
          <p>This notice explains what personal information Net Zero International collects through this website, why, and what your rights are.</p>
          <h2>What we collect</h2>
          <p>We only collect the information you choose to send us:</p>
          <ul>
            <li><strong>Enquiry form:</strong> your name, email address, organisation and phone number (if given), the service you are interested in and your message.</li>
            <li><strong>Training booking form:</strong> your name, email address, organisation, job title and phone number (if given), the number of participants and any requirements you tell us about.</li>
          </ul>
          <p>This website does not use advertising or tracking cookies.</p>
          <h2>How we use it</h2>
          <p>We use your information to reply to your enquiry, to arrange and administer training you have booked, and to keep a record of that correspondence. Our lawful basis is our legitimate interest in responding to people who contact us and, for bookings, taking steps to enter into a contract with you.</p>
          <p>We do not sell your information or share it for marketing. It is processed on our behalf by the companies that host this website and deliver our email.</p>
          <h2>How long we keep it</h2>
          <p>We keep enquiry and booking records for as long as needed to deal with your request and to meet our legal and accounting obligations, then delete them.</p>
          <h2>Your rights</h2>
          <p>Under UK data protection law you can ask us for a copy of your information, ask us to correct or delete it, and object to or restrict how we use it. To do so, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
          <p>If you are unhappy with how we have handled your information you can complain to the Information Commissioner's Office at <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">ico.org.uk</a>.</p>
          <h2>Contact</h2>
          <p>Net Zero International is the controller of your information. Contact us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
        </div>
      </div>
    </Page>
  );
}
