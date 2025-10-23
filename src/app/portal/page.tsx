'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  AlertCircle
} from 'lucide-react'

const dashboardStats = [
  { label: 'Pending RFQs', value: '3', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: Clock },
  { label: 'Support Tickets', value: '7', color: 'text-red-600', bgColor: 'bg-red-100', icon: AlertCircle },
  { label: 'Training Hours', value: '24', color: 'text-purple-600', bgColor: 'bg-purple-100', icon: GraduationCap },
  { label: 'Documents', value: '15', color: 'text-green-600', bgColor: 'bg-green-100', icon: FileText },
]

const menuItems = [
  {
    id: 'ai-assistant',
    title: 'AI Assistant',
    subtitle: 'Get instant help with technical questions',
    icon: Bot,
    gradient: 'from-blue-500 to-blue-600',
    href: '/ai-assistant',
  },
  {
    id: 'training',
    title: 'Training Programs',
    subtitle: 'Access courses and certifications',
    icon: GraduationCap,
    gradient: 'from-purple-500 to-purple-600',
    href: '/training',
  },
  {
    id: 'submit-rfq',
    title: 'Submit RFQ',
    subtitle: 'Request quotes and proposals',
    icon: FileText,
    gradient: 'from-green-500 to-green-600',
    href: '/rfq',
  },
  {
    id: 'support',
    title: 'Support Center',
    subtitle: 'Get technical assistance',
    icon: Headphones,
    gradient: 'from-red-500 to-red-600',
    href: '/support',
  },
  {
    id: 'view-manuals',
    title: 'Documentation',
    subtitle: 'Download manuals and guides',
    icon: BookOpen,
    gradient: 'from-orange-500 to-orange-600',
    href: '/manuals',
  },
]

export default function PortalPage() {
  const router = useRouter()
  const { user, signOut } = useAuthStore()

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Logo width={120} height={42} />
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back!
          </h1>
          <p className="text-gray-600">
            Get support, and access resources
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg ${stat.bgColor} mr-4`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Card 
                  key={item.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                  onClick={() => handleMenuClick(item.href)}
                >
                  <CardContent className="p-6">
                    <div className={`w-full h-32 bg-gradient-to-br ${item.gradient} rounded-lg p-6 text-white flex flex-col justify-between`}>
                      <div className="flex items-center justify-between">
                        <Icon className="h-8 w-8" />
                        <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                        <p className="text-sm opacity-90">{item.subtitle}</p>
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
