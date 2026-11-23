import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, ArrowRight, ShieldCheck, Info } from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('elena@syncflow.health')
  const [password, setPassword] = useState('••••••••••••')
  const [role, setRole] = useState('employee')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (role === 'leader') {
      navigate('/leader/dashboard')
    } else if (role === 'admin') {
      navigate('/admin/dashboard')
    } else {
      navigate('/employee/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfbfe] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-700 via-purple-800 to-indigo-900 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-purple-200" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              SYNC FLOW
            </span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Sign In to SYNC FLOW
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Access your personalized wellness & workplace dashboard
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
          {/* Dev Preview Disclaimer */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs mb-5">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Development Preview Only:</strong> Quick persona selection is provided for UI navigation testing. Backend authentication and security are not yet implemented.
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Select Persona for Preview
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'employee', label: 'Employee', path: '/employee/dashboard' },
                  { id: 'leader', label: 'Leader', path: '/leader/dashboard' },
                  { id: 'admin', label: 'Admin', path: '/admin/dashboard' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRole(item.id)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                      role === item.id
                        ? 'bg-purple-50 border-purple-300 text-purple-800 font-bold shadow-2xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Work Email (Demo)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-purple-600 focus:ring-1 focus:ring-purple-600 bg-slate-50/50"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-700">
                  Password (Demo)
                </label>
                <span className="text-xs text-purple-700 hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-purple-600 focus:ring-1 focus:ring-purple-600 bg-slate-50/50"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-purple-700 hover:bg-purple-800 shadow-xs shadow-purple-600/30 transition-all mt-2"
            >
              <span>Preview {role.charAt(0).toUpperCase() + role.slice(1)} Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Employee-Controlled Privacy Architecture</span>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Don't have an enterprise account?{' '}
          <Link to="/register" className="font-semibold text-purple-700 hover:underline">
            Request an invite
          </Link>
          {' · '}
          <Link to="/" className="text-slate-600 hover:underline">
            Back to Home
          </Link>
        </p>
      </div>
    </div>
  )
}
