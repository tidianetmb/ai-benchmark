"use client"
import { useState } from "react"
import MannequinViewer from "@/components/Mannequin"
import { motion, AnimatePresence } from "framer-motion"
import { 
  IconSun, IconMoon, IconShirt, IconUser, 
  IconBolt, IconX, IconRocket, IconCheck, IconDownload, IconPhoto, IconLayoutGrid
} from "@tabler/icons-react"

// TES MODÈLES EXACTS
const MODELS = [
  { id: "black-forest-labs/flux.2-max", name: "FLUX.2 Max", provider: "BFL", speed: "Ultra" },
  { id: "black-forest-labs/flux.2-flex", name: "FLUX.2 Flex", provider: "BFL", speed: "Fast" },
  { id: "black-forest-labs/flux.2-pro", name: "FLUX.2 Pro", provider: "BFL", speed: "High" },
  { id: "sourceful/riverflow-v2-max-preview", name: "Riverflow V2 Max", provider: "Sourceful", speed: "Ultra" },
  { id: "google/gemini-3-pro-image-preview", name: "Gemini 3 Pro", provider: "Google", speed: "High" },
  { id: "openai/gpt-5-image", name: "GPT-5 Image", provider: "OpenAI", speed: "Ultra" },
];

// TES VÊTEMENTS EXACTS
const CLOTHES = [
  { id: "tshirt", name: "T-Shirt" }, { id: "hoodie", name: "Hoodie" },
  { id: "jacket", name: "Leather" }, { id: "blazer", name: "Blazer" },
  { id: "jean", name: "Jeans" }, { id: "cargo", name: "Cargo" },
  { id: "sneakers", name: "Sneakers" }, { id: "cap", name: "Cap" },
];

export default function BenchmarkApp() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [generatedResults, setGeneratedResults] = useState(null);
  
  const [config, setConfig] = useState({
    age: 25,
    height: 1.7,
    selectedModels: ["black-forest-labs/flux.2-max"],
    clothes: [],
    decor: "",
  });

  const handleToggleModel = (id) => {
    setConfig((prev) => ({
      ...prev,
      selectedModels: prev.selectedModels.includes(id)
        ? (prev.selectedModels.length > 1 ? prev.selectedModels.filter(m => m !== id) : prev.selectedModels)
        : [...prev.selectedModels, id]
    }));
  };

  const handleToggleClothing = (id) => {
    setConfig((prev) => ({
      ...prev,
      clothes: prev.clothes.includes(id) ? prev.clothes.filter((c) => c !== id) : [...prev.clothes, id],
    }));
  };

  const runInference = async () => {
    setLoading(true);
    setGeneratedResults(null);
    try {
      const response = await fetch("https://project.eltux.fr/webhook-test/generate-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: { ...config, mode: "studio" } }),
      });
      const data = await response.json();
      const resultsArray = Array.isArray(data) ? data : (data.imageUrl ? [data] : []);
      setGeneratedResults(resultsArray);
    } catch (e) {
      alert("Neural Link Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`min-h-screen transition-colors duration-500 pb-12 ${isDarkMode ? "bg-black text-white" : "bg-neutral-50 text-neutral-900"}`}>
      
      {/* HEADER COMPACT */}
      <nav className={`fixed top-0 w-full z-50 border-b px-6 py-4 flex justify-between items-center backdrop-blur-xl ${isDarkMode ? "bg-black/60 border-white/10" : "bg-white/60 border-neutral-200"}`}>
        <div className="flex items-center gap-2">
          <IconRocket className="text-blue-500" size={20} />
          <h1 className="text-sm font-black uppercase tracking-tighter italic">Studio Audit v2.0</h1>
        </div>
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full hover:bg-current/10">
          {isDarkMode ? <IconSun size={18} /> : <IconMoon size={18} />}
        </button>
      </nav>

      <div className="pt-24 px-6 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* PANEL CONFIG : GAUCHE */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-current/5 p-6 rounded-[2rem] border border-current/5 space-y-6">
            <div>
              <label className="text-[10px] font-bold uppercase opacity-40 mb-3 block tracking-widest">01. Persona</label>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" value={config.age} onChange={(e) => setConfig({ ...config, age: e.target.value })} 
                  className="bg-current/5 border border-current/10 rounded-xl p-3 text-lg font-bold outline-none focus:border-blue-500 w-full" placeholder="Age" />
                <input type="number" step="0.1" value={config.height} onChange={(e) => setConfig({ ...config, height: e.target.value })} 
                  className="bg-current/5 border border-current/10 rounded-xl p-3 text-lg font-bold outline-none focus:border-blue-500 w-full" placeholder="Height" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase opacity-40 mb-3 block tracking-widest">02. Wardrobe</label>
              <div className="flex flex-wrap gap-2">
                {CLOTHES.map(c => (
                  <button key={c.id} onClick={() => handleToggleClothing(c.id)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all border ${
                      config.clothes.includes(c.id) ? "bg-white text-black border-white" : "border-current/20 opacity-60 hover:opacity-100"
                    }`}>
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase opacity-40 mb-3 block tracking-widest">03. Engines ({config.selectedModels.length})</label>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {MODELS.map(m => (
                  <button key={m.id} onClick={() => handleToggleModel(m.id)}
                    className={`w-full p-3 rounded-xl border text-left flex justify-between items-center transition-all ${
                      config.selectedModels.includes(m.id) ? "border-blue-500 bg-blue-500/10" : "border-current/10 opacity-40"
                    }`}>
                    <div>
                      <p className="text-[10px] font-bold uppercase leading-none">{m.name}</p>
                      <p className="text-[8px] opacity-40 uppercase">{m.speed} Speed</p>
                    </div>
                    {config.selectedModels.includes(m.id) && <IconCheck size={14} className="text-blue-500" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button onClick={runInference} disabled={loading}
            className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${
              loading ? "opacity-30" : "hover:scale-[1.01] active:scale-95 shadow-xl"
            } ${isDarkMode ? "bg-white text-black" : "bg-black text-white"}`}>
            {loading ? "Generating..." : `Start Benchmark (${config.selectedModels.length})`}
          </button>
        </div>

        {/* PREVIEW : CENTRE */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-current/[0.03] border border-current/5">
            <MannequinViewer config={config} />
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* RÉSULTATS : DROITE */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between border-b border-current/10 pb-4">
            <h2 className="text-xl font-black uppercase italic italic">Gallery</h2>
            <IconLayoutGrid size={18} className="opacity-40" />
          </div>

          {!generatedResults && !loading && (
            <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-current/10 rounded-[2rem] opacity-20">
              <IconPhoto size={40} />
              <p className="text-[10px] font-bold uppercase mt-4">No Renders Found</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence>
              {generatedResults?.map((res, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                  className="group relative aspect-[3/4] bg-neutral-900 rounded-3xl overflow-hidden border border-white/10">
                  <img src={res.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={res.model} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                    <p className="text-[8px] font-bold text-blue-400 uppercase tracking-tighter mb-1">{res.model}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase">Render #{idx+1}</span>
                      <button className="p-2 bg-white text-black rounded-full hover:scale-110 transition-transform">
                        <IconDownload size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </main>
  );
}