import React from 'react';
import { ShieldCheck, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="pb-32 px-4 pt-4 bg-[#F8FAFC] min-h-screen">
      <header className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="h-10 w-10 grid place-items-center bg-white rounded-full shadow-sm border border-slate-100 active:scale-95 transition-all"
        >
          <ChevronLeft size={20} className="text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Privacy Policy</h1>
        </div>
      </header>

      <section className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-50 space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
          <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl grid place-items-center shrink-0">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0F172A]">Data Protection</h2>
            <p className="text-xs text-slate-500 mt-1">Last updated: Aug 2026</p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-600">
          <p>
            Welcome to Umeed B2B. We value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and share information about you when you use our services.
          </p>
          <h3 className="font-bold text-[#0F172A]">Information We Collect</h3>
          <p>
            We collect information you provide directly to us, such as when you create an account, update your profile, or use our services. This may include your name, email address, phone number, and location data.
          </p>
          <h3 className="font-bold text-[#0F172A]">How We Use Information</h3>
          <p>
            We use the information we collect to provide, maintain, and improve our services, as well as to communicate with you, process transactions, and ensure the security of our platform.
          </p>
          <h3 className="font-bold text-[#0F172A]">Information Sharing</h3>
          <p>
            We do not share your personal information with third parties except as necessary to provide our services, comply with the law, or protect our rights.
          </p>
          <p className="text-xs text-slate-400 mt-4">
            If you have any questions about this Privacy Policy, please contact our support team.
          </p>
        </div>
      </section>
    </div>
  );
}

export default PrivacyPolicy;
