'use client';

'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
// import Image from 'next/image';
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
      
      // Get the container and its dimensions
      const container = certificateRef.current;
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      
      // Create a canvas with high DPI for better quality
      const scale = 2; // Scale for better quality on high DPI screens
      const canvas = document.createElement('canvas');
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      
      if (!ctx) {
        throw new Error('Could not create canvas context');
      }
      
      // Set background to white
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Scale the context to ensure crisp rendering
      ctx.scale(scale, scale);
      
      // Improve text rendering quality
      ctx.imageSmoothingEnabled = true;
      ctx.textRendering = 'optimizeLegibility';
      
      // Create a new image for the certificate
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      
      // Wait for the image to load
      await new Promise<void>((resolve, reject) => {
        const onLoad = () => {
          // Clean up event listeners
          img.removeEventListener('load', onLoad);
          img.removeEventListener('error', onError);
          
          try {
            // Draw the certificate image
            ctx.drawImage(img, 0, 0, width, height);
            
            // Draw the text on top - matching the preview's styling exactly
            ctx.textAlign = 'center';
            
            // Check if mobile device
            const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
            
            // Draw name - positioned to match preview (51.5% from top)
            if (namaPeserta) {
              // Set font size based on device
              ctx.font = isMobile ? 'bold 10px Arial' : 'bold 24px Arial';
              ctx.fillStyle = 'black';
              
              // Calculate position (51.5% from top, centered horizontally)
              const nameX = width / 2;
              const nameY = height * 0.53;
              
              // Draw name with subtle outline for better readability
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
              ctx.lineWidth = 2;
              ctx.strokeText(namaPeserta.toUpperCase(), nameX, nameY);
              ctx.fillText(namaPeserta.toUpperCase(), nameX, nameY);
            }
            
            // Draw description - positioned to match preview (59% from top)
            if (desc) {
              // Set font size based on device
              ctx.font = isMobile ? 'bold 10px Arial' : 'bold 24px Arial';
              ctx.fillStyle = 'black';
              
              // Calculate position (59% from top, centered horizontally)
              const descX = width / 2;
              const descY = height * 0.60;
              
              // Draw description with subtle outline for better readability
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
              ctx.lineWidth = 2;
              ctx.strokeText(desc, descX, descY);
              ctx.fillText(desc, descX, descY);
            }
            
            resolve();
          } catch (drawError) {
            console.error('Error drawing on canvas:', drawError);
            reject(new Error('Failed to draw certificate'));
          }
        };
        
        const onError = () => {
          img.removeEventListener('load', onLoad);
          img.removeEventListener('error', onError);
          reject(new Error('Failed to load certificate image'));
        };
        
        img.addEventListener('load', onLoad);
        img.addEventListener('error', onError);
        
        img.src = '/template-vespa-certificate.jpeg';
      });
      
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((result) => {
          if (result) {
            resolve(result);
          } else {
            reject(new Error('Canvas to Blob conversion failed'));
          }
        }, 'image/png', 1.0);
      });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sertifikat-${(namaPeserta || 'batu-vespa-fest').toLowerCase().replace(/\s+/g, '-')}.png`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setIsLoading(false);
        setIsDownloading(false);
      }, 100);
      
    } catch (error) {
      console.error('Error generating certificate:', error);
      setIsLoading(false);
      setIsDownloading(false);
      
      // Fallback to html-to-image if canvas approach fails
      if (!certificateRef.current) return;
      
      try {
        const dataUrl = await toPng(certificateRef.current, { 
          backgroundColor: 'white',
          pixelRatio: 2,
          cacheBust: true
        });
        
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `sertifikat-${(namaPeserta || 'batu-vespa-fest').toLowerCase().replace(/\s+/g, '-')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (fallbackError) {
        console.error('Fallback download failed:', fallbackError);
      } finally {
        setIsLoading(false);
        setIsDownloading(false);
      }
    }
  }, [certificateRef, namaPeserta, desc, isLoading, isImageLoaded]);

  // Handle image load state
  const handleImageLoad = useCallback(() => {
    // Use requestAnimationFrame to ensure this runs after React's commit phase
    requestAnimationFrame(() => {
      setIsImageLoaded(true);
      setIsLoading(false);
    });
  }, []);

  // Set up initial loading state and image load handlers
  useEffect(() => {
    const img = certificateRef.current?.querySelector('img');
    if (!img) return;
    
    const handleLoad = () => handleImageLoad();
    const handleError = () => {
      console.error('Error loading certificate image');
      setIsLoading(false);
    };
    
    if (img.complete) {
      handleImageLoad();
    } else {
      img.addEventListener('load', handleLoad);
      img.addEventListener('error', handleError);
    }
    
    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [handleImageLoad]);

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: 'url(/vespa-bg.jpg)' }}
      ></div>
      
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 z-10"></div>
      
      {/* Content */}
      <div className="relative z-20 w-full">
        <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">Pratinjau Sertifikat</h1>
            <p className="text-gray-600">
              Periksa detail sertifikat Anda sebelum mengunduh
            </p>
          </div>
          
          <div className="relative rounded-xl shadow-lg overflow-hidden">
            <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
            <div 
              ref={certificateRef} 
              className="relative w-full aspect-[3/2] bg-cover bg-center"
              style={{ backgroundImage: `url(/template-vespa-certificate.jpeg)` }}
            >
            {/* Overlay text that matches canvas rendering */}
            {isImageLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {namaPeserta && (
                  <div 
                    className="text-center"
                    style={{
                      position: 'absolute',
                      top: '51.5%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '80%'
                    }}
                  >
                    <h2 className="text-[10px] md:text-2xl font-bold uppercase">
                      {namaPeserta}
                    </h2>
                  </div>
                )}
                {desc && (
                  <div 
                    className="text-center"
                    style={{
                      position: 'absolute',
                      top: '59%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '80%'
                    }}
                  >
                    <p className="text-[10px] md:text-2xl font-bold">{desc}</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Hidden image for loading state */}
            <img 
              src="/template-vespa-certificate.jpeg" 
              alt="" 
              className="hidden"
              onLoad={handleImageLoad}
              onError={() => {
                console.error('Error loading certificate image');
                setIsLoading(false);
              }}
            />
          </div>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild variant="outline" className="w-full sm:w-auto bg-white/80 hover:bg-white">
              <Link href="/">Kembali ke Form</Link>
            </Button>
            <Button 
              onClick={handleDownload}
              disabled={isLoading || isDownloading || !isImageLoaded} 
              className={`w-full sm:w-auto relative bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-700 hover:to-gray-600 ${
                isLoading || isDownloading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isDownloading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                  <span>Menyiapkan unduhan...</span>
                </span>
              ) : (
                'Download Sertifikat'
              )}
            </Button>
          </div>
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
      <div className="min-h-screen relative flex items-center justify-center">
        {/* Background Image */}
        <div 
          className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: 'url(/vespa-bg.jpg)' }}
        ></div>
        
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/30 z-10"></div>
        
        <div className="relative z-20 text-center bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-800 mx-auto mb-4"></div>
          <p className="text-gray-800 font-medium">Memuat sertifikat...</p>
        </div>
      </div>
    )
  }
);

export default function CertificatePreview() {
  return <CertificateContentDynamic />;
}
