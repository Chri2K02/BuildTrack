import { useClerk } from "@clerk/clerk-react";
import { ArrowRight, CheckCircle, Briefcase, Users, FileText, DollarSign } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Client Management",
    desc: "Store every client's contact info in one place. Never dig through texts for a phone number again.",
  },
  {
    icon: Briefcase,
    title: "Job Tracking",
    desc: "Log jobs as pending, in progress, or completed. See your full workload at a glance.",
  },
  {
    icon: FileText,
    title: "Automatic Invoices",
    desc: "Every job you log gets an invoice generated automatically. Mark paid in one click.",
  },
  {
    icon: DollarSign,
    title: "Revenue Overview",
    desc: "Know exactly what you've earned, what's owed, and what's overdue — updated in real time.",
  },
];

const testimonials = [
  {
    quote: "I used to track everything in a notebook. BuildTrack replaced it in about ten minutes.",
    name: "Carlos M.",
    role: "General Contractor · Phoenix, AZ",
    avatar: "https://i.pravatar.cc/80?img=12",
  },
  {
    quote: "Finally stopped losing invoices. Everything's in one spot and my clients pay faster.",
    name: "Deb W.",
    role: "Independent Contractor · Austin, TX",
    avatar: "https://i.pravatar.cc/80?img=47",
  },
  {
    quote: "The dashboard alone is worth it. I see my pipeline and outstanding invoices before morning coffee.",
    name: "Tony R.",
    role: "Remodeling · Chicago, IL",
    avatar: "https://i.pravatar.cc/80?img=53",
  },
];

// Unsplash construction/contractor photos
const HERO_IMG = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=80";
const FEATURE_IMG = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80";
const SITE_IMG = "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80";

export default function Landing() {
  const { openSignUp, openSignIn } = useClerk();

  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-[Inter,system-ui,sans-serif]">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-orange-500 rounded flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" stroke="white" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <span className="font-bold text-sm tracking-tight">BuildTrack</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => openSignIn()} className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
            Sign in
          </button>
          <button
            onClick={() => openSignUp()}
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Get started free
          </button>
        </div>
      </nav>

      {/* Hero — split layout */}
      <section className="max-w-6xl mx-auto px-8 pt-16 pb-24 grid grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-gray-400 font-medium mb-8">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
            Free for independent contractors
          </div>
          <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight mb-6">
            Run your jobs.<br />
            <span className="text-orange-500">Get paid faster.</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-10">
            BuildTrack keeps your clients, jobs, and invoices in one place — so you spend less time on paperwork and more time on the job.
          </p>
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => openSignUp()}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3.5 rounded-xl text-base transition-colors shadow-lg shadow-orange-500/25"
            >
              Start for free <ArrowRight size={18} />
            </button>
            <button
              onClick={() => openSignIn()}
              className="text-gray-400 hover:text-white font-medium text-sm transition-colors"
            >
              Sign in →
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {["No credit card required", "Setup in under 2 minutes", "Free forever"].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-gray-500">
                <CheckCircle size={14} className="text-orange-500 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Hero photo */}
        <div className="relative">
          <div className="rounded-2xl overflow-hidden aspect-[4/5] shadow-2xl shadow-black/60">
            <img
              src={HERO_IMG}
              alt="Contractor on job site"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
          {/* Floating stat card */}
          <div className="absolute -bottom-4 -left-6 bg-white text-gray-900 rounded-xl shadow-2xl p-4 min-w-[160px]">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">This month</p>
            <p className="text-2xl font-extrabold text-gray-900">$12,400</p>
            <p className="text-xs text-emerald-600 font-semibold mt-0.5">↑ 18% vs last month</p>
          </div>
          {/* Floating badge */}
          <div className="absolute -top-3 -right-4 bg-[#161b22] border border-white/10 rounded-xl shadow-xl p-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-white text-xs font-semibold">3 jobs in progress</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature section — photo left, text right */}
      <section className="border-t border-white/5">
        <div className="max-w-6xl mx-auto px-8 py-24 grid grid-cols-2 gap-16 items-center">
          <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/50 aspect-[4/3]">
            <img
              src={FEATURE_IMG}
              alt="Contractor working on renovation"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-orange-500 text-xs font-semibold uppercase tracking-widest mb-4">Built for the field</p>
            <h2 className="text-3xl font-extrabold tracking-tight mb-6 leading-tight">
              Everything you need to run your business
            </h2>
            <div className="space-y-5">
              {features.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-9 h-9 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={16} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm mb-0.5">{title}</p>
                    <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Photo banner */}
      <section className="relative h-72 overflow-hidden">
        <img src={SITE_IMG} alt="Construction site" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-[#0d1117]/75" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
          <p className="text-orange-500 text-xs font-semibold uppercase tracking-widest mb-3">Why BuildTrack</p>
          <h2 className="text-3xl font-extrabold tracking-tight max-w-xl">
            The average contractor loses $4,200/year to disorganized invoicing.
          </h2>
          <p className="text-gray-400 mt-3 text-sm">Don't be that contractor.</p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-8 py-24 border-t border-white/5">
        <div className="mb-12 text-center">
          <p className="text-orange-500 text-xs font-semibold uppercase tracking-widest mb-3">Word on the street</p>
          <h2 className="text-3xl font-extrabold tracking-tight">Contractors who made the switch</h2>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {testimonials.map(({ quote, name, role, avatar }) => (
            <div key={name} className="bg-[#161b22] border border-white/5 rounded-xl p-6 flex flex-col">
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#f97316">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed flex-1 mb-5">"{quote}"</p>
              <div className="flex items-center gap-3">
                <img src={avatar} alt={name} className="w-9 h-9 rounded-full object-cover" />
                <div>
                  <p className="text-white font-semibold text-sm">{name}</p>
                  <p className="text-gray-500 text-xs">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-8 pb-24">
        <div
          className="rounded-2xl overflow-hidden relative"
          style={{
            backgroundImage: `url(${HERO_IMG})`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        >
          <div className="absolute inset-0 bg-[#0d1117]/85" />
          <div className="relative px-12 py-16 text-center">
            <h2 className="text-4xl font-extrabold tracking-tight mb-4">
              Ready to get organized?
            </h2>
            <p className="text-gray-400 text-base mb-8 max-w-md mx-auto">
              Set up your account in minutes. No credit card, no contracts — just a cleaner way to run your business.
            </p>
            <button
              onClick={() => openSignUp()}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl text-base transition-colors shadow-lg shadow-orange-500/30"
            >
              Create your free account <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-gray-500 text-xs font-medium">BuildTrack © 2026</span>
          </div>
          <p className="text-gray-600 text-xs">Built for the trades.</p>
        </div>
      </footer>
    </div>
  );
}
