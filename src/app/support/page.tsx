'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Logo } from '@/components/Logo'
import { 
  ArrowLeft, 
  Headphones, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Send,
  Calendar,
  MessageSquare,
  Phone,
  Mail,
  Video,
  FileText,
  User,
  Search,
  Filter,
  Star,
  ThumbsUp,
  ThumbsDown,
  Download,
  Edit,
  Trash2,
  Eye,
  Zap,
  Shield,
  LifeBuoy,
  TrendingUp,
  Target,
  Bell,
  DollarSign
} from 'lucide-react'

interface SupportTicket {
  id: string
  title: string
  description: string
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed'
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  category: 'Technical' | 'Billing' | 'General' | 'Feature Request'
  createdAt: string
  updatedAt: string
  assignedTo?: string
  requester: string
  attachments?: string[]
  messages: TicketMessage[]
}

interface TicketMessage {
  id: string
  content: string
  sender: string
  isFromSupport: boolean
  timestamp: string
  attachments?: string[]
}

export default function SupportPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'new' | 'open' | 'resolved'>('new')
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)

  const tickets: SupportTicket[] = [
    {
      id: '1',
      title: 'OMNI-7000 System Error',
      description: 'System showing error code E-1234 during startup',
      status: 'In Progress',
      priority: 'High',
      category: 'Technical',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-16',
      assignedTo: 'John Smith',
      requester: 'Mike Davis',
      attachments: ['error-log.txt', 'screenshot.png'],
      messages: [
        {
          id: '1',
          content: 'System showing error code E-1234 during startup. Please help!',
          sender: 'Mike Davis',
          isFromSupport: false,
          timestamp: '2024-01-15 10:30'
        },
        {
          id: '2',
          content: 'Thank you for contacting support. I\'ve received your ticket and will investigate this issue. Can you please provide the system logs?',
          sender: 'John Smith',
          isFromSupport: true,
          timestamp: '2024-01-15 11:15'
        }
      ]
    },
    {
      id: '2',
      title: 'Billing Question',
      description: 'Question about monthly subscription charges',
      status: 'Resolved',
      priority: 'Low',
      category: 'Billing',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-12',
      assignedTo: 'Sarah Johnson',
      requester: 'Lisa Wilson',
      messages: [
        {
          id: '1',
          content: 'I have a question about my monthly subscription charges.',
          sender: 'Lisa Wilson',
          isFromSupport: false,
          timestamp: '2024-01-10 14:20'
        },
        {
          id: '2',
          content: 'I\'ve reviewed your account and explained the charges. Is there anything else I can help you with?',
          sender: 'Sarah Johnson',
          isFromSupport: true,
          timestamp: '2024-01-12 09:45'
        }
      ]
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800'
      case 'In Progress': return 'bg-yellow-100 text-yellow-800'
      case 'Resolved': return 'bg-green-100 text-green-800'
      case 'Closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'High': return 'bg-orange-100 text-orange-800'
      case 'Critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Technical': return <Zap className="h-4 w-4" />
      case 'Billing': return <DollarSign className="h-4 w-4" />
      case 'General': return <MessageSquare className="h-4 w-4" />
      case 'Feature Request': return <Target className="h-4 w-4" />
      default: return <MessageSquare className="h-4 w-4" />
    }
  }

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
                className="flex items-center gap-2 p-3"
              >
                <ArrowLeft className="h-4 w-4" />

              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Headphones className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-slate-900">Support Center</h1>
                  <p className="text-sm text-slate-600">Get help when you need it</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                <LifeBuoy className="h-3 w-3 mr-1" />
                24/7 Support
              </Badge>
              <Button
                onClick={() => setActiveTab('new')}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Ticket
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
                Support Center 🎧
              </h1>
              <p className="text-slate-600 text-lg">
                Get help from our expert support team
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all">
                <Phone className="h-4 w-4 mr-2" />
                Call Support
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Phone Support</h3>
              <p className="text-sm text-slate-600 mb-4">Call us directly</p>
              <Button variant="outline" size="sm">Call Now</Button>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Video className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Video Call</h3>
              <p className="text-sm text-slate-600 mb-4">Screen sharing support</p>
              <Button variant="outline" size="sm">Start Call</Button>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Live Chat</h3>
              <p className="text-sm text-slate-600 mb-4">Instant messaging</p>
              <Button variant="outline" size="sm">Start Chat</Button>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Knowledge Base</h3>
              <p className="text-sm text-slate-600 mb-4">Self-help resources</p>
              <Button variant="outline" size="sm">Browse</Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">24</p>
                  <p className="text-sm text-slate-600">Total Tickets</p>
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
                  <p className="text-2xl font-bold text-slate-900">3</p>
                  <p className="text-sm text-slate-600">Open</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">18</p>
                  <p className="text-sm text-slate-600">Resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">4.8</p>
                  <p className="text-sm text-slate-600">Avg Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-fit">
            <Button
              variant={activeTab === 'new' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('new')}
              className={`px-6 ${activeTab === 'new' ? 'bg-white shadow-sm' : 'hover:bg-slate-200'}`}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
            <Button
              variant={activeTab === 'open' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('open')}
              className={`px-6 ${activeTab === 'open' ? 'bg-white shadow-sm' : 'hover:bg-slate-200'}`}
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Open Tickets
            </Button>
            <Button
              variant={activeTab === 'resolved' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('resolved')}
              className={`px-6 ${activeTab === 'resolved' ? 'bg-white shadow-sm' : 'hover:bg-slate-200'}`}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Resolved
            </Button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'new' ? (
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Headphones className="h-5 w-5 text-red-600" />
                <span>Create Support Ticket</span>
              </CardTitle>
              <CardDescription>
                Describe your issue and we'll get back to you as soon as possible
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Subject</label>
                  <Input placeholder="Brief description of your issue" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Category</label>
                  <select className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                    <option>Technical</option>
                    <option>Billing</option>
                    <option>General</option>
                    <option>Feature Request</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Priority</label>
                <select className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Description</label>
                <textarea 
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows={6}
                  placeholder="Please provide detailed information about your issue..."
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Attachments</label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center">
                  <FileText className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">Drag and drop files here or click to upload</p>
                  <Button variant="outline" className="mt-2">
                    Choose Files
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 pt-6">
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Ticket
                </Button>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Save as Draft
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="Search tickets..." 
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            {/* Ticket List */}
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <Card key={ticket.id} className="border-0 shadow-sm hover:shadow-lg transition-all cursor-pointer" onClick={() => setSelectedTicket(ticket)}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="flex items-center space-x-2">
                            {getCategoryIcon(ticket.category)}
                            <h3 className="text-lg font-semibold text-slate-900">{ticket.title}</h3>
                          </div>
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status}
                          </Badge>
                          <Badge variant="secondary" className={getPriorityColor(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                        </div>
                        
                        <p className="text-slate-600 mb-4">{ticket.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-600">Created: {ticket.createdAt}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-600">Updated: {ticket.updatedAt}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-600">{ticket.requester}</span>
                          </div>
                          {ticket.assignedTo && (
                            <div className="flex items-center space-x-2">
                              <Shield className="h-4 w-4 text-slate-400" />
                              <span className="text-slate-600">{ticket.assignedTo}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-6 lg:mt-0 lg:ml-6 flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Reply
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}