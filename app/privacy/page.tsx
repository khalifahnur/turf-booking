import React from "react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";

export const metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f8f5f2] text-[#2c2825] flex flex-col font-playfair pt-10 md-pt-0">
      <Navbar />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-16 lg:py-24 ">
        <h1 className="text-4xl md:text-5xl font-playfair font-semibold mb-8 text-[#2d2926]">
          Privacy Policy
        </h1>
        
        <div className="space-y-8 text-[#5b4543] text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="text-2xl font-playfair font-semibold mb-4 text-[#2d2926]">1. Introduction</h2>
            <p>
              Welcome to our Privacy Policy. This policy explains how we collect, use, and protect your personal information when you use our services. We are committed to ensuring your privacy and data security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-semibold mb-4 text-[#2d2926]">2. Information We Collect</h2>
            <p>
              We may collect personal data such as your name, email address, phone number, and payment details when you book a pitch or interact with our platform. This information is strictly used for the provision of our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-semibold mb-4 text-[#2d2926]">3. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To process and manage your bookings.</li>
              <li>To communicate with you regarding your reservations.</li>
              <li>To improve our website and services based on user feedback.</li>
              <li>To comply with legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-semibold mb-4 text-[#2d2926]">4. Data Protection</h2>
            <p>
              We implement reasonable security measures to protect your personal data from unauthorized access, alteration, disclosure, or destruction. We do not sell or share your information with third parties without your explicit consent, except as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-semibold mb-4 text-[#2d2926]">5. Contact Us</h2>
            <p>
              If you have any questions or concerns about our Privacy Policy, please reach out to us via the contact information provided on our website.
            </p>
          </section>
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
