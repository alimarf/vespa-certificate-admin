"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
// import Link from 'next/link';
// import { Button } from "@/components/ui/button";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url(/vespa-indo-bg.jpg)" }}
      ></div>

      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 z-10"></div>

      {/* Content */}
      <div className="relative z-20 text-center max-w-2xl mx-4">
        <motion.div
          className="bg-white backdrop-blur-sm rounded-2xl shadow-2xl p-8"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            delay: 0.2,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <motion.h1
                className="text-3xl font-bold text-gray-800 mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Terima Kasih!
              </motion.h1>
              <motion.p
                className="text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Sertifikat Anda berhasil diunduh. Terima kasih telah
                berpartisipasi dalam Batu Vespa Fest 2025!
              </motion.p>
            </div>
          </motion.div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Button
              asChild
              className="bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-700 hover:to-gray-600"
            >
              <Link href="/">Kembali ke Halaman Utama</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
