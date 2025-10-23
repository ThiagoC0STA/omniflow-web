'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo } from '@/components/Logo'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth-store'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()
  const { setUser, setMustChangePassword } = useAuthStore()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      console.log('Login successful:', data)

      // Simple redirect without complex profile fetching
      if (data.user) {
        console.log('User found, checking password pattern...')
        console.log('Password:', password)
        console.log('Password pattern test:', /Aa![0-9]{3,}$/.test(password))
        
        // Check if password needs to be changed
        if (/Aa![0-9]{3,}$/.test(password)) {
          console.log('Redirecting to set-password...')
          router.push('/set-password')
        } else {
          console.log('Redirecting to portal...')
          // Force redirect with window.location as fallback
          setTimeout(() => {
            router.push('/portal')
            // Fallback redirect
            setTimeout(() => {
              window.location.href = '/portal'
            }, 1000)
          }, 100)
        }
      } else {
        console.log('No user found in response')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      setError(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const createTestUser = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'password123',
      })
      
      if (error) {
        console.error('Signup error:', error)
        setError(error.message)
      } else {
        console.log('User created:', data)
        setError('User created successfully! Check your email to confirm.')
      }
    } catch (error: any) {
      console.error('Error:', error)
      setError(error.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Logo width={200} height={80} className="mx-auto" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome to OmniFlow
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your client portal
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>

              <div className="text-center space-y-2">
                <button
                  type="button"
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Forgot your password?
                </button>
                
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={createTestUser}
                    className="text-xs text-gray-500 hover:text-gray-700 underline"
                  >
                    Create test user (test@example.com / password123)
                  </button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Contact your administrator to get access
          </p>
        </div>
      </div>
    </div>
  )
}
