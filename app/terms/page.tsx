import React from "react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";

export const metadata = {
  title: "Terms and Conditions",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f8f5f2] text-[#2c2825] flex flex-col font-playfair pt-10 md-pt-0">
      <Navbar />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-16 lg:py-24">
        <h1 className="text-4xl md:text-5xl font-playfair font-semibold mb-8 text-[#2d2926]">
          Terms & Conditions
        </h1>
        
        <div className="space-y-8 text-[#5b4543] text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="text-2xl font-playfair font-semibold mb-4 text-[#2d2926]">1. Acceptance of Terms</h2>
            <p>
              By accessing and using our booking platform, you accept and agree to be bound by the terms and conditions outlined here. If you disagree with any part of these terms, you may not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-semibold mb-4 text-[#2d2926]">2. Bookings and Payments</h2>
            <p>
              All bookings are subject to availability. Payment must be made in full at the time of booking to secure your reservation. Payments are processed securely via M-Pesa or other accepted payment methods.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-semibold mb-4 text-[#2d2926]">3. Cancellations and Refunds</h2>
            <p>
              Cancellations made within 24 hours of the booked time are non-refundable. For cancellations made before the 24-hour window, you may be eligible for a partial or full refund subject to management approval.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-semibold mb-4 text-[#2d2926]">4. Facility Rules</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Appropriate sports attire and non-marking shoes must be worn on the pitch.</li>
              <li>No food, alcohol, or glass containers are allowed on the turf.</li>
              <li>Players must respect the scheduled time limits and vacate the pitch promptly for the next session.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-semibold mb-4 text-[#2d2926]">5. Liability</h2>
            <p>
              We are not liable for any injuries, losses, or damages that occur while using our facilities. Players participate at their own risk and are encouraged to ensure they are physically fit to play.
            </p>
          </section>
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
