import { useState } from "react";
import { Phone, User, ClipboardCheck, Mail, MapPin } from "lucide-react";
import { useBrand } from "../BrandContext";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const { name, phone, email, city } = useBrand();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <footer id="contact" className="bg-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Get Your <span className="text-blue-400">Free Quote</span>
          </h2>
          <p className="text-slate-400 mb-8 max-w-md">
            Fill out the form and the {name} team will call you within 30
            minutes for a free, no-obligation inspection in {city}.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-300">
              <Phone className="w-5 h-5 text-blue-400" />
              <span>{phone}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <Mail className="w-5 h-5 text-blue-400" />
              <span>Email the {name} team at {email}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <MapPin className="w-5 h-5 text-blue-400" />
              <span>Proudly serving {city}</span>
            </div>
          </div>
        </div>

        <div>
          {submitted ? (
            <div className="text-center py-12 bg-slate-800/50 rounded-2xl border border-slate-700">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <ClipboardCheck className="w-8 h-8 text-emerald-500" />
              </div>
              <p className="text-2xl font-bold text-white mb-2">Request Received!</p>
              <p className="text-slate-400">
                The {name} team will reach out shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-12 pr-4 py-3.5 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="tel"
                    required
                    placeholder={phone}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-12 pr-4 py-3.5 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-all duration-300 shadow-lg shadow-orange-500/25 text-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                Request Free Inspection
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} {name}. All rights reserved. | The #1 roofers in {city}
        </div>
      </div>
    </footer>
  );
}
