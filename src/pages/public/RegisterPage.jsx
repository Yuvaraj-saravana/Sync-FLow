import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, ArrowRight, ShieldCheck, Info } from 'lucide-react'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: 'Elena Rostova',
    workEmail: 'elena@syncflow.health',
    organization: 'Acme Technologies',
    role: 'employee',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/employee/dashboard')
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
            Join SYNC FLOW
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Empower your health, rhythm, and professional productivity
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
          {/* Dev Preview Notice */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs mb-5">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Development Preview Only:</strong> User registration is a frontend demonstration. No backend user account will be created.
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-purple-600 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Work Email
              </label>
              <input
                type="email"
                value={formData.workEmail}
                onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-purple-600 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Organization / Team
              </label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-purple-600 bg-slate-50/50"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-purple-700 hover:bg-purple-800 shadow-xs shadow-purple-600/30 transition-all mt-2"
            >
              <span>Continue to Employee Portal Preview</span>
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
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-purple-700 hover:underline">
            Sign In
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
