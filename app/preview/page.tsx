'use client';

'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import Image from 'next/image';
import { useRef, useCallback, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import dynamic from 'next/dynamic';

function CertificateContent() {
  const searchParams = useSearchParams();
  const namaPeserta = searchParams.get('namaPeserta') || '';
  const desc = searchParams.get('desc') || '';
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!certificateRef.current || isLoading || !isImageLoaded) return;
    
    try {
      setIsLoading(true);
      setIsDownloading(true);
      
      // Force a reflow to ensure all styles are applied
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      // Additional delay to ensure rendering is complete
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Ensure the image is fully loaded
      const img = certificateRef.current.querySelector('img');
      if (img && !img.complete) {
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error('Image failed to load'));
        });
      }
      
      // Force another reflow before capture
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      // Generate the image with retry logic
      const generateImage = async (attempt = 0): Promise<string> => {
        try {
          return await toPng(certificateRef.current!, { 
            backgroundColor: null as unknown as string,
            pixelRatio: 2,
            cacheBust: true,
            quality: 1.0
          });
        } catch (error) {
          if (attempt < 2) { // Retry up to 2 times
            await new Promise(resolve => setTimeout(resolve, 300));
            return generateImage(attempt + 1);
          }
          throw error;
        }
      };
      
      const dataUrl = await generateImage();
      
      // Create and trigger download
      const link = document.createElement('a');
      const fileName = `sertifikat-${namaPeserta || 'batu-vespa-fest'}.png`;
      
      // Use a different approach for better mobile support
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      link.href = blobUrl;
      link.download = fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      
      // Use a more reliable click method
      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      });
      
      link.dispatchEvent(clickEvent);
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
        setIsLoading(false);
        setIsDownloading(false);
      }, 200);
      
    } catch (error) {
      console.error('Error generating image:', error);
      setIsLoading(false);
      setIsDownloading(false);
    }
  }, [certificateRef, namaPeserta, isLoading, isImageLoaded]);

  // Handle image load state with better error handling
  const handleImageLoad = useCallback(() => {
    const handleLoad = () => {
      // Double check the image is actually loaded
      const img = certificateRef.current?.querySelector('img');
      if (img && img.complete && img.naturalWidth > 0) {
        // Add a small delay to ensure all rendering is complete
        setTimeout(() => {
          setIsImageLoaded(true);
          setIsLoading(false);
        }, 200);
      } else {
        // If not properly loaded, retry
        handleImageLoad();
      }
    };
    
    // Use double requestAnimationFrame to ensure all paints are done
    requestAnimationFrame(() => {
      requestAnimationFrame(handleLoad);
    });
  }, []);

  // Set up initial loading state with better checks
  useEffect(() => {
    const checkImage = () => {
      const img = certificateRef.current?.querySelector('img');
      if (img) {
        if (img.complete && img.naturalWidth > 0) {
          handleImageLoad();
        } else {
          img.onload = handleImageLoad;
          img.onerror = () => {
            console.error('Error loading certificate image');
            setIsLoading(false);
          };
        }
      } else {
        // If no image found, retry after a short delay
        setTimeout(checkImage, 100);
      }
    };
    
    const timer = setTimeout(checkImage, 100);
    return () => {
      clearTimeout(timer);
      const img = certificateRef.current?.querySelector('img');
      if (img) {
        img.onload = null;
        img.onerror = null;
      }
    };
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
        
        <div className="relative overflow-hidden" ref={certificateRef}>
          {/* Certificate container with fixed aspect ratio */}
          <div className="relative w-full" style={{ aspectRatio: '1200/800' }}>
            <Image 
              src="/template-vespa-certificate.jpeg" 
              alt="Sertifikat Batu Vespa Fest 2025"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 1200px"
              className="object-contain rounded-lg shadow-lg"
              priority
              onLoadingComplete={handleImageLoad}
              onError={() => {
                console.error('Error loading certificate image');
                setIsLoading(false);
              }}
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
                  {namaPeserta || ' '}
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
                  {desc || ' '}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center space-x-4">
          <Button asChild variant="outline">
            <Link href="/">Kembali ke Form</Link>
          </Button>
          <Button 
            onClick={handleDownload}
            disabled={isLoading || isDownloading || !isImageLoaded} 
            className={`relative ${isLoading || isDownloading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {isDownloading ? (
              <>
                <span className="animate-pulse">Menyiapkan unduhan...</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </div>
              </>
            ) : (
              'Download Sertifikat'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Dynamically import the CertificateContent component with SSR disabled
const CertificateContentDynamic = dynamic(
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
  return <CertificateContentDynamic />;
}
