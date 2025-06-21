"use client";

import { CertificateForm } from "@/components/certificate-form";

export default function Home() {
  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: 'url(/vespa-indo-bg.jpg)' }}
      ></div>
      
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 z-10"></div>
      
      {/* Content */}
      <div className="relative z-20 w-full px-4">
        <div className="max-w-xl mx-auto">
          {/* Glass Card */}
          <div className="backdrop-blur-md bg-white/30 rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white drop-shadow-lg">Batu Vespa Fest 2025</h1>
            </div>
            <CertificateForm />
          </div>
        </div>
      </div>
    </div>
  );
}
