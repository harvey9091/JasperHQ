import React, { useEffect, useRef } from 'react';
import './CardScanner.css';

const CardScanner: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scriptLoadedRef = useRef(false);

    useEffect(() => {
        // Load Three.js if not already loaded
        if (!scriptLoadedRef.current) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
            script.async = true;
            script.onload = () => {
                scriptLoadedRef.current = true;
                initializeCardScanner();
            };
            document.body.appendChild(script);
        } else {
            initializeCardScanner();
        }

        return () => {
            // Cleanup
            if (window.cardStream) {
                window.cardStream = null;
            }
            if (window.particleSystem) {
                window.particleSystem.destroy?.();
                window.particleSystem = null;
            }
            if (window.particleScanner) {
                window.particleScanner.destroy?.();
                window.particleScanner = null;
            }
        };
    }, []);

    const initializeCardScanner = () => {
        // Import and initialize the card scanner scripts
        const scriptElement = document.createElement('script');
        scriptElement.src = '/card-scanner.js';
        scriptElement.async = true;
        document.body.appendChild(scriptElement);
    };

    return (
        <section className="relative w-full bg-black overflow-hidden" ref={containerRef}>
            {/* Main Container */}
            <div className="container relative w-screen h-[400px] flex items-center justify-center">
                <canvas id="particleCanvas" className="absolute top-1/2 left-0 -translate-y-1/2 w-screen h-[250px] z-0 pointer-events-none"></canvas>
                <canvas id="scannerCanvas" className="absolute top-1/2 left-[-3px] -translate-y-1/2 w-screen h-[300px] z-[15] pointer-events-none"></canvas>

                <div className="scanner hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-[300px] rounded-[30px] bg-gradient-to-b from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_rgba(0,255,255,0.8),0_0_40px_rgba(0,255,255,0.4)] z-10 animate-scanPulse"></div>

                <div className="card-stream absolute w-screen h-[180px] flex items-center overflow-visible" id="cardStream">
                    <div className="card-line flex items-center gap-[60px] whitespace-nowrap cursor-grab select-none will-change-transform" id="cardLine"></div>
                </div>
            </div>

        </section>
    );
};

// Extend Window interface for TypeScript
declare global {
    interface Window {
        cardStream?: any;
        particleSystem?: any;
        particleScanner?: any;
        toggleAnimation?: () => void;
        resetPosition?: () => void;
        changeDirection?: () => void;
        setScannerScanning?: (active: boolean) => void;
        getScannerStats?: () => any;
    }
}

export default CardScanner;
