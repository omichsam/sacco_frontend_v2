import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Building2, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { login } from '@/api/auth'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { access, refresh, user } = await login(username, password)
      setAuth(user, access, refresh)
      navigate('/select-role')
    } catch {
      setError('Invalid username or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6">

        {/* Logo */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-11 h-11 rounded-xl bg-[#800000] flex items-center justify-center">
            <Building2 size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">Ongata Academy SACCO</p>
            <p className="text-xs text-gray-400">Management Portal</p>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-0.5">Sign in to your account</p>
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/15 transition-colors bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-gray-300 text-sm outline-none focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/15 transition-colors bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#800000] hover:bg-[#a00000] disabled:opacity-60 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm mt-2"
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

      </div>

      <p className="text-xs text-gray-400 mt-5">© 2025 Ongata Academy SACCO</p>
    </div>
  )
}
