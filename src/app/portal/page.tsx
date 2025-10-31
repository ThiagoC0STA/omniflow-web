'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Logo } from '@/components/Logo'
import { useAuthStore } from '@/store/auth-store'
import { supabase } from '@/lib/supabase'
import { 
  Bot, 
  GraduationCap, 
  FileText, 
  Headphones, 
  BookOpen, 
  LogOut,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Menu,
  X,
  ArrowRight,
  Users,
  Shield,
  Zap,
  Download,
  Calendar,
  MessageSquare,
  Activity,
  BarChart3,
  Newspaper,
  Settings,
  Crown
} from 'lucide-react'

const dashboardStats = [
  { 
    label: 'Pending RFQs', 
    value: '3', 
    color: 'text-amber-600', 
    bgColor: 'bg-amber-50', 
    borderColor: 'border-amber-200',
    icon: Clock,
    trend: '+12%',
    trendUp: true
  },
  { 
    label: 'Support Tickets', 
    value: '7', 
    color: 'text-red-600', 
    bgColor: 'bg-red-50', 
    borderColor: 'border-red-200',
    icon: AlertCircle,
    trend: '-5%',
    trendUp: false
  },
  { 
    label: 'Training Hours', 
    value: '24', 
    color: 'text-purple-600', 
    bgColor: 'bg-purple-50', 
    borderColor: 'border-purple-200',
    icon: GraduationCap,
    trend: '+8%',
    trendUp: true
  },
  { 
    label: 'Manuals', 
    value: '15', 
    color: 'text-green-600', 
    bgColor: 'bg-green-50', 
    borderColor: 'border-green-200',
    icon: FileText,
    trend: '+3%',
    trendUp: true
  },
]

const menuItems = [
  {
    id: 'ai-assistant',
    title: 'AI Assistant',
    subtitle: 'Get instant help with technical questions',
    icon: Bot,
    gradient: 'from-blue-500 via-blue-600 to-indigo-600',
    href: '/ai-assistant',
    badge: null,
    badgeColor: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'training',
    title: 'Training Programs',
    subtitle: 'Access courses and certifications',
    icon: GraduationCap,
    gradient: 'from-purple-500 via-purple-600 to-violet-600',
    href: '/training',
    badge: null,
    badgeColor: ''
  },
  {
    id: 'submit-rfq',
    title: 'Submit RFQ',
    subtitle: 'Request quotes and proposals',
    icon: FileText,
    gradient: 'from-green-500 via-green-600 to-emerald-600',
    href: '/rfq',
    badge: null,
    badgeColor: ''
  },
  {
    id: 'support',
    title: 'Support Center',
    subtitle: 'Get technical assistance',
    icon: Headphones,
    gradient: 'from-red-500 via-red-600 to-rose-600',
    href: '/support',
    badge: null,
    badgeColor: 'bg-red-100 text-red-800'
  },
  {
    id: 'view-manuals',
    title: 'Manuals',
    subtitle: 'Download manuals and guides',
    icon: BookOpen,
    gradient: 'from-orange-500 via-orange-600 to-amber-600',
    href: '/manuals',
    badge: null,
    badgeColor: ''
  },
  {
    id: 'news',
    title: 'News',
    subtitle: 'Latest company updates and announcements',
    icon: Newspaper,
    gradient: 'from-indigo-500 via-indigo-600 to-purple-600',
    href: '/news',
    badge: null,
    badgeColor: ''
  },
]


export default function PortalPage() {
  const router = useRouter()
  const { user, signOut } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      // Sign out from Supabase first
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      // Then clear local state
      signOut()
      
      // Redirect to login with full page reload to ensure session is cleared
      window.location.href = '/login'
    } catch (error) {
      console.error('Error signing out:', error)
      // Even if Supabase fails, clear local state and redirect
      signOut()
      window.location.href = '/login'
    }
  }

  const handleMenuClick = (href: string) => {
    router.push(href)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
            
              <Logo width={140} height={49} />
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Temporarily show admin button for all users for testing */}
              <Button
                variant="outline"
                onClick={() => router.push('/admin')}
                className="flex items-center gap-2 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-all"
              >
                <Crown className="h-4 w-4" />
                Admin Panel
              </Button>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="flex items-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-all"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Welcome back! 👋
              </h1>
              <p className="text-slate-600 text-lg">
                Here's what's happening with your account today.
              </p>
            </div>
        
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.borderColor} border`}>
                        <Icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                        <p className="text-sm text-slate-600">{stat.label}</p>
                      </div>
                    </div>
                    {/* <div className={`text-sm font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.trend}
                    </div> */}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Quick Actions</h2>
              <p className="text-slate-600">Access your most used features</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Card 
                    key={item.id} 
                    className="cursor-pointer hover:shadow-xl transition-all duration-300 group border-0 shadow-sm hover:scale-[1.02]"
                    onClick={() => handleMenuClick(item.href)}
                  >
                    <CardContent className="p-0">
                      <div className={`relative w-full h-40 bg-gradient-to-br ${item.gradient} rounded-lg p-6 text-white overflow-hidden`}>
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
                        
                        <div className="relative z-10 flex flex-col justify-between h-full">
                          <div className="flex items-center justify-between">
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                              <Icon className="h-6 w-6" />
                            </div>
                            {item.badge && (
                              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                            <p className="text-sm opacity-90">{item.subtitle}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
      </div>
    </div>
  )
}
