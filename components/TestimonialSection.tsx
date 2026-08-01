"use client";

import { useState } from "react";

const TESTIMONIALS = [
  {
    id: 1,
    quote: "Best courts in the city",
    body: "I absolutely love playing here! The courts are always in excellent condition, and the location is super convenient. It's the perfect spot to unwind and enjoy a great game every weekend.",
    author: "Samantha L.",
    role: "Business person",
    avatar: "https://i.pravatar.cc/80?img=33",
    image:
      "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=900&q=80&auto=format&fit=crop",
  },
  {
    id: 2,
    quote: "World-class facilities",
    body: "The pitch quality is unmatched anywhere in Nairobi. The M-Pesa booking system makes it incredibly easy to reserve a slot. Our team comes here every week without fail.",
    author: "James M.",
    role: "Team Captain",
    avatar: "https://i.pravatar.cc/80?img=11",
    image:
      "https://images.unsplash.com/photo-1584120075590-9876c53cb48c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);

  const prev = () =>
    setActive((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () =>
    setActive((i) => (i + 1) % TESTIMONIALS.length);

  const t     = TESTIMONIALS[active];
  const nextT = TESTIMONIALS[(active + 1) % TESTIMONIALS.length];

  return (
    <section
      id="testimonials"
      className="bg-white py-20 lg:py-28 overflow-hidden"
      aria-label="Testimonials"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex items-end justify-between mb-12 sm:mb-14">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-gray-400 border border-gray-200 rounded-full px-3.5 py-1 mb-5">
              Testimonials
            </span>
            <h2
              className="font-playfair font-semibold text-gray-900 leading-tight"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              What Our Players Say
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-3 pb-1.5">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-400 hover:text-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next testimonial"
              className="w-12 h-12 rounded-full flex items-center justify-center text-white hover:scale-105 transition-transform"
              style={{ backgroundColor: "#88b03f" }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div
            className="lg:col-span-5 xl:col-span-5 overflow-hidden rounded-2xl bg-gray-100 shrink-0"
            style={{ height: "clamp(260px, 40vw, 460px)" }}
          >
            <img
              key={t.id}
              src={t.image}
              alt=""
              className="w-full h-full object-cover object-center transition-opacity duration-500"
            />
          </div>

          <div className="lg:col-span-5 xl:col-span-5 lg:px-6 xl:px-10">
            <div
              className="font-serif leading-none mb-3 select-none"
              style={{
                fontSize: "clamp(4rem, 8vw, 6rem)",
                color: "#e5e7eb",
              }}
              aria-hidden="true"
            >
              &quot;
            </div>

            <h3 className="text-2xl sm:text-3xl font-playfair font-semibold text-gray-900 mb-5 leading-tight">
              {t.quote}
            </h3>

            <p className="text-gray-500 leading-relaxed text-[15px] sm:text-base">
              {t.body}
            </p>

            <div className="flex items-center gap-4 mt-8">
              <img
                src={t.avatar}
                alt={t.author}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 shrink-0"
              />
              <div>
                <p className="font-bold text-gray-900 text-[15px] leading-tight">
                  {t.author}
                </p>
                <p className="text-sm text-gray-400 mt-0.5">{t.role}</p>
              </div>
            </div>
          </div>

          <div className="hidden xl:block xl:col-span-2 overflow-hidden rounded-xl opacity-45 bg-gray-100"
               style={{ height: 300 }}>
            <img
              src={nextT.image}
              alt=""
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        <div className="flex sm:hidden items-center justify-center gap-3 mt-10">
          <button
            onClick={prev}
            aria-label="Previous testimonial"
            className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Next testimonial"
            className="w-12 h-12 rounded-full flex items-center justify-center text-white"
            style={{ backgroundColor: "#88b03f" }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}