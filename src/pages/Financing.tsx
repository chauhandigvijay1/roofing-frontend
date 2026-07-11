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
          <h1 className="text-4xl md:text-5xl font-oswald uppercase tracking-wider font-bold text-zinc-900">Flexible Financing Options</h1>
          <div className="w-16 h-1 bg-crimson mx-auto mt-4 mb-8"></div>
          <p className="text-zinc-600 text-lg max-w-2xl mx-auto font-serif">
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
              className="bg-stone-50 p-8 border border-stone-200 border-t-4 border-t-crimson text-center hover:shadow-xl hover:shadow-stone-200/50 transition-shadow"
            >
              <div className="w-14 h-14 bg-crimson/10 flex items-center justify-center mx-auto mb-5">
                <p.icon className="w-7 h-7 text-crimson" />
              </div>
              <h3 className="text-lg font-oswald uppercase tracking-wider font-bold text-zinc-900 mb-3">{p.title}</h3>
              <p className="text-zinc-600 text-sm font-serif">{p.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-crimson/5 p-8 border border-crimson/20"
        >
          <h3 className="text-xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mb-4">Easy Approval Process</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {["Quick online application", "Same-day approval decisions", "No prepayment penalties", "Fixed rates guaranteed"].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-crimson shrink-0 mt-0.5" />
                <span className="text-zinc-700 font-serif">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
