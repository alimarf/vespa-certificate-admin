'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import Image from 'next/image';
import { useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';

export default function CertificatePreview() {
  const searchParams = useSearchParams();
  const namaClub = searchParams.get('namaClub') || '';
  const asalKota = searchParams.get('asalKota') || '';
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    if (!certificateRef.current) return;
    
    try {
      const dataUrl = await toPng(certificateRef.current, { 
        backgroundColor: null as unknown as string,
        pixelRatio: 2
      });
      
      const link = document.createElement('a');
      const fileName = `sertifikat-${namaClub || 'batu-vespa-fest'}.png`;
      
      link.setAttribute('download', fileName);
      link.setAttribute('href', dataUrl);
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    }
  }, [namaClub]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Pratinjau Sertifikat</h1>
          <p className="text-muted-foreground">
            Periksa detail sertifikat Anda sebelum mengunduh
          </p>
        </div>
        
        <div className="relative overflow-hidden" ref={certificateRef}>
          {/* Certificate container with fixed aspect ratio */}
          <div className="relative w-full" style={{ aspectRatio: '1200/800' }}>
            <Image 
              src="/vespa-certificate-template.jpeg" 
              alt="Sertifikat Batu Vespa Fest 2025"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 1200px"
              className="object-contain rounded-lg shadow-lg"
              priority
            />
            
            {/* Overlay Text Container */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* First white box - Nama Club */}
              <div 
                className="absolute w-3/4 mx-auto text-center"
                style={{ 
                  top: '51.5%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <p className="text-xs xs:text-lg sm:text-xl md:text-2xl font-medium text-center text-gray-800 break-words px-1">
                  {namaClub || ' '}
                </p>
              </div>
              
              {/* Second white box - Asal Kota */}
              <div 
                className="absolute w-3/4 mx-auto text-center"
                style={{ 
                  top: '58.5%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <p className="text-xs xs:text-lg sm:text-xl md:text-2xl font-medium text-center text-gray-800 break-words px-1">
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
