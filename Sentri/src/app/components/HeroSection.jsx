import { useEffect, useRef } from "react";

const THREE_CDN = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js";
const VANTA_CLOUDS_CDN = "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.clouds.min.js";

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      if (existingScript.dataset.loaded === "true") { resolve(); return; }
      existingScript.addEventListener("load", () => resolve(), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.addEventListener("load", () => { script.dataset.loaded = "true"; resolve(); }, { once: true });
    document.body.appendChild(script);
  });
}

export default function HeroSection() {
  const vantaRef = useRef(null);
  const vantaEffectRef = useRef(null);
  
  // ADJUST OPACITY HERE (0.0 to 1.0)
  const CLOUD_OPACITY = 0.5; 

  useEffect(() => {
    let isMounted = true;
    const initVanta = async () => {
      try {
        await loadScript(THREE_CDN);
        await loadScript(VANTA_CLOUDS_CDN);
        if (!isMounted || !vantaRef.current || !window.VANTA?.CLOUDS) return;
        if (vantaEffectRef.current) vantaEffectRef.current.destroy();

        vantaEffectRef.current = window.VANTA.CLOUDS({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          speed: 0.60,
          skyColor: 0x68b8d7,
          cloudColor: 0xadc1de,
          cloudShadowColor: 0x183550,
          sunColor: 0xff9919,
          sunGlareColor: 0xff6633,
          sunlightColor: 0xff9933,
        });
      } catch (error) {
        console.error("Vanta Error:", error);
      }
    };
    initVanta();
    return () => {
      isMounted = false;
      if (vantaEffectRef.current) vantaEffectRef.current.destroy();
    };
  }, []);

  return (
    <section className="relative min-h-[65vh] overflow-hidden bg-white">
      {/* BACKGROUND LAYER */}
      <div 
        ref={vantaRef} 
        className="absolute inset-0 z-0" 
        style={{ opacity: CLOUD_OPACITY }} 
      />

      {/* SMOOTH BOTTOM FADE 
          This creates the transition from the clouds to the page background color (#F8FAF5)
      */}
      <div className="absolute inset-x-0 bottom-0 h-40 z-10 bg-gradient-to-t from-[#EFF8EB] to-transparent" />

      {/* CONTENT LAYER */}
      <div className="relative z-20 mx-auto flex min-h-[60vh] max-w-7xl items-center px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-2xl text-left">
          <div className="mb-5 inline-flex items-center rounded-full border border-slate-200 bg-white/40 px-4 py-2 backdrop-blur-md">
            <span className="text-sm font-semibold tracking-wide text-slate-700">Digital Wellness Sanctuary</span>
          </div>
          <h1 className="mb-6 text-5xl font-extrabold leading-tight text-slate-900 sm:text-7xl">
            Hope. Healing. <br/>Recovery.
          </h1>
          <p className="text-lg text-slate-700 sm:text-xl font-medium max-w-lg">
            At Poway Recovery Center, we provide compassionate, evidence-based care to support every step of your healing journey.
          </p>
        </div>
      </div>
    </section>
  );
}