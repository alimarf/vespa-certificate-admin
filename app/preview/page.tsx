'use client';

import { useSearchParams, useRouter } from 'next/navigation';
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

  const router = useRouter();

  const handleDownload = useCallback(async () => {
    if (!certificateRef.current || isLoading || isDownloading || !isImageLoaded) return;
    
    try {
      setIsLoading(true);
      setIsDownloading(true);
      
      // No need to store container reference as we're using fixed dimensions
      
      // Fixed dimensions for consistent output (A4 ratio: 1.414)
      const targetWidth = 1200; // Fixed width for all devices
      const targetHeight = 848; // 1200 / 1.414 (A4 ratio)
      
      // Create canvas with fixed dimensions
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      
      if (!ctx) {
        throw new Error('Could not create canvas context');
      }
      
      // Set background to white
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Improve rendering quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.textRendering = 'geometricPrecision';
      
      // Create a new image for the certificate
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      
      // Preload the font
      const font = new FontFace('Ancizar Serif', 'url(https://fonts.cdnfonts.com/s/100200/AncizarSerif.woff)');
      let fontLoaded = false;
      
      try {
        // Load the font first
        const loadedFont = await font.load();
        document.fonts.add(loadedFont);
        fontLoaded = true;
      } catch (fontError) {
        console.error('Error loading font:', fontError);
        // Continue with fallback font
      }
      
      // Wait for the image to load
      await new Promise<void>((resolve, reject) => {
        const onLoad = async () => {
          // Clean up event listeners
          img.removeEventListener('load', onLoad);
          img.removeEventListener('error', onError);
          
          try {
            // Draw the certificate image to fill the canvas while maintaining aspect ratio
            const imgAspect = img.width / img.height;
            const canvasAspect = canvas.width / canvas.height;
            let drawWidth, drawHeight, offsetX, offsetY;
            
            if (imgAspect > canvasAspect) {
              // Image is wider than canvas
              drawHeight = canvas.height;
              drawWidth = drawHeight * imgAspect;
              offsetX = (canvas.width - drawWidth) / 2;
              offsetY = 0;
            } else {
              // Image is taller than canvas
              drawWidth = canvas.width;
              drawHeight = drawWidth / imgAspect;
              offsetX = 0;
              offsetY = (canvas.height - drawHeight) / 2;
            }
            
            // Draw the image centered and scaled to fit
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
            
            // Wait a small amount of time to ensure font is ready
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Set text alignment
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Use fixed font size for consistent output (12px on mobile, 24px on desktop)
            const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
            const fontSize = isMobile ? 24 : 24; // Increased from 10px to 12px for better mobile readability
            
            // Set the font
            if (fontLoaded) {
              ctx.font = `600 ${fontSize}px 'Ancizar Serif', serif`;
            } else {
              // Fallback font
              ctx.font = `600 ${fontSize}px serif`;
            }
            
            // Draw name - positioned to match preview (52% from top)
            if (namaPeserta) {
              ctx.fillStyle = 'rgb(31, 41, 55)';
              const nameX = canvas.width / 2; // Center horizontally
              const nameY = canvas.height * 0.52; // 52% from top
              
              // Draw name with subtle outline for better readability
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
              ctx.lineWidth = 2;
              const nameText = namaPeserta.toUpperCase();
              ctx.strokeText(nameText, nameX, nameY);
              ctx.fillText(nameText, nameX, nameY);
            }
            
            // Draw description - positioned to match preview (58% from top)
            if (desc) {
              ctx.fillStyle = 'rgb(55, 65, 81)';
              const descX = canvas.width / 2; // Center horizontally
              const descY = canvas.height * 0.59; // 58% from top
              
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
      
      // Convert canvas to blob with consistent quality
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((result) => {
          if (result) {
            // If file size is too large, reduce quality
            if (result.size > 1.5 * 1024 * 1024) { // If > 1.5MB
              canvas.toBlob(
                (compressed) => {
                  if (compressed) {
                    resolve(compressed);
                  } else {
                    resolve(result); // Fallback to original if compression fails
                  }
                },
                'image/jpeg', // Use JPEG for better compression
                0.85 // 85% quality
              );
            } else {
              resolve(result);
            }
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
      // Clean up and navigate to thank you page after a short delay
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setIsLoading(false);
        setIsDownloading(false);
        router.push('/thankyou');
      }, 300); // Slightly longer delay to ensure download starts
      
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
  }, [certificateRef, namaPeserta, desc, isLoading, isDownloading, isImageLoaded, router]);

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
                      top: '52%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '80%'
                    }}
                  >
                    <h2 className="certificate-name text-[8px] md:text-2xl uppercase text-gray-800">
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
                    <p className="certificate-desc text-[8px] md:text-2xl text-gray-700">{desc}</p>
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
