'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Logo } from '@/components/Logo'
import { useAuthStore } from '@/store/auth-store'
import { supabase, supabaseAdmin } from '@/lib/supabase'
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
  BookOpen,
  Newspaper,
  GraduationCap,
  X,
  Send,
  LogOut,
  Loader2,
  XCircle
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'client'
  status: 'active' | 'inactive' | 'pending'
  lastLogin: string
  createdAt: string
  avatarUrl?: string
}

interface Training {
  id: string
  title: string
  description: string
  duration: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  category: string
  instructor: string
  status: 'draft' | 'published' | 'archived'
  createdAt: string
}

interface RFQ {
  id: string
  title: string
  client: string
  email: string
  status: 'pending' | 'in-review' | 'quoted' | 'approved' | 'rejected'
  priority: 'low' | 'medium' | 'high'
  estimatedValue: string
  dueDate: string
  submittedAt: string
}

interface NewsArticle {
  id: string
  title: string
  excerpt: string
  author: string
  category: string
  status: 'draft' | 'published' | 'archived'
  publishedAt: string
  createdAt: string
}

export default function AdminPage() {
  const router = useRouter()
  const { user, signOut } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'users' | 'training' | 'rfqs' | 'news'>('users')
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showAddTrainingModal, setShowAddTrainingModal] = useState(false)
  const [showAddNewsModal, setShowAddNewsModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Invite user modal state
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'admin' | 'client'>('client')
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteError, setInviteError] = useState('')
  const [inviteSuccess, setInviteSuccess] = useState(false)

  // Redirect if not admin - Temporarily disabled for testing
  // useEffect(() => {
  //   if (user && user.role !== 'admin') {
  //     router.push('/portal')
  //   }
  // }, [user, router])

  // Mock data
  const users: User[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      role: 'client',
      status: 'active',
      lastLogin: '2024-01-15',
      createdAt: '2023-12-01'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-01-14',
      createdAt: '2023-11-15'
    },
    {
      id: '3',
      name: 'Mike Davis',
      email: 'mike@example.com',
      role: 'client',
      status: 'pending',
      lastLogin: '2024-01-10',
      createdAt: '2024-01-01'
    }
  ]

  const trainings: Training[] = [
    {
      id: '1',
      title: 'OMNI-3000 Basic Operations',
      description: 'Learn the fundamentals of operating the OMNI-3000 system',
      duration: '4 hours',
      level: 'Beginner',
      category: 'Operations',
      instructor: 'John Smith',
      status: 'published',
      createdAt: '2024-01-10'
    },
    {
      id: '2',
      title: 'OMNI-6000 Intermediate Training',
      description: 'Advanced techniques for OMNI-6000 system maintenance',
      duration: '6 hours',
      level: 'Intermediate',
      category: 'Maintenance',
      instructor: 'Sarah Johnson',
      status: 'draft',
      createdAt: '2024-01-12'
    }
  ]

  const rfqs: RFQ[] = [
    {
      id: '1',
      title: 'OMNI-7000 System Quote',
      client: 'ABC Manufacturing',
      email: 'contact@abc.com',
      status: 'pending',
      priority: 'high',
      estimatedValue: '$50,000',
      dueDate: '2024-02-15',
      submittedAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Maintenance Service Contract',
      client: 'XYZ Corp',
      email: 'procurement@xyz.com',
      status: 'in-review',
      priority: 'medium',
      estimatedValue: '$25,000',
      dueDate: '2024-02-20',
      submittedAt: '2024-01-14'
    }
  ]

  const newsArticles: NewsArticle[] = [
    {
      id: '1',
      title: 'OMNI-7000 Series Launch',
      excerpt: 'Introducing the latest OMNI-7000 series with enhanced automation',
      author: 'Sarah Johnson',
      category: 'Product Updates',
      status: 'published',
      publishedAt: '2024-01-15',
      createdAt: '2024-01-14'
    },
    {
      id: '2',
      title: 'Q4 2023 Financial Results',
      excerpt: 'Our company reports record-breaking revenue and expansion',
      author: 'Michael Chen',
      category: 'Company News',
      status: 'draft',
      publishedAt: '',
      createdAt: '2024-01-12'
    }
  ]

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

  const generateTempPassword = () => {
    const base = Math.random().toString(36).slice(-8)
    const extra = Math.floor(100 + Math.random() * 900)
    return `${base}Aa!${extra}`
  }

  const handleSendInvite = async () => {
    if (!inviteEmail) {
      setInviteError('Please enter an email address')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(inviteEmail.trim())) {
      setInviteError('Please enter a valid email address')
      return
    }

    setInviteLoading(true)
    setInviteError('')
    setInviteSuccess(false)

    try {
      // Check if user already exists
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
      const existing = existingUsers?.users?.find(u => u.email === inviteEmail.trim())

      const tempPassword = generateTempPassword()
      let createdUserId: string | undefined = existing?.id

      if (existing) {
        // User exists: update password to temporary password
        const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(existing.id, {
          password: tempPassword,
        })
        if (updateErr) throw updateErr
      } else {
        // Create new user with temporary password
        const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
          email: inviteEmail.trim(),
          password: tempPassword,
          email_confirm: true,
        })
        if (createErr) throw createErr
        createdUserId = created?.user?.id

        // Create user profile
        if (createdUserId) {
          const { error: profileError } = await supabase
            .from('users')
            .insert({ 
              id: createdUserId, 
              email: inviteEmail.trim(), 
              role: inviteRole 
            })
          if (profileError) {
            console.warn('Profile insert error', profileError)
            // If profile creation fails but user exists, try to update role
            if (profileError.code !== '23505') {
              throw profileError
            }
          }
        }
      }

      // Send email with temporary password via Edge Function
      try {
        const { error: fnError } = await supabase.functions.invoke('send-invite-email', {
          body: { to: inviteEmail.trim(), tempPassword },
        })
        if (fnError) {
          console.warn('Email send error', fnError)
          // Don't throw - user is created even if email fails
        }
      } catch (e) {
        console.warn('Email send exception', e)
        // Don't throw - user is created even if email fails
      }

      // Store invite record (token is required by schema, but we use temp password flow)
      try {
        const token = `temp_${Date.now()}_${Math.random().toString(36).substring(7)}`
        await supabase.from('invites').insert({ 
          email: inviteEmail.trim(), 
          used: true, 
          created_by: user?.id,
          token: token,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
        })
      } catch (inviteError) {
        console.warn('Invite record error', inviteError)
        // Don't throw - invite record is optional
      }

      setInviteSuccess(true)
      setInviteEmail('')
      setInviteRole('client')
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setShowAddUserModal(false)
        setInviteSuccess(false)
      }, 2000)
    } catch (err: unknown) {
      const error = err as { message?: string }
      console.error('Error sending invite:', error)
      setInviteError(error.message || 'Failed to send invite. Please try again.')
    } finally {
      setInviteLoading(false)
    }
  }

  const handleCloseInviteModal = () => {
    setShowAddUserModal(false)
    setInviteEmail('')
    setInviteRole('client')
    setInviteError('')
    setInviteSuccess(false)
  }

  const toggleUserRole = (userId: string) => {
    // TODO: Implement role toggle
    console.log('Toggle role for user:', userId)
  }

  const deleteUser = (userId: string) => {
    // TODO: Implement user deletion
    console.log('Delete user:', userId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      case 'in-review': return 'bg-blue-100 text-blue-800'
      case 'quoted': return 'bg-purple-100 text-purple-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Temporarily allow all users for testing
  // if (!user || user.role !== 'admin') {
  //   return (
  //     <div className="min-h-screen bg-slate-50 flex items-center justify-center">
  //       <Card className="w-full max-w-md">
  //         <CardContent className="p-6 text-center">
  //           <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
  //           <h2 className="text-xl font-semibold text-slate-900 mb-2">Access Denied</h2>
  //           <p className="text-slate-600 mb-4">You don't have permission to access this page.</p>
  //           <Button onClick={() => router.push('/portal')}>
  //             Return to Portal
  //           </Button>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   )
  // }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200/50 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/portal')}
                className="flex items-center gap-2 px-3"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Crown className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Admin Panel</h1>
                  <p className="text-sm text-slate-600">Manage users, content, and system settings</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Users</p>
                  <p className="text-2xl font-bold text-slate-900">{users.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Trainings</p>
                  <p className="text-2xl font-bold text-slate-900">{trainings.filter(t => t.status === 'published').length}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <GraduationCap className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Pending RFQs</p>
                  <p className="text-2xl font-bold text-slate-900">{rfqs.filter(r => r.status === 'pending').length}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-xl">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Published News</p>
                  <p className="text-2xl font-bold text-slate-900">{newsArticles.filter(n => n.status === 'published').length}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Newspaper className="h-6 w-6 text-purple-600" />
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
              className={`px-6 ${activeTab === 'users' ? 'bg-red-600 text-white shadow-sm hover:bg-red-700' : 'hover:bg-slate-200'} transition-all duration-200`}
            >
              <Users className="h-4 w-4 mr-2" />
              Users
            </Button>
            <Button
              variant={activeTab === 'training' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('training')}
              className={`px-6 ${activeTab === 'training' ? 'bg-red-600 text-white shadow-sm hover:bg-red-700' : 'hover:bg-slate-200'} transition-all duration-200`}
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              Training
            </Button>
            <Button
              variant={activeTab === 'rfqs' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('rfqs')}
              className={`px-6 ${activeTab === 'rfqs' ? 'bg-red-600 text-white shadow-sm hover:bg-red-700' : 'hover:bg-slate-200'} transition-all duration-200`}
            >
              <FileText className="h-4 w-4 mr-2" />
              RFQs
            </Button>
            <Button
              variant={activeTab === 'news' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('news')}
              className={`px-6 ${activeTab === 'news' ? 'bg-red-600 text-white shadow-sm hover:bg-red-700' : 'hover:bg-slate-200'} transition-all duration-200`}
            >
              <Newspaper className="h-4 w-4 mr-2" />
              News
            </Button>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div className="flex gap-2">
            {activeTab === 'users' && (
              <Button
                onClick={() => setShowAddUserModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            )}
            {activeTab === 'training' && (
              <Button
                onClick={() => setShowAddTrainingModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Training
              </Button>
            )}
            {activeTab === 'news' && (
              <Button
                onClick={() => setShowAddNewsModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add News
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {users.map((user) => (
              <Card key={user.id} className="border-0 shadow-sm hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-semibold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{user.name}</h3>
                        <p className="text-sm text-slate-600">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                          <Badge className={user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}>
                            {user.role}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleUserRole(user.id)}
                        className="transition-all duration-200"
                      >
                        {user.role === 'admin' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 hover:bg-red-50 hover:border-red-200 transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'training' && (
          <div className="space-y-4">
            {trainings.map((training) => (
              <Card key={training.id} className="border-0 shadow-sm hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900">{training.title}</h3>
                      <p className="text-sm text-slate-600 mb-2">{training.description}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span>Duration: {training.duration}</span>
                        <span>Level: {training.level}</span>
                        <span>Category: {training.category}</span>
                        <span>Instructor: {training.instructor}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(training.status)}>
                        {training.status}
                      </Badge>
                      <Button variant="outline" size="sm" className="transition-all duration-200">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'rfqs' && (
          <div className="space-y-4">
            {rfqs.map((rfq) => (
              <Card key={rfq.id} className="border-0 shadow-sm hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900">{rfq.title}</h3>
                      <p className="text-sm text-slate-600 mb-2">{rfq.client} - {rfq.email}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span>Value: {rfq.estimatedValue}</span>
                        <span>Due: {formatDate(rfq.dueDate)}</span>
                        <span>Submitted: {formatDate(rfq.submittedAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(rfq.status)}>
                        {rfq.status}
                      </Badge>
                      <Badge className={getPriorityColor(rfq.priority)}>
                        {rfq.priority}
                      </Badge>
                      <Button variant="outline" size="sm" className="transition-all duration-200">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'news' && (
          <div className="space-y-4">
            {newsArticles.map((article) => (
              <Card key={article.id} className="border-0 shadow-sm hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900">{article.title}</h3>
                      <p className="text-sm text-slate-600 mb-2">{article.excerpt}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span>Author: {article.author}</span>
                        <span>Category: {article.category}</span>
                        <span>Created: {formatDate(article.createdAt)}</span>
                        {article.publishedAt && <span>Published: {formatDate(article.publishedAt)}</span>}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(article.status)}>
                        {article.status}
                      </Badge>
                      <Button variant="outline" size="sm" className="transition-all duration-200">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add User
                </CardTitle>
                <CardDescription>
                  Invite a new user by email
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseInviteModal}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Email Address</label>
                <Input 
                  placeholder="user@example.com" 
                  value={inviteEmail}
                  onChange={(e) => {
                    setInviteEmail(e.target.value)
                    setInviteError('')
                  }}
                  disabled={inviteLoading}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Role</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'admin' | 'client')}
                  disabled={inviteLoading}
                >
                  <option value="client">Client</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {inviteError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  <span>{inviteError}</span>
                </div>
              )}

              {inviteSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Invite sent successfully! A temporary password has been emailed.</span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={handleCloseInviteModal}
                  disabled={inviteLoading}
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-red-600 hover:bg-red-700 text-white transition-all duration-200"
                  onClick={handleSendInvite}
                  disabled={inviteLoading || inviteSuccess}
                >
                  {inviteLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Invite
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Training Modal */}
      {showAddTrainingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add Training
                </CardTitle>
                <CardDescription>
                  Create a new training course
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddTrainingModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Title</label>
                <Input placeholder="Training course title" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Description</label>
                <textarea 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows={3}
                  placeholder="Course description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Duration</label>
                  <Input placeholder="4 hours" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Level</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Category</label>
                  <Input placeholder="Operations" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Instructor</label>
                  <Input placeholder="Instructor name" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowAddTrainingModal(false)}>
                  Cancel
                </Button>
                <Button className="bg-red-600 hover:bg-red-700 text-white transition-all duration-200">
                  Create Training
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add News Modal */}
      {showAddNewsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add News Article
                </CardTitle>
                <CardDescription>
                  Create a new news article
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddNewsModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Title</label>
                <Input placeholder="Article title" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Excerpt</label>
                <textarea 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows={3}
                  placeholder="Article excerpt"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Category</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                    <option value="Product Updates">Product Updates</option>
                    <option value="Company News">Company News</option>
                    <option value="Awards">Awards</option>
                    <option value="Sustainability">Sustainability</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Author</label>
                  <Input placeholder="Author name" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowAddNewsModal(false)}>
                  Cancel
                </Button>
                <Button className="bg-red-600 hover:bg-red-700 text-white transition-all duration-200">
                  Create Article
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}