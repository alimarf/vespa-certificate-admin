'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

type CertificateContentProps = {
  namaPeserta?: string;
  desc?: string;
};

function CertificateContent({ namaPeserta, desc }: CertificateContentProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Handle image load with requestAnimationFrame to ensure UI is ready
  const handleImageLoad = useCallback(() => {
    requestAnimationFrame(() => {
      setIsImageLoaded(true);
      setIsLoading(false);
    });
  }, []);

  const handleDownload = useCallback(async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (isLoading || isDownloading || !isImageLoaded) return;
    
    try {
      setIsDownloading(true);
      
      // Create a canvas to draw the certificate
      const canvas = document.createElement('canvas');
      canvas.width = 1200;  // Match the certificate aspect ratio
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not create canvas context');
      }
      
      // Create a new image for the certificate background
      const backgroundImg = new window.Image();
      backgroundImg.crossOrigin = 'anonymous';
      
      // Wait for the background to load
      await new Promise<void>((resolve, reject) => {
        backgroundImg.onload = () => resolve();
        backgroundImg.onerror = () => reject(new Error('Failed to load certificate background'));
        backgroundImg.src = '/template-vespa-certificate.jpeg';
      });
      
      // Draw the background image
      ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
      
      // Get the text elements
      const nameText = namaPeserta || 'Peserta';
      const descText = desc || 'Vespa Club';
      
      // Set font styles for text
      ctx.font = 'bold 36px Arial';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      
      // Draw name text
      ctx.fillText(nameText, canvas.width / 2, 375);
      
      // Draw description text
      ctx.fillText(descText, canvas.width / 2, 425);
      
      // Convert canvas to data URL with high quality
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      
      // Create download link
      const link = document.createElement('a');
      link.download = `sertifikat-${nameText.replace(/[^a-z0-9\-]/gi, '_').toLowerCase()}.png`;
      link.href = dataUrl;
      link.style.display = 'none';
      
      // Add to DOM and trigger download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        setIsDownloading(false);
      }, 100);
      
    } catch (error) {
      console.error('Error generating certificate:', error);
      setIsDownloading(false);
    }
  }, [namaPeserta, desc, isLoading, isDownloading, isImageLoaded]);

  // Monitor image loading
  useEffect(() => {
    const img = certificateRef.current?.querySelector('img');
    
    if (img) {
      if (img.complete && img.naturalWidth > 0) {
        handleImageLoad();
      } else {
        img.onload = () => handleImageLoad();
        img.onerror = () => {
          console.error('Error loading certificate image');
          setIsLoading(false);
        };
      }
      
      return () => {
        img.onload = null;
        img.onerror = null;
      };
    }
  }, [handleImageLoad]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Pratinjau Sertifikat</h1>
          <p className="text-muted-foreground">
            Periksa detail sertifikat Anda sebelum mengunduh
          </p>
        </div>
        
        <div className="relative overflow-hidden">
          {/* Certificate container with fixed aspect ratio */}
          <div 
            ref={certificateRef}
            className="relative w-full" 
            style={{ aspectRatio: '1200/800' }}
          >
            <Image 
              src="/template-vespa-certificate.jpeg" 
              alt="Sertifikat Batu Vespa Fest 2025"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 1200px"
              className="object-contain rounded-lg shadow-lg"
              priority
              onLoadingComplete={handleImageLoad}
              style={{
                objectFit: 'contain',
              }}
            />
            
            {/* Text overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Name text */}
              <div 
                className="absolute text-center"
                style={{ top: '51%', left: '50%', transform: 'translate(-50%, -50%)' }}
              >
                <p className="font-bold text-xl md:text-2xl text-black">
                  {namaPeserta || ' '}
                </p>
              </div>
              
              {/* Description text */}
              <div 
                className="absolute text-center"
                style={{ top: '58%', left: '50%', transform: 'translate(-50%, -50%)' }}
              >
                <p className="text-lg md:text-xl text-black">
                  {desc || ' '}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 justify-center mt-8">
          <Button asChild variant="outline">
            <Link href="/">Kembali</Link>
          </Button>
          
          <Button
            onClick={handleDownload}
            disabled={isLoading || isDownloading || !isImageLoaded}
            className="bg-green-600 hover:bg-green-700"
          >
            {isDownloading ? 'Sedang Mengunduh...' : 'Unduh Sertifikat'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Dynamically import the CertificateContent component with SSR disabled
const CertificateContentDynamic = dynamic<CertificateContentProps>(
  () => Promise.resolve(CertificateContent),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gray-100 py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Memuat sertifikat...</p>
        </div>
      </div>
    )
  }
);

export default function CertificatePreview() {
  const searchParams = useSearchParams();
  const namaPeserta = searchParams?.get('namaPeserta') || '';
  const desc = searchParams?.get('desc') || '';
  
  return <CertificateContentDynamic namaPeserta={namaPeserta} desc={desc} />;
}
