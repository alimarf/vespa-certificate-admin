"use client";

import { motion } from 'framer-motion';
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
          {/* Glass Card with Animation */}
          <motion.div 
            className="backdrop-blur-md bg-white/30 rounded-2xl shadow-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <CertificateForm />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
