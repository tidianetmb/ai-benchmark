"use client"
import { useState } from "react"
import MannequinViewer from "@/components/Mannequin"
import { motion, AnimatePresence } from "framer-motion"
import { IconSun, IconMoon, IconCactus, IconShirt, IconUser, IconSend, IconX, IconCpu } from "@tabler/icons-react"

// --- LISTE DES MODÈLES ---
const MODELS = [
  { id: "black-forest-labs/flux.2-max", name: "FLUX.2 Max", provider: "BFL", speed: "Ultra" },
  { id: "black-forest-labs/flux.2-flex", name: "FLUX.2 Flex", provider: "BFL", speed: "Fast" },
  { id: "black-forest-labs/flux.2-pro", name: "FLUX.2 Pro", provider: "BFL", speed: "High" },
  { id: "sourceful/riverflow-v2-max-preview", name: "Riverflow V2 Max", provider: "Sourceful", speed: "Ultra" },
  { id: "sourceful/riverflow-v2-standard-preview", name: "Riverflow V2 Std", provider: "Sourceful", speed: "Balanced" },
  { id: "sourceful/riverflow-v2-fast-preview", name: "Riverflow V2 Fast", provider: "Sourceful", speed: "Instant" },
  { id: "google/gemini-3-pro-image-preview", name: "Gemini 3 Pro", provider: "Google", speed: "High" },
  { id: "google/gemini-2.5-flash-image", name: "Gemini 2.5 Flash", provider: "Google", speed: "Fast" },
  { id: "google/gemini-2.5-flash-image-preview", name: "Gemini 2.5 Flash (Pre)", provider: "Google", speed: "Fast" },
  { id: "openai/gpt-5-image", name: "GPT-5 Image", provider: "OpenAI", speed: "Ultra" },
  { id: "openai/gpt-5-image-mini", name: "GPT-5 Image Mini", provider: "OpenAI", speed: "Fast" },
]

const CLOTHES = [
  { id: "tshirt", name: "T-Shirt" },
  { id: "hoodie", name: "Hoodie" },
  { id: "jacket", name: "Leather" },
  { id: "blazer", name: "Blazer" },
  { id: "puffer", name: "Puffer" },
  { id: "trench", name: "Trench" },
  { id: "crop-top", name: "Crop-Top" },
  { id: "jean", name: "Jeans" },
  { id: "cargo", name: "Cargo" },
  { id: "skirt", name: "Skirt" },
  { id: "sneakers", name: "Sneakers" },
  { id: "boots", name: "Boots" },
  { id: "glasses", name: "Sunnies" },
  { id: "cap", name: "Cap" },
]

export default function BenchmarkApp() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [loading, setLoading] = useState(false)
  const [generatedImage, setGeneratedImage] = useState(null)
  const [mode, setMode] = useState("studio")
  const [config, setConfig] = useState({
    age: 25,
    height: 1.7,
    skinTone: 0.5,
    selectedModel: MODELS[0].id,
    clothes: [],
    decor: "",
  })

  const toggleTheme = () => setIsDarkMode(!isDarkMode)

  const toggleClothing = (id) => {
    setConfig((prev) => ({
      ...prev,
      clothes: prev.clothes.includes(id) ? prev.clothes.filter((c) => c !== id) : [...prev.clothes, id],
    }))
  }

  const runInference = async () => {
    setLoading(true)
    setGeneratedImage(null)
    try {
      const response = await fetch("https://project.eltux.fr/webhook-test/50498ce4-6757-4b72-914c-98db665b6bca", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: { ...config, mode } }),
      })
      const data = await response.json()
      if (data.imageUrl) setGeneratedImage(data.imageUrl)
    } catch (e) {
      alert("Error connecting to n8n")
    } finally {
      setLoading(false)
    }
  }

  const Section = ({ icon: Icon, title, children }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className={`mb-6 md:mb-8`}
    >
      <h2
        className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.25em] mb-5 flex items-center gap-2.5 ${
          isDarkMode ? "text-neutral-400" : "text-neutral-600"
        }`}
      >
        {Icon && <Icon size={16} className="opacity-60" />}
        <span>{title}</span>
      </h2>
      {children}
    </motion.div>
  )

  return (
    <main
      className={`min-h-screen transition-colors duration-700 pb-10 relative overflow-hidden ${
        isDarkMode
          ? "bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white"
          : "bg-gradient-to-br from-white via-neutral-50 to-white text-neutral-900"
      }`}
    >
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] mix-blend-overlay">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <nav
        className={`fixed top-0 w-full z-50 border-b px-4 md:px-8 py-3 md:py-4 flex justify-between items-center backdrop-blur-xl transition-all duration-500 ${
          isDarkMode ? "bg-neutral-950/40 border-white/5" : "bg-white/60 border-neutral-200/50 shadow-sm"
        }`}
      >
        <motion.div
          className="flex items-center gap-2.5"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-2.5 h-2.5 rounded-full relative"
            animate={{
              boxShadow: isDarkMode
                ? ["0 0 0px #fff", "0 0 8px #fff", "0 0 0px #fff"]
                : ["0 0 0px #000", "0 0 8px #000", "0 0 0px #000"],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <div className={`absolute inset-0 ${isDarkMode ? "bg-white" : "bg-neutral-900"} rounded-full`} />
          </motion.div>
          <h1
            className={`text-sm md:text-xl font-black italic tracking-tighter uppercase ${
              isDarkMode ? "text-white" : "text-neutral-900"
            }`}
          >
            Neural Shoot
          </h1>
        </motion.div>

        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.05, rotate: 15 }}
          whileTap={{ scale: 0.95 }}
          className={`p-2.5 rounded-xl transition-all duration-300 ${
            isDarkMode
              ? "bg-neutral-900 text-neutral-400 hover:text-white"
              : "bg-neutral-100 text-neutral-600 hover:text-neutral-900"
          }`}
        >
          <motion.div animate={{ rotate: isDarkMode ? 0 : 180 }} transition={{ duration: 0.5 }}>
            {isDarkMode ? <IconSun size={18} /> : <IconMoon size={18} />}
          </motion.div>
        </motion.button>
      </nav>

      <div className="pt-20 md:pt-28 px-4 md:px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
        {/* LEFT PANEL: CONFIG */}
        <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
          <Section icon={IconUser} title="01. Persona">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <motion.div
                whileHover={{ y: -2 }}
                className={`${
                  isDarkMode
                    ? "bg-neutral-900/80 border border-white/5"
                    : "bg-white border border-neutral-200/50 shadow-sm"
                } p-4 md:p-5 rounded-2xl backdrop-blur-sm transition-all duration-300`}
              >
                <label
                  className={`text-[8px] font-black uppercase tracking-wider block mb-2 ${
                    isDarkMode ? "text-neutral-500" : "text-neutral-500"
                  }`}
                >
                  Age
                </label>
                <input
                  type="number"
                  value={config.age}
                  onChange={(e) => setConfig({ ...config, age: e.target.value })}
                  className="bg-transparent text-xl md:text-2xl font-black w-full outline-none"
                />
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                className={`${
                  isDarkMode
                    ? "bg-neutral-900/80 border border-white/5"
                    : "bg-white border border-neutral-200/50 shadow-sm"
                } p-4 md:p-5 rounded-2xl backdrop-blur-sm transition-all duration-300`}
              >
                <label
                  className={`text-[8px] font-black uppercase tracking-wider block mb-2 ${
                    isDarkMode ? "text-neutral-500" : "text-neutral-500"
                  }`}
                >
                  Height
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={config.height}
                  onChange={(e) => setConfig({ ...config, height: e.target.value })}
                  className="bg-transparent text-xl md:text-2xl font-black w-full outline-none"
                />
              </motion.div>
            </div>
          </Section>

          <Section icon={IconShirt} title="02. Wardrobe">
            <div className="flex flex-wrap gap-2 md:gap-2.5 max-h-44 md:max-h-56 overflow-y-auto pr-2 custom-scrollbar">
              <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                  width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: ${isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"};
                  border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: ${isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"};
                  border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background: ${isDarkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"};
                }
              `}</style>
              {CLOTHES.map((item, idx) => (
                <motion.button
                  key={item.id}
                  onClick={() => toggleClothing(item.id)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 md:px-5 md:py-2.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                    config.clothes.includes(item.id)
                      ? `${isDarkMode ? "bg-white text-neutral-900 shadow-lg" : "bg-neutral-900 text-white shadow-lg"}`
                      : `${
                          isDarkMode
                            ? "bg-neutral-900/50 border border-white/10 text-neutral-500 hover:border-white/20 hover:bg-neutral-900/80"
                            : "bg-neutral-100 border border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:shadow-sm"
                        }`
                  }`}
                >
                  {item.name}
                </motion.button>
              ))}
            </div>
          </Section>

          <Section icon={IconCpu} title="03. Engine">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 md:gap-3 max-h-56 md:max-h-72 overflow-y-auto pr-2 custom-scrollbar">
              {MODELS.map((m, idx) => (
                <motion.button
                  key={m.id}
                  onClick={() => setConfig({ ...config, selectedModel: m.id })}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-3.5 md:p-4 rounded-2xl transition-all duration-300 flex flex-col items-start gap-2 text-left relative overflow-hidden group ${
                    config.selectedModel === m.id
                      ? `${
                          isDarkMode
                            ? "bg-white/5 border-2 border-white/20 shadow-lg"
                            : "bg-neutral-900/5 border-2 border-neutral-900/20 shadow-lg"
                        }`
                      : `${
                          isDarkMode
                            ? "bg-neutral-900/40 border border-white/5 hover:border-white/10 hover:bg-neutral-900/60"
                            : "bg-white border border-neutral-200/50 hover:border-neutral-300 hover:shadow-sm"
                        }`
                  }`}
                >
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                      isDarkMode
                        ? "bg-gradient-to-r from-transparent via-white/5 to-transparent"
                        : "bg-gradient-to-r from-transparent via-neutral-900/5 to-transparent"
                    }`}
                  />

                  <div className="flex justify-between w-full items-center z-10">
                    <span
                      className={`text-[7px] md:text-[8px] font-black px-2 py-1 rounded-md uppercase ${
                        config.selectedModel === m.id
                          ? `${isDarkMode ? "bg-white text-neutral-900" : "bg-neutral-900 text-white"}`
                          : `${isDarkMode ? "bg-neutral-800/80 text-neutral-500" : "bg-neutral-200 text-neutral-600"}`
                      }`}
                    >
                      {m.provider}
                    </span>
                    <span
                      className={`text-[7px] font-bold uppercase ${
                        isDarkMode ? "text-neutral-600" : "text-neutral-400"
                      }`}
                    >
                      {m.speed}
                    </span>
                  </div>
                  <span className="text-[11px] md:text-[12px] font-black uppercase leading-tight z-10">{m.name}</span>
                </motion.button>
              ))}
            </div>
          </Section>

          <Section icon={IconCactus} title="04. Context">
            <div
              className={`flex gap-1.5 p-1.5 rounded-2xl mb-4 ${
                isDarkMode ? "bg-neutral-900/60 border border-white/5" : "bg-neutral-100 border border-neutral-200/50"
              }`}
            >
              {["studio", "ambiance"].map((m) => (
                <motion.button
                  key={m}
                  onClick={() => setMode(m)}
                  whileTap={{ scale: 0.95 }}
                  className={`relative flex-1 py-2.5 md:py-3 rounded-xl font-black text-[10px] uppercase transition-all duration-300 ${
                    mode === m
                      ? `${isDarkMode ? "text-neutral-900" : "text-white"}`
                      : `${isDarkMode ? "text-neutral-600" : "text-neutral-500"}`
                  }`}
                >
                  {mode === m && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute inset-0 rounded-xl ${isDarkMode ? "bg-white" : "bg-neutral-900"}`}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{m}</span>
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {mode === "ambiance" && (
                <motion.textarea
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  placeholder="Describe environment..."
                  value={config.decor}
                  onChange={(e) => setConfig({ ...config, decor: e.target.value })}
                  className={`w-full p-4 rounded-2xl h-24 md:h-28 outline-none text-[11px] resize-none transition-all duration-300 ${
                    isDarkMode
                      ? "bg-neutral-900/60 border border-white/10 text-white placeholder:text-neutral-600 focus:border-white/30 focus:bg-neutral-900/80"
                      : "bg-white border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:shadow-sm"
                  }`}
                />
              )}
            </AnimatePresence>
          </Section>

          <motion.div className="pt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <motion.button
              onClick={runInference}
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className={`relative w-full py-6 md:py-7 rounded-[2rem] font-black text-base md:text-lg uppercase italic tracking-[0.25em] transition-all duration-500 flex items-center justify-center gap-3 overflow-hidden group ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              } ${isDarkMode ? "bg-white text-neutral-900 shadow-2xl" : "bg-neutral-900 text-white shadow-2xl"}`}
            >
              <motion.div
                className={`absolute inset-0 ${
                  isDarkMode
                    ? "bg-gradient-to-r from-neutral-200 via-white to-neutral-200"
                    : "bg-gradient-to-r from-neutral-800 via-neutral-900 to-neutral-800"
                }`}
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />

              <span className="relative z-10 flex items-center gap-3">
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      <IconCpu size={20} />
                    </motion.div>
                    Linking...
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Neural Render</span>
                    <span className="sm:hidden">Run</span>
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <IconSend size={20} />
                    </motion.div>
                  </>
                )}
              </span>
            </motion.button>
          </motion.div>
        </div>

        {/* RIGHT PANEL: PREVIEW */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className={`relative lg:sticky lg:top-28 w-full aspect-[4/5] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden flex items-center justify-center transition-all duration-500 backdrop-blur-xl ${
              isDarkMode
                ? "bg-neutral-900/40 border border-white/10 shadow-2xl"
                : "bg-white border border-neutral-200/50 shadow-2xl"
            }`}
          >
            <div className="relative z-10 w-full h-full">
              <MannequinViewer config={config} />
            </div>

            {/* AI RESULT OVERLAY */}
            <AnimatePresence>
              {generatedImage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 z-20 bg-black/96 backdrop-blur-2xl flex flex-col items-center justify-center p-6"
                >
                  <div className="relative w-full h-full max-w-lg flex flex-col items-center justify-center">
                    <motion.img
                      src={generatedImage}
                      alt="Render"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="max-h-[75vh] md:max-h-[85%] w-auto rounded-2xl md:rounded-[2.5rem] border-2 border-white/20 shadow-2xl"
                    />

                    <motion.button
                      onClick={() => setGeneratedImage(null)}
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-4 right-4 md:top-6 md:right-6 bg-white/10 backdrop-blur-md p-3 md:p-4 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300"
                    >
                      <IconX size={22} />
                    </motion.button>

                    <motion.div
                      className="mt-6 flex gap-3"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-white text-neutral-900 rounded-full font-black text-[10px] uppercase shadow-lg"
                      >
                        Export
                      </motion.button>
                      <motion.button
                        onClick={() => setGeneratedImage(null)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 border-2 border-white/30 text-white rounded-full font-black text-[10px] uppercase backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                      >
                        Back
                      </motion.button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {loading && (
              <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
                <motion.div
                  initial={{ y: "-100%" }}
                  animate={{ y: "100%" }}
                  transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  className={`w-full h-[40%] ${
                    isDarkMode
                      ? "bg-gradient-to-b from-transparent via-white/10 to-transparent border-y border-white/20"
                      : "bg-gradient-to-b from-transparent via-neutral-900/10 to-transparent border-y border-neutral-900/20"
                  }`}
                />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  )
}
