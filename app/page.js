"use client";
import React, { useState } from "react";
import MannequinViewer from "@/components/Mannequin";
import { motion, AnimatePresence } from "framer-motion";
import { IconSun, IconMoon, IconCactus, IconShirt, IconUser, IconAperture, IconSend, IconX, IconCpu } from "@tabler/icons-react";

// --- LISTE DES MODÈLES ---
const MODELS = [
  { id: 'black-forest-labs/flux.2-max', name: 'FLUX.2 Max', provider: 'BFL', speed: 'Ultra' },
  { id: 'black-forest-labs/flux.2-flex', name: 'FLUX.2 Flex', provider: 'BFL', speed: 'Fast' },
  { id: 'black-forest-labs/flux.2-pro', name: 'FLUX.2 Pro', provider: 'BFL', speed: 'High' },
  { id: 'sourceful/riverflow-v2-max-preview', name: 'Riverflow V2 Max', provider: 'Sourceful', speed: 'Ultra' },
  { id: 'sourceful/riverflow-v2-standard-preview', name: 'Riverflow V2 Std', provider: 'Sourceful', speed: 'Balanced' },
  { id: 'sourceful/riverflow-v2-fast-preview', name: 'Riverflow V2 Fast', provider: 'Sourceful', speed: 'Instant' },
  { id: 'google/gemini-3-pro-image-preview', name: 'Gemini 3 Pro', provider: 'Google', speed: 'High' },
  { id: 'google/gemini-2.5-flash-image', name: 'Gemini 2.5 Flash', provider: 'Google', speed: 'Fast' },
  { id: 'google/gemini-2.5-flash-image-preview', name: 'Gemini 2.5 Flash (Pre)', provider: 'Google', speed: 'Fast' },
  { id: 'openai/gpt-5-image', name: 'GPT-5 Image', provider: 'OpenAI', speed: 'Ultra' },
  { id: 'openai/gpt-5-image-mini', name: 'GPT-5 Image Mini', provider: 'OpenAI', speed: 'Fast' }
];

const CLOTHES = [
  { id: 'tshirt', name: 'T-Shirt' }, { id: 'hoodie', name: 'Hoodie' },
  { id: 'jacket', name: 'Leather' }, { id: 'blazer', name: 'Blazer' },
  { id: 'puffer', name: 'Puffer' }, { id: 'trench', name: 'Trench' },
  { id: 'crop-top', name: 'Crop-Top' }, { id: 'jean', name: 'Jeans' },
  { id: 'cargo', name: 'Cargo' }, { id: 'skirt', name: 'Skirt' },
  { id: 'sneakers', name: 'Sneakers' }, { id: 'boots', name: 'Boots' },
  { id: 'glasses', name: 'Sunnies' }, { id: 'cap', name: 'Cap' }
];

export default function BenchmarkApp() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [mode, setMode] = useState("studio");
  const [config, setConfig] = useState({
    age: 25, height: 1.70, skinTone: 0.5,
    selectedModel: MODELS[0].id, clothes: [], decor: ""
  });

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const toggleClothing = (id) => {
    setConfig(prev => ({
      ...prev,
      clothes: prev.clothes.includes(id) ? prev.clothes.filter(c => c !== id) : [...prev.clothes, id]
    }));
  };

  const runInference = async () => {
    setLoading(true);
    setGeneratedImage(null);
    try {
      const response = await fetch("https://project.eltux.fr/webhook-test/50498ce4-6757-4b72-914c-98db665b6bca", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: { ...config, mode } }),
      });
      const data = await response.json();
      if (data.imageUrl) setGeneratedImage(data.imageUrl);
    } catch (e) { alert("Error connecting to n8n"); }
    finally { setLoading(false); }
  };

  const Section = ({ icon: Icon, title, children }) => (
    <div className={`mb-6 md:mb-8 border-l-2 ${isDarkMode ? 'border-purple-500' : 'border-purple-600'} pl-4`}>
      <h2 className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
        {Icon && <Icon size={14} />} {title}
      </h2>
      {children}
    </div>
  );

  return (
    <main className={`min-h-screen transition-colors duration-500 pb-10 ${isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-neutral-50 text-black'}`}>
      
      {/* HEADER - Responsive Padding */}
      <nav className={`fixed top-0 w-full z-50 border-b px-4 md:px-8 py-3 md:py-4 flex justify-between items-center backdrop-blur-md ${isDarkMode ? 'bg-black/50 border-white/10' : 'bg-white/50 border-black/10'}`}>
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full" />
            <h1 className="text-sm md:text-xl font-black italic tracking-tighter uppercase">Neural Shoot</h1>
        </div>
        <button onClick={toggleTheme} className={`p-2 rounded-full transition-all ${isDarkMode ? 'bg-neutral-900 text-yellow-400' : 'bg-neutral-200 text-neutral-800'}`}>
          {isDarkMode ? <IconSun size={18} /> : <IconMoon size={18} />}
        </button>
      </nav>

      {/* MAIN GRID - Stack on Mobile, Side-by-Side on Desktop */}
      <div className="pt-20 md:pt-28 px-4 md:px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
        
        {/* LEFT PANEL: CONFIG */}
        <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
          
          <Section icon={IconUser} title="01. Persona">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className={`${isDarkMode ? 'bg-neutral-900' : 'bg-white border'} p-3 md:p-4 rounded-xl md:rounded-2xl`}>
                <label className="text-[8px] font-bold text-neutral-500 uppercase block mb-1">Age</label>
                <input type="number" value={config.age} onChange={(e)=>setConfig({...config, age: e.target.value})} className="bg-transparent text-lg md:text-xl font-black w-full outline-none" />
              </div>
              <div className={`${isDarkMode ? 'bg-neutral-900' : 'bg-white border'} p-3 md:p-4 rounded-xl md:rounded-2xl`}>
                <label className="text-[8px] font-bold text-neutral-500 uppercase block mb-1">Height</label>
                <input type="number" step="0.01" value={config.height} onChange={(e)=>setConfig({...config, height: e.target.value})} className="bg-transparent text-lg md:text-xl font-black w-full outline-none" />
              </div>
            </div>
          </Section>

          <Section icon={IconShirt} title="02. Wardrobe">
            <div className="flex flex-wrap gap-1.5 md:gap-2 max-h-40 md:max-h-52 overflow-y-auto pr-1">
              {CLOTHES.map(item => (
                <button key={item.id} onClick={() => toggleClothing(item.id)}
                  className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[8px] md:text-[9px] font-bold uppercase tracking-wider transition-all border-2 ${
                    config.clothes.includes(item.id) 
                      ? 'border-purple-500 bg-purple-500 text-white shadow-lg shadow-purple-500/20' 
                      : isDarkMode ? 'border-white/10 bg-neutral-900 text-neutral-400' : 'border-neutral-200 bg-white text-neutral-600'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </Section>

          <Section icon={IconCpu} title="03. Engine">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 md:max-h-64 overflow-y-auto pr-1">
              {MODELS.map(m => (
                <button key={m.id} onClick={() => setConfig({...config, selectedModel: m.id})}
                  className={`p-2.5 md:p-3 rounded-xl border-2 transition-all flex flex-col items-start gap-1 text-left ${
                    config.selectedModel === m.id ? 'border-purple-500 bg-purple-500/10' : isDarkMode ? 'border-white/5 bg-neutral-900/50' : 'border-neutral-200 bg-white shadow-sm'
                  }`}
                >
                  <div className="flex justify-between w-full">
                    <span className={`text-[7px] font-black px-1.5 py-0.5 rounded uppercase ${config.selectedModel === m.id ? 'bg-purple-500 text-white' : 'bg-neutral-800 text-neutral-400'}`}>{m.provider}</span>
                  </div>
                  <span className="text-[10px] md:text-[11px] font-black uppercase leading-tight mt-1">{m.name}</span>
                </button>
              ))}
            </div>
          </Section>

          <Section icon={IconCactus} title="04. Context">
            <div className={`flex gap-1 p-1 rounded-xl mb-4 ${isDarkMode ? 'bg-neutral-900' : 'bg-neutral-200'}`}>
              {["studio", "ambiance"].map((m) => (
                <button key={m} onClick={() => setMode(m)} className={`flex-1 py-1.5 md:py-2 rounded-lg font-bold text-[9px] uppercase transition-all ${mode === m ? (isDarkMode ? 'bg-white text-black' : 'bg-black text-white shadow-md') : 'text-neutral-500'}`}>{m}</button>
              ))}
            </div>
            {mode === "ambiance" && (
              <textarea placeholder="Describe environment..." value={config.decor} onChange={(e)=>setConfig({...config, decor: e.target.value})}
                className={`w-full p-3 rounded-xl border h-16 md:h-20 outline-none text-[10px] resize-none ${isDarkMode ? 'bg-neutral-900 border-white/10 text-white focus:border-purple-500' : 'bg-white border-neutral-200 text-black focus:border-purple-500'}`} 
              />
            )}
          </Section>

          {/* ACTION BUTTON - Fixed on mobile? */}
          <div className="pt-2">
            <button onClick={runInference} disabled={loading}
                className={`w-full py-5 md:py-6 rounded-2xl md:rounded-[2rem] font-black text-md md:text-lg uppercase italic tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3 ${loading ? 'opacity-50' : 'hover:scale-[1.01] active:scale-95'} ${isDarkMode ? 'bg-purple-600 text-white shadow-purple-500/20' : 'bg-black text-white shadow-neutral-400'}`}
            >
                {loading ? "Linking..." : <><span className="hidden sm:inline">Run Sequence</span><span className="sm:hidden">Run</span> <IconSend size={18}/></>}
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: PREVIEW - Sticky only on Desktop */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <div className={`relative lg:sticky lg:top-28 w-full aspect-[4/5] rounded-[2rem] md:rounded-[3.5rem] border overflow-hidden flex items-center justify-center transition-all ${isDarkMode ? 'bg-neutral-900/30 border-white/5' : 'bg-white border-neutral-200 shadow-xl'}`}>
            <div className="relative z-10 w-full h-full">
              <MannequinViewer config={config} />
            </div>

            {/* AI RESULT OVERLAY */}
            <AnimatePresence>
              {generatedImage && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-20 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4">
                  <div className="relative w-full h-full max-w-lg flex flex-col items-center justify-center">
                    <img src={generatedImage} alt="Render" className="max-h-[75vh] md:max-h-[85%] w-auto rounded-xl md:rounded-[2rem] border border-white/10 shadow-2xl" />
                    <button onClick={() => setGeneratedImage(null)} className="absolute top-2 right-2 md:top-4 md:right-4 bg-white/10 p-2 md:p-3 rounded-full"><IconX size={20} /></button>
                    <div className="mt-4 flex gap-2">
                        <button className="px-5 py-2 bg-white text-black rounded-full font-black text-[9px] uppercase">Export</button>
                        <button onClick={() => setGeneratedImage(null)} className="px-5 py-2 border border-white/20 text-white rounded-full font-black text-[9px] uppercase">Back</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {loading && (
              <div className="absolute inset-0 z-30 pointer-events-none">
                <motion.div initial={{ y: "-100%" }} animate={{ y: "100%" }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-full h-[30%] bg-gradient-to-b from-transparent via-purple-500/10 to-transparent border-b border-purple-500/40"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}