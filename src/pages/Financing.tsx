import { motion } from "framer-motion";
import { CheckCircle, CreditCard, Calendar, BadgePercent } from "lucide-react";
import { useBrand } from "../BrandContext";

const plans = [
  { icon: CreditCard, title: "0% APR for 12 Months", desc: "On approved credit. No interest if paid in full within 12 months." },
  { icon: Calendar, title: "Flexible Monthly Payments", desc: "Low monthly payments spread over 24, 36, or 48 months." },
  { icon: BadgePercent, title: "No Money Down", desc: "Start your project today with $0 down and no hidden fees." },
];

export default function Financing() {
  const { name } = useBrand();

  return (
    <section className="pt-36 pb-24 px-6 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-blue-600 text-sm font-semibold tracking-widest uppercase mb-3">Financing</p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">Flexible Financing Options</h1>
          <p className="mt-4 text-slate-600 text-lg max-w-2xl mx-auto">
            {name} partners with leading lenders to offer affordable financing so you can get the roof you need, when you need it.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((p) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-slate-50 rounded-2xl p-8 border border-slate-200 text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-14 h-14 rounded-xl bg-blue-600/10 flex items-center justify-center mx-auto mb-5">
                <p.icon className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">{p.title}</h3>
              <p className="text-slate-600 text-sm">{p.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-blue-600/5 rounded-2xl p-8 border border-blue-200"
        >
          <h3 className="text-xl font-bold text-slate-900 mb-4">Easy Approval Process</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {["Quick online application", "Same-day approval decisions", "No prepayment penalties", "Fixed rates guaranteed"].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <span className="text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
