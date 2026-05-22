import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2, ShieldCheck, TrendingUp, Gavel, Wallet, ClipboardList,
  ArrowRight, Users, CheckCircle, Lock, BarChart3, BadgeCheck,
  Phone, Mail, MapPin, Calendar, Award, Target,
} from 'lucide-react'

type Section = 'home' | 'about' | 'contact'

const roles = [
  { label: 'Administrator', icon: ShieldCheck   },
  { label: 'Director',      icon: TrendingUp    },
  { label: 'Chairman',      icon: Gavel         },
  { label: 'Treasury',      icon: Wallet        },
  { label: 'Secretary',     icon: ClipboardList },
]

export default function LandingPage() {
  const [section, setSection] = useState<Section>('home')

  function nav(s: Section) {
    if (s !== section) setSection(s)
  }

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes fadeSection {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
        @keyframes bobUp {
          0%, 100% { transform: translateY(0px);  }
          50%      { transform: translateY(-9px); }
        }
        @keyframes bobDown {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(9px); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.06; }
          50%      { opacity: 0.14; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes scaleFadeIn {
          from { opacity: 0; transform: scale(0.94); }
          to   { opacity: 1; transform: scale(1);    }
        }
        .anim-fade-up    { animation: fadeInUp   0.55s ease both; }
        .anim-fade-right { animation: fadeInRight 0.55s ease both; }
        .anim-scale-in   { animation: scaleFadeIn 0.55s ease both; }
        .anim-section    { animation: fadeSection 0.35s ease both; }
        .bob-up   { animation: bobUp   4s ease-in-out infinite; }
        .bob-down { animation: bobDown 4s ease-in-out infinite 2s; }
        .glow-pulse { animation: glowPulse 3s ease-in-out infinite; }
      `}</style>

      <div className="h-screen flex flex-col bg-white overflow-hidden">

        {/* ── NAVBAR ──────────────────────────────────────────────────── */}
        <header className="shrink-0 bg-white/90 backdrop-blur-xl border-b border-gray-100 z-50">
          <div className="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between gap-4">

            <div className="flex items-center gap-3 anim-fade-up" style={{ animationDelay: '0ms' }}>
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md shadow-[#800000]/25" style={{ background: 'linear-gradient(135deg, #800000, #5a0000)' }}>
                <Building2 size={18} className="text-white" />
              </div>
              <div className="leading-tight">
                <p className="font-black text-gray-900 text-[15px] tracking-tight">
                  Ongata<span className="text-[#800000]">SACCO</span>
                </p>
                <p className="text-[10px] text-gray-400 font-medium">Member Portal</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center anim-fade-up" style={{ animationDelay: '80ms' }}>
              {(['home', 'about', 'contact'] as Section[]).map((s) => (
                <button
                  key={s}
                  onClick={() => nav(s)}
                  className={`relative px-5 py-2 text-sm font-semibold capitalize transition-colors focus:outline-none ${
                    section === s ? 'text-[#800000]' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                  {section === s && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-[#800000]" />
                  )}
                </button>
              ))}
            </nav>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-2.5 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-[#800000]/25 hover:shadow-[#800000]/40 hover:-translate-y-0.5 focus:outline-none anim-fade-up"
              style={{ background: 'linear-gradient(135deg, #800000, #6b0000)', animationDelay: '160ms' }}
            >
              Sign In <ArrowRight size={14} />
            </Link>
          </div>
        </header>

        {/* ── MAIN ────────────────────────────────────────────────────── */}
        <main className="flex-1 grid lg:grid-cols-2 overflow-hidden min-h-0">

          {/* Left — switches by section */}
          <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-6 overflow-hidden">

            {/* ── HOME ── */}
            {section === 'home' && (
              <div key="home" className="space-y-5 anim-section">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#800000]/20 bg-[#800000]/5 text-[#800000] text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#800000] animate-pulse" />
                    Established 2010
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-green-200 bg-green-50 text-green-700 text-xs font-semibold">
                    <BadgeCheck size={12} />
                    Kenya SACCO Licensed
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
                  Save &amp; Grow<br />
                  With <span className="text-[#800000]">Confidence</span>
                </h1>

                <p className="text-gray-500 text-sm sm:text-[15px] leading-relaxed max-w-md">
                  Ongata Academy SACCO's official digital portal — purpose-built for Kenyan
                  co-operatives. Manage members, process loans, and track shares all in one place.
                </p>

                <ul className="space-y-2.5">
                  {[
                    { icon: Lock,        text: 'Secure role-based access for every staff member'          },
                    { icon: BarChart3,   text: 'Real-time loan processing and shares management'          },
                    { icon: CheckCircle, text: 'Compliant with Kenya Co-operative Societies Act, Cap 490' },
                  ].map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-start gap-3 text-sm text-gray-600">
                      <div className="w-5 h-5 rounded-full bg-[#800000]/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon size={11} className="text-[#800000]" />
                      </div>
                      {text}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-white font-bold rounded-xl transition-all text-sm shadow-lg shadow-[#800000]/25 hover:shadow-[#800000]/40 hover:-translate-y-0.5 focus:outline-none"
                    style={{ background: 'linear-gradient(135deg, #800000, #5a0000)' }}
                  >
                    Access Your Portal <ArrowRight size={15} />
                  </Link>
                  <button
                    onClick={() => nav('about')}
                    className="inline-flex items-center gap-2 px-6 py-2.5 border border-gray-200 hover:border-[#800000]/40 hover:text-[#800000] hover:bg-[#800000]/4 text-gray-600 font-semibold rounded-xl transition-all text-sm hover:-translate-y-0.5"
                  >
                    Learn More
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: '1,200+',   label: 'Active Members',  note: '+12 this month',  noteColor: 'text-green-600' },
                    { value: 'KES 45M+', label: 'Loans Disbursed', note: 'since inception', noteColor: 'text-gray-400'  },
                    { value: '15 Yrs',   label: 'In Operation',    note: 'Est. 2010',       noteColor: 'text-gray-400'  },
                  ].map(({ value, label, note, noteColor }) => (
                    <div key={label} className="bg-gray-50 border border-gray-100 rounded-2xl px-3 py-3.5 hover:border-[#800000]/20 transition-colors">
                      <p className="text-lg font-extrabold text-gray-900">{value}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5 font-medium">{label}</p>
                      <p className={`text-[10px] mt-1 font-semibold ${noteColor}`}>{note}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Portal access for</p>
                  <div className="flex flex-wrap gap-2">
                    {roles.map(({ label, icon: Icon }) => (
                      <div
                        key={label}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-[#800000]/40 hover:bg-[#800000]/5 hover:text-[#800000] rounded-lg text-xs font-semibold text-gray-600 transition-all cursor-default shadow-sm"
                      >
                        <Icon size={12} className="text-[#800000]" />
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── ABOUT ── */}
            {section === 'about' && (
              <div key="about" className="space-y-5 anim-section">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#800000]/20 bg-[#800000]/5 text-[#800000] text-xs font-semibold">
                    <Award size={12} />
                    About Us
                  </span>
                </div>

                <div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight">
                    Empowering Kenya's<br />
                    <span className="text-[#800000]">Saving Communities</span>
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed mt-3 max-w-md">
                    Founded in 2010, Ongata Academy SACCO has grown to serve over 1,200 members
                    across Ongata Rongai and the wider Kajiado County region. We are licensed and
                    regulated under the Kenya Sacco Societies Regulatory Authority (SASRA).
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Target,   title: 'Our Mission',   desc: 'To provide affordable credit and savings solutions that improve members\' livelihoods.' },
                    { icon: Award,    title: 'Our Vision',    desc: 'To be the leading community SACCO in Kenya, known for transparency and growth.'        },
                    { icon: Calendar, title: 'Founded',       desc: 'Registered in 2010 under the Co-operative Societies Act, Cap 490.'                     },
                    { icon: BadgeCheck, title: 'Regulated',  desc: 'Fully licensed by SASRA and compliant with all Kenya financial regulations.'             },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 hover:border-[#800000]/20 transition-colors">
                      <div className="w-8 h-8 rounded-xl bg-[#800000]/10 flex items-center justify-center mb-2">
                        <Icon size={15} className="text-[#800000]" />
                      </div>
                      <p className="text-xs font-bold text-gray-900">{title}</p>
                      <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-white font-bold rounded-xl text-sm shadow-lg shadow-[#800000]/25 hover:shadow-[#800000]/40 hover:-translate-y-0.5 transition-all focus:outline-none"
                    style={{ background: 'linear-gradient(135deg, #800000, #5a0000)' }}
                  >
                    Access Your Portal <ArrowRight size={15} />
                  </Link>
                  <button
                    onClick={() => nav('contact')}
                    className="inline-flex items-center gap-2 px-6 py-2.5 border border-gray-200 hover:border-[#800000]/40 hover:text-[#800000] text-gray-600 font-semibold rounded-xl transition-all text-sm hover:-translate-y-0.5"
                  >
                    Contact Us
                  </button>
                </div>
              </div>
            )}

            {/* ── CONTACT ── */}
            {section === 'contact' && (
              <div key="contact" className="space-y-5 anim-section">
                <div>
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#800000]/20 bg-[#800000]/5 text-[#800000] text-xs font-semibold">
                    <Phone size={12} />
                    Contact Us
                  </span>
                </div>

                <div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight">
                    We're Here<br />
                    <span className="text-[#800000]">To Help You</span>
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed mt-3 max-w-md">
                    Reach our support team for help accessing your portal, loan inquiries,
                    or membership information.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { icon: Phone,  label: 'Phone',    value: '+254 700 000 000',                   note: 'Mon–Fri, 8 AM – 5 PM'   },
                    { icon: Mail,   label: 'Email',    value: 'info@ongataacademysacco.co.ke',      note: 'We reply within 24 hrs'  },
                    { icon: MapPin, label: 'Location', value: 'Ongata Rongai, Kajiado County',     note: 'Kenya'                    },
                  ].map(({ icon: Icon, label, value, note }) => (
                    <div key={label} className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:border-[#800000]/20 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-[#800000]/10 flex items-center justify-center shrink-0">
                        <Icon size={16} className="text-[#800000]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                        <p className="text-sm font-semibold text-gray-900 mt-0.5">{value}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{note}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-white font-bold rounded-xl text-sm shadow-lg shadow-[#800000]/25 hover:shadow-[#800000]/40 hover:-translate-y-0.5 transition-all focus:outline-none self-start"
                  style={{ background: 'linear-gradient(135deg, #800000, #5a0000)' }}
                >
                  Sign In to Portal <ArrowRight size={15} />
                </Link>
              </div>
            )}
          </div>

          {/* Right — visual panel (desktop only, always visible) */}
          <div className="hidden lg:flex relative bg-gray-50 border-l border-gray-100 overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#800000] rounded-full blur-3xl pointer-events-none glow-pulse" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#800000] rounded-full blur-3xl pointer-events-none glow-pulse" style={{ animationDelay: '1.5s' }} />
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            <div className="absolute top-8 right-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-4 w-44 z-10 bob-up anim-fade-right" style={{ animationDelay: '700ms' }}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center">
                  <TrendingUp size={13} className="text-green-600" />
                </div>
                <span className="text-xs text-gray-500 font-medium">Growth</span>
              </div>
              <p className="text-2xl font-extrabold text-gray-900">+18.4%</p>
              <p className="text-xs text-gray-400 mt-0.5">Annual Share Returns</p>
            </div>

            <div className="relative z-10 m-auto w-[88%] anim-scale-in" style={{ animationDelay: '500ms' }}>
              <div className="rounded-3xl shadow-2xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #800000 0%, #5a0000 60%, #3d0000 100%)' }}>
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.07) 50%, transparent 60%)', backgroundSize: '200% 100%', animation: 'shimmer 3.5s linear infinite' }} />
                <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/5" />
                <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-white/5" />
                <div className="relative p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
                        <Building2 size={22} className="text-white" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm leading-tight">Ongata Academy</p>
                        <p className="text-white/60 text-xs mt-0.5">SACCO Portal</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-white/70 border border-white/20 px-3 py-1 rounded-full">Est. 2010</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Members',       value: '1,247'    },
                      { label: 'Active Loans',  value: '384'      },
                      { label: 'Share Capital', value: 'KES 12.4M'},
                      { label: 'Disbursed',     value: 'KES 45M+' },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-white/10 rounded-2xl px-4 py-4 hover:bg-white/15 transition-colors">
                        <p className="text-white/60 text-xs uppercase tracking-wide">{label}</p>
                        <p className="text-white font-extrabold text-xl mt-1">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <p className="text-white/50 text-xs">Co-operative Societies Act, Cap 490</p>
                    <div className="flex gap-1.5">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-5 h-5 rounded-full bg-white/20 border border-white/10" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-8 right-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-4 w-44 z-10 bob-down anim-fade-right" style={{ animationDelay: '850ms' }}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-[#800000]/10 flex items-center justify-center">
                  <Users size={13} className="text-[#800000]" />
                </div>
                <span className="text-xs text-gray-500 font-medium">Members</span>
              </div>
              <p className="text-2xl font-extrabold text-gray-900">1,247</p>
              <p className="text-xs text-green-600 mt-0.5 font-semibold">+12 this month</p>
            </div>
          </div>

        </main>

        {/* ── FOOTER BAR ──────────────────────────────────────────────── */}
        <footer className="shrink-0 bg-gray-900 px-4 sm:px-6 py-3">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1 text-xs text-gray-500">
            <p>© 2025 Ongata Academy SACCO. All rights reserved.</p>
            <p>Registered under the Co-operative Societies Act, Cap 490</p>
          </div>
        </footer>

      </div>
    </>
  )
}
