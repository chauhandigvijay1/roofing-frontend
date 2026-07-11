import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBrand } from "../BrandContext";

type ServiceType = "Repair" | "Full Replacement" | "Inspection" | null;
type PropertyType = "Residential" | "Commercial" | null;

interface Props {
  variant?: "full" | "sidebar";
}

export default function EstimateWizard({ variant = "full" }: Props) {
  const { name, phone, city } = useBrand();
  const [step, setStep] = useState(0);
  const [serviceType, setServiceType] = useState<ServiceType>(null);
  const [propertyType, setPropertyType] = useState<PropertyType>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
  };

  const wizardCard = (
    <div id="estimate-wizard" className="bg-white border border-stone-200 rounded-sm shadow-xl p-6">
      <div className="flex gap-2 mb-6">
        {[0, 1, 2].map((s) => (
          <div key={s} className={`h-1 flex-1 rounded-sm transition-colors duration-300 ${step >= s ? "bg-amber-600" : "bg-stone-200"}`} />
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {step === 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-zinc-800 mb-4">What type of service do you need?</h3>
              <div className="grid gap-3">
                {(["Repair", "Full Replacement", "Inspection"] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setServiceType(opt); setStep(1); }}
                    className={`w-full py-2.5 rounded-sm font-semibold text-sm transition-all duration-300 ${
                      serviceType === opt
                        ? "bg-amber-600 text-white"
                        : "bg-stone-50 border border-stone-200 text-zinc-800 hover:border-amber-600 hover:bg-amber-50 hover:text-amber-900"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-zinc-800 mb-4">What type of property?</h3>
              <div className="grid gap-3">
                {(["Residential", "Commercial"] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setPropertyType(opt); setStep(2); }}
                    className={`w-full py-2.5 rounded-sm font-semibold text-sm transition-all duration-300 ${
                      propertyType === opt
                        ? "bg-amber-600 text-white"
                        : "bg-stone-50 border border-stone-200 text-zinc-800 hover:border-amber-600 hover:bg-amber-50 hover:text-amber-900"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(0)} className="text-xs text-zinc-500 hover:text-zinc-700 transition-colors">← Back</button>
            </div>
          )}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-bold text-zinc-800 mb-4">Where should we send your free estimate?</h3>
              {(["name", "phone", "email", "address"] as const).map((field) => (
                <div key={field}>
                  <label className="block text-xs text-zinc-500 mb-1 capitalize">{field}</label>
                  <input
                    type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                    required
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    placeholder={field === "phone" ? phone : `Your ${field}`}
                    className="w-full bg-stone-50 border border-stone-200 rounded-sm px-4 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              ))}
              <div className="flex gap-2 pt-1">
                <button onClick={() => setStep(1)} type="button" className="text-xs text-zinc-500 hover:text-zinc-700 transition-colors">← Back</button>
                <button type="submit" className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-sm transition-all duration-300 shadow-lg shadow-amber-600/25 text-sm hover:scale-[1.02] active:scale-[0.98]">
                  Submit Estimate Request
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );

  if (done) {
    return (
      <section id="estimate" className="py-24 px-6 bg-stone-50">
        <div className="max-w-2xl mx-auto">
          <div className="bg-zinc-900 text-white rounded-sm shadow-xl shadow-stone-200/50 p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">Estimate Requested!</h3>
            <p className="text-zinc-400">The {name} team will reach out within 30 minutes.</p>
          </div>
        </div>
      </section>
    );
  }

  if (variant === "sidebar") {
    return (
      <div id="estimate" className="max-w-sm w-full mx-auto">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-zinc-900">Free Estimate</h3>
          <p className="text-xs text-zinc-500 mt-0.5">Serving {city}</p>
        </div>
        {wizardCard}
      </div>
    );
  }

  return (
    <section id="estimate" className="py-24 px-6 bg-stone-50">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-amber-600 text-sm font-semibold tracking-widest uppercase mb-3">Free Estimate</p>
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900">Get Your Free Estimate in Under 60 Seconds</h2>
          <p className="mt-4 text-zinc-600 text-lg max-w-xl mx-auto">Serving {city} and all surrounding areas.</p>
        </motion.div>
        {wizardCard}
      </div>
    </section>
  );
}
