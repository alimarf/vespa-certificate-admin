"use client";

import { CertificateForm } from "@/components/certificate-form";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Batu Vespa Fest 2025</h1>
      </div>
      <CertificateForm />
    </div>
  );
}
