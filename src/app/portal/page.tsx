'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Logo } from '@/components/Logo'
import { useAuthStore } from '@/store/auth-store'
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
  Bell,
  Search,
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
  BarChart3
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
    label: 'Documents', 
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
    badge: 'New',
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
    badge: 'Hot',
    badgeColor: 'bg-red-100 text-red-800'
  },
  {
    id: 'view-manuals',
    title: 'Documentation',
    subtitle: 'Download manuals and guides',
    icon: BookOpen,
    gradient: 'from-orange-500 via-orange-600 to-amber-600',
    href: '/manuals',
    badge: null,
    badgeColor: ''
  },
]

const recentActivities = [
  {
    id: 1,
    type: 'rfq',
    title: 'New RFQ submitted',
    description: 'Request for OMNI-7000 system quote',
    time: '2 hours ago',
    icon: FileText,
    color: 'text-green-600'
  },
  {
    id: 2,
    type: 'support',
    title: 'Support ticket updated',
    description: 'Issue #1234 - Installation guidance',
    time: '4 hours ago',
    icon: Headphones,
    color: 'text-blue-600'
  },
  {
    id: 3,
    type: 'training',
    title: 'Training completed',
    description: 'OMNI-3000 Operations Course',
    time: '1 day ago',
    icon: GraduationCap,
    color: 'text-purple-600'
  },
]

export default function PortalPage() {
  const router = useRouter()
  const { user, signOut } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
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
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <Logo width={140} height={49} />
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors relative">
                <Bell className="h-5 w-5 text-slate-600" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="hidden sm:flex items-center space-x-2 bg-slate-50 rounded-lg px-3 py-2">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-0 outline-none text-sm text-slate-600 placeholder-slate-400"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-slate-600 text-white text-xs flex items-center justify-center font-semibold">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="flex items-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </div>
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
            <div className="mt-4 sm:mt-0">
              <Button className="bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white shadow-lg hover:shadow-xl transition-all">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
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
                    <div className={`text-sm font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.trend}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Quick Actions</h2>
              <p className="text-slate-600">Access your most used features</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <p className="text-sm opacity-90 mb-3">{item.subtitle}</p>
                            <div className="flex items-center text-sm opacity-80 group-hover:opacity-100 transition-opacity">
                              Get started
                              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Recent Activity</h2>
              <p className="text-slate-600">Your latest updates</p>
            </div>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="h-[400px] overflow-y-auto">
                  <div className="space-y-4">
                    {recentActivities.map((activity) => {
                      const Icon = activity.icon
                      return (
                        <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                          <div className={`p-2 rounded-lg bg-slate-100 ${activity.color}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                            <p className="text-sm text-slate-600 truncate">{activity.description}</p>
                            <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <Button variant="outline" className="w-full text-sm">
                    View All Activity
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Additional Resources</h2>
            <p className="text-slate-600">Helpful links and information</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-sm hover:shadow-lg transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Download className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Download Center</h3>
                <p className="text-sm text-slate-600 mb-4">Get the latest software and drivers</p>
                <Button variant="outline" size="sm">Browse Files</Button>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm hover:shadow-lg transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Community Forum</h3>
                <p className="text-sm text-slate-600 mb-4">Connect with other users</p>
                <Button variant="outline" size="sm">Join Discussion</Button>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm hover:shadow-lg transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Security Center</h3>
                <p className="text-sm text-slate-600 mb-4">Manage your account security</p>
                <Button variant="outline" size="sm">Security Settings</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
