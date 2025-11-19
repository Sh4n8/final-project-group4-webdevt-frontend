import React, { useState } from "react";
import { ChevronDown, ChevronUp, Mail, MessageCircle, BookOpen, Search } from "lucide-react";
import UserNavBar from "../../components/UserNavBar";

const Help = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const faqs = [
    {
      q: "How do I reset my password?",
      a: "Go to the login page → click “Forgot password?” → enter your email → check your inbox (including spam) for the reset link. The link expires in 30 minutes."
    },
    {
      q: "Why can’t I log in?",
      a: "Common reasons: wrong email/password, account not verified yet (check your email), or you’re logged in on another device. Try “Forgot password?” or contact support."
    },
    {
      q: "How do I delete my account?",
      a: "Settings → Privacy & Safety → Delete Account (at the bottom). This action is permanent after 30 days."
    },
    {
      q: "Is my data private?",
      a: "Yes. We never sell your data. Messages are end-to-end encrypted where applicable. See our full Privacy Policy for details."
    },
    {
      q: "How do I change my email or username?",
      a: "Go to Settings → Account → update the field you want to change. Some changes require email verification."
    },
    {
      q: "I’m not receiving notifications",
      a: "Check your device notification settings, then in-app Settings → Notifications. Also make sure you’re not in Do Not Disturb / Focus mode."
    },
    {
      q: "Can I export my data?",
      a: "Yes! Settings → Privacy & Safety → Download your data. You’ll receive a ZIP file within 24 hours."
    },
    {
      q: "Who can I contact for urgent issues?",
      a: "Use the “Contact Support” button below or email support@yourapp.com — we usually reply within 1–4 hours."
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F5E6D3]">
      <UserNavBar />

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#E8D5BF] to-[#F5E6D3] pt-16 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#5D4E37] mb-4">
            How can we help you?
          </h1>
          <p className="text-xl text-[#8B7355] mb-8">
            Find answers instantly or get in touch with us
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B7355] w-5 h-5" />
            <input
              type="text"
              placeholder="Search anything..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-full bg-white shadow-lg text-[#5D4E37] placeholder-[#BFA682] focus:outline-none focus:ring-4 focus:ring-[#D4B89C] transition"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-10 relative z-10 mb-20">
        {/* FAQ Accordion */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 border-b border-[#E8D5BF]">
            <h2 className="text-2xl font-bold text-[#5D4E37] flex items-center gap-3">
              <BookOpen className="w-7 h-7 text-[#A67C52]" />
              Frequently Asked Questions
            </h2>
          </div>

          <div className="divide-y divide-[#E8D5BF]">
            {filteredFaqs.length === 0 ? (
              <p className="p-8 text-center text-[#8B7355]">
                No results found. Try different keywords or contact us below.
              </p>
            ) : (
              filteredFaqs.map((faq, i) => (
                <div key={i} className="bg-white hover:bg-[#FAF5F0] transition">
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="w-full px-8 py-6 text-left flex justify-between items-center group"
                  >
                    <span className="font-semibold text-[#5D4E37] group-hover:text-[#A67C52] transition">
                      {faq.q}
                    </span>
                    {openIndex === i ? (
                      <ChevronUp className="w-5 h-5 text-[#A67C52]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#8B7355]" />
                    )}
                  </button>
                  {openIndex === i && (
                    <div className="px-8 pb-6 text-[#7A6342] leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;