'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Logo } from '@/components/Logo'
import { supabase } from '@/lib/supabase'
import { Eye, EyeOff, Loader2, CheckCircle, XCircle, Shield, Key, Lock } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'

function SetPasswordContent() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setMustChangePassword } = useAuthStore()

  useEffect(() => {
    // Check both hash (from direct Supabase redirect) and query params
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const token = searchParams.get('access_token') || hashParams.get('access_token') ||
                  searchParams.get('token') || hashParams.get('token') ||
                  searchParams.get('token_hash') || hashParams.get('token_hash');
    const type = searchParams.get('type') || hashParams.get('type');
    const email = searchParams.get('email') || hashParams.get('email');

    // If we have a token but no type, assume it's recovery
    if (token && !type) {
      // Redirect to set-password with proper params if coming from hash
      if (hashParams.get('access_token')) {
        const params = new URLSearchParams({
          access_token: token,
          type: 'recovery',
        });
        if (email) params.append('email', email);
        const refreshToken = hashParams.get('refresh_token');
        if (refreshToken) params.append('refresh_token', refreshToken);
        router.replace(`/set-password?${params.toString()}`);
        return;
      }
    }

    if (type === 'recovery' && token) {
      setMessage({ type: 'info', text: 'Please set your new password to complete the recovery process.' })
    } else if (type === 'invite' && token) {
      setMessage({ type: 'info', text: 'Welcome! Please set your password to activate your account.' })
    } else if (!token) {
      // No token found, redirect to login
      router.push('/login?error=Invalid or expired reset link')
    }
  }, [searchParams, router])

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' })
      return
    }
    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' })
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) throw error

      setMessage({ type: 'success', text: 'Password updated successfully! Redirecting to portal...' })
      setMustChangePassword(false)
      setTimeout(() => {
        router.push('/portal')
      }, 2000)
    } catch (error: any) {
      console.error('Error setting password:', error)
      setMessage({ type: 'error', text: error.message || 'Failed to set password.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmM2Y0ZjYiIGZpbGwtb3BhY2l0eT0iMC40Ij48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>
      
      <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Logo width={180} height={63} className="mx-auto" />
          </div>

          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="space-y-2 text-center pb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900">
                  Set Your Password
                </CardTitle>
              </div>
              <CardDescription className="text-slate-600">
                Create a secure password for your account
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSetPassword} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-slate-700 flex items-center space-x-2">
                    <Key className="h-4 w-4" />
                    <span>New Password</span>
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 pr-12 border-slate-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirm-password" className="text-sm font-medium text-slate-700 flex items-center space-x-2">
                    <Lock className="h-4 w-4" />
                    <span>Confirm New Password</span>
                  </label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="h-12 pr-12 border-slate-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  <h4 className="text-sm font-medium text-slate-900">Password Requirements:</h4>
                  <div className="space-y-1 text-sm text-slate-600">
                    <div className={`flex items-center space-x-2 ${password.length >= 6 ? 'text-green-600' : 'text-slate-500'}`}>
                      <div className={`w-2 h-2 rounded-full ${password.length >= 6 ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                      <span>At least 6 characters</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${password === confirmPassword && password.length > 0 ? 'text-green-600' : 'text-slate-500'}`}>
                      <div className={`w-2 h-2 rounded-full ${password === confirmPassword && password.length > 0 ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                      <span>Passwords match</span>
                    </div>
                  </div>
                </div>

                {message && (
                  <div className={`px-4 py-3 rounded-lg text-sm flex items-center gap-2 ${
                    message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' :
                    message.type === 'error' ? 'bg-red-50 border border-red-200 text-red-700' :
                    'bg-blue-50 border border-blue-200 text-blue-700'
                  }`}>
                    {message.type === 'success' && <CheckCircle className="h-5 w-5" />}
                    {message.type === 'error' && <XCircle className="h-5 w-5" />}
                    {message.type === 'info' && <Loader2 className="h-5 w-5 animate-spin" />}
                    <span>{message.text}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Setting Password...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-5 w-5" />
                      Set Password
                    </>
                  )}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-sm text-slate-500">
                  Your password is encrypted and secure
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-slate-600" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    }>
      <SetPasswordContent />
    </Suspense>
  )
}