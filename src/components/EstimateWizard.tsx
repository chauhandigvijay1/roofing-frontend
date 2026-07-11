import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBrand } from "../BrandContext";

type ServiceType = "Repair" | "Full Replacement" | "Inspection" | null;
type PropertyType = "Residential" | "Commercial" | null;

export default function EstimateWizard() {
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

  if (done) {
    return (
      <section id="estimate" className="py-24 px-6 bg-slate-50">
        <div className="max-w-2xl mx-auto">
          <div className="bg-slate-900 text-white rounded-2xl shadow-2xl p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">Estimate Requested!</h3>
            <p className="text-slate-400">The {name} team will reach out within 30 minutes.</p>
          </div>
        </div>
      </section>
    );
  }

  const steps = [
    // Step 0: Service type
    <div key="step0" className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-6">What type of service do you need?</h3>
      <div className="grid gap-4">
        {(["Repair", "Full Replacement", "Inspection"] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => { setServiceType(opt); setStep(1); }}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
              serviceType === opt
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>,

    // Step 1: Property type
    <div key="step1" className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-6">What type of property?</h3>
      <div className="grid gap-4">
        {(["Residential", "Commercial"] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => { setPropertyType(opt); setStep(2); }}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
              propertyType === opt
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      <button onClick={() => setStep(0)} className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
        ← Back
      </button>
    </div>,

    // Step 2: Contact form
    <form key="step2" onSubmit={handleSubmit} className="space-y-5">
      <h3 className="text-xl font-bold text-white mb-6">Where should we send your free estimate?</h3>
      {(["name", "phone", "email", "address"] as const).map((field) => (
        <div key={field}>
          <label className="block text-sm text-slate-400 mb-1.5 capitalize">{field}</label>
          <input
            type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
            required
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            placeholder={field === "phone" ? phone : `Your ${field}`}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-5 py-3.5 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      ))}
      <div className="flex gap-3 pt-2">
        <button onClick={() => setStep(1)} type="button" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
          ← Back
        </button>
        <button
          type="submit"
          className="flex-1 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/25 text-lg hover:scale-[1.02] active:scale-[0.98]"
        >
          Submit Estimate Request
        </button>
      </div>
    </form>,
  ];

  return (
    <section id="estimate" className="py-24 px-6 bg-slate-50">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-blue-600 text-sm font-semibold tracking-widest uppercase mb-3">Free Estimate</p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
            Get Your Free Estimate in Under 60 Seconds
          </h2>
          <p className="mt-4 text-slate-600 text-lg max-w-xl mx-auto">
            Serving {city} and all surrounding areas.
          </p>
        </motion.div>

        <div className="bg-slate-900 rounded-2xl shadow-2xl p-8">
          {/* Step indicators */}
          <div className="flex gap-2 mb-8">
            {[0, 1, 2].map((s) => (
              <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${step >= s ? "bg-blue-500" : "bg-slate-700"}`} />
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
              {steps[step]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
