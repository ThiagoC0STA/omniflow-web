'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Logo } from '@/components/Logo'
import { 
  ArrowLeft, 
  Users, 
  Plus, 
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Mail,
  Shield,
  Crown,
  UserCheck,
  UserX,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Settings,
  Bell,
  Download,
  Upload,
  Eye,
  Key,
  Calendar,
  Activity,
  Zap,
  Target,
  Star,
  MessageSquare,
  FileText,
  Headphones,
  BookOpen
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'client'
  status: 'active' | 'inactive' | 'pending'
  lastLogin: string
  createdAt: string
  avatar?: string
  department?: string
  permissions: string[]
}

interface AdminStats {
  totalUsers: number
  activeUsers: number
  pendingInvites: number
  totalTickets: number
  resolvedTickets: number
  avgResponseTime: string
  systemUptime: string
  storageUsed: string
}

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'users' | 'analytics' | 'settings'>('users')
  const [searchQuery, setSearchQuery] = useState('')

  const stats: AdminStats = {
    totalUsers: 156,
    activeUsers: 142,
    pendingInvites: 8,
    totalTickets: 24,
    resolvedTickets: 18,
    avgResponseTime: '2.4h',
    systemUptime: '99.9%',
    storageUsed: '2.4GB'
  }

  const users: User[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@company.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-01-16 09:30',
      createdAt: '2023-06-15',
      department: 'Engineering',
      permissions: ['user_management', 'system_config', 'analytics']
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      role: 'client',
      status: 'active',
      lastLogin: '2024-01-16 08:45',
      createdAt: '2023-08-20',
      department: 'Operations',
      permissions: ['view_data', 'submit_tickets']
    },
    {
      id: '3',
      name: 'Mike Davis',
      email: 'mike.davis@company.com',
      role: 'client',
      status: 'pending',
      lastLogin: 'Never',
      createdAt: '2024-01-15',
      department: 'Maintenance',
      permissions: ['view_data']
    },
    {
      id: '4',
      name: 'Lisa Wilson',
      email: 'lisa.wilson@company.com',
      role: 'client',
      status: 'inactive',
      lastLogin: '2024-01-10 14:20',
      createdAt: '2023-09-12',
      department: 'Quality Control',
      permissions: ['view_data', 'submit_tickets']
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-4 w-4 text-purple-600" />
      case 'client': return <UserCheck className="h-4 w-4 text-blue-600" />
      default: return <Users className="h-4 w-4 text-slate-600" />
    }
  }

  const filteredUsers = users.filter(user => 
    searchQuery === '' || 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => router.push('/portal')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Portal
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-slate-900">Admin Panel</h1>
                  <p className="text-sm text-slate-600">System administration and management</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                <Crown className="h-3 w-3 mr-1" />
                Admin Access
              </Badge>
              <Button
                onClick={() => {/* Handle invite user */}}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Invite User
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
                Admin Dashboard 👑
              </h1>
              <p className="text-slate-600 text-lg">
                Manage users, monitor system performance, and configure settings
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all">
                <Settings className="h-4 w-4 mr-2" />
                System Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalUsers}</p>
                  <p className="text-sm text-slate-600">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stats.activeUsers}</p>
                  <p className="text-sm text-slate-600">Active Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stats.pendingInvites}</p>
                  <p className="text-sm text-slate-600">Pending Invites</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stats.systemUptime}</p>
                  <p className="text-sm text-slate-600">System Uptime</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-fit">
            <Button
              variant={activeTab === 'users' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('users')}
              className={`px-6 ${activeTab === 'users' ? 'bg-white shadow-sm' : 'hover:bg-slate-200'}`}
            >
              <Users className="h-4 w-4 mr-2" />
              Users
            </Button>
            <Button
              variant={activeTab === 'analytics' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('analytics')}
              className={`px-6 ${activeTab === 'analytics' ? 'bg-white shadow-sm' : 'hover:bg-slate-200'}`}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            <Button
              variant={activeTab === 'settings' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('settings')}
              className={`px-6 ${activeTab === 'settings' ? 'bg-white shadow-sm' : 'hover:bg-slate-200'}`}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'users' ? (
          <div className="space-y-6">
            {/* Search and Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="Search users..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
              </div>
            </div>

            {/* Users List */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  <div className="space-y-0">
                    {filteredUsers.map((user, index) => (
                      <div key={user.id} className={`p-6 ${index !== filteredUsers.length - 1 ? 'border-b border-slate-100' : ''}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback className="bg-purple-100 text-purple-600">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="text-lg font-semibold text-slate-900">{user.name}</h3>
                                {getRoleIcon(user.role)}
                                <Badge className={getStatusColor(user.status)}>
                                  {user.status}
                                </Badge>
                              </div>
                              <p className="text-slate-600 mb-2">{user.email}</p>
                              <div className="flex items-center space-x-4 text-sm text-slate-500">
                                <span>{user.department}</span>
                                <span>•</span>
                                <span>Last login: {user.lastLogin}</span>
                                <span>•</span>
                                <span>Joined: {user.createdAt}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              <Key className="h-4 w-4 mr-2" />
                              Reset Password
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        ) : activeTab === 'analytics' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span>User Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-16 w-16 text-slate-400" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <span>System Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
                    <Zap className="h-16 w-16 text-slate-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-purple-600" />
                    <span>Security Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Two-Factor Authentication</span>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Password Policy</span>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Session Timeout</span>
                    <Button variant="outline" size="sm">Set</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-orange-600" />
                    <span>Notifications</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Email Notifications</span>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>System Alerts</span>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>User Invitations</span>
                    <Button variant="outline" size="sm">Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}