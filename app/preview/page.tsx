'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { toPng } from 'html-to-image';

export default function CertificatePreview() {
  const searchParams = useSearchParams();
  const namaClub = searchParams.get('namaClub') || '';
  const asalKota = searchParams.get('asalKota') || '';
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    
    try {
      const dataUrl = await toPng(certificateRef.current, { 
        backgroundColor: null as unknown as string, // Transparent background
        pixelRatio: 2 // Higher quality
      });
      
      const link = document.createElement('a');
      const fileName = `sertifikat-${namaClub || 'batu-vespa-fest'}.png`;
      
      link.setAttribute('download', fileName);
      link.setAttribute('href', dataUrl);
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Pratinjau Sertifikat</h1>
          <p className="text-muted-foreground">
            Periksa detail sertifikat Anda sebelum mengunduh
          </p>
        </div>
        
        <div className="relative" ref={certificateRef}>
          {/* Certificate Image */}
          <div className="relative">
            <div className="relative w-full h-auto">
              <Image 
                src="/vespa-certificate-template.jpeg" 
                alt="Sertifikat Batu Vespa Fest 2025"
                width={1200}
                height={800}
                className="w-full h-auto rounded-lg shadow-lg"
                priority
              />
            </div>
            
            {/* Overlay Text - Positioned over white input boxes */}
            <div className="absolute inset-0">
              {/* First white box - Nama Club */}
              <div 
                className="absolute left-1/2 transform -translate-x-1/2"
                style={{ top: '49%' }}
              >
                <p className="text-2xl font-medium text-center text-gray-800">
                  {namaClub || ' '}
                </p>
              </div>
              
              {/* Second white box - Asal Kota */}
              <div 
                className="absolute left-1/2 transform -translate-x-1/2"
                style={{ top: '56%' }}
              >
                <p className="text-2xl font-medium text-center text-gray-800">
                  {asalKota || ' '}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center space-x-4">
          <Button asChild variant="outline">
            <Link href="/">Kembali ke Form</Link>
          </Button>
          <Button onClick={handleDownload}>
            Download Sertifikat
          </Button>
        </div>
      </div>
    </div>
  );
}
