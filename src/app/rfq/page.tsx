'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Logo } from '@/components/Logo'
import { 
  ArrowLeft, 
  FileText, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Send,
  Calendar,
  DollarSign,
  Package,
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Edit,
  Trash2,
  Eye,
  Download,
  Filter,
  Search,
  TrendingUp,
  Target
} from 'lucide-react'

interface RFQ {
  id: string
  title: string
  description: string
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected'
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'
  createdAt: string
  dueDate: string
  estimatedValue: string
  category: string
  requester: string
  items: RFQItem[]
}

interface RFQItem {
  id: string
  product: string
  quantity: number
  specifications: string
  unitPrice?: number
  totalPrice?: number
}

export default function RFQPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'new' | 'drafts' | 'submitted'>('new')
  const [showNewRFQ, setShowNewRFQ] = useState(false)

  const rfqs: RFQ[] = [
    {
      id: '1',
      title: 'OMNI-7000 System Upgrade',
      description: 'Request for upgrading existing OMNI-6000 system to OMNI-7000',
      status: 'Under Review',
      priority: 'High',
      createdAt: '2024-01-15',
      dueDate: '2024-02-15',
      estimatedValue: '$125,000',
      category: 'System Upgrade',
      requester: 'John Smith',
      items: [
        {
          id: '1',
          product: 'OMNI-7000 Control Unit',
          quantity: 1,
          specifications: 'Latest model with advanced features',
          unitPrice: 85000,
          totalPrice: 85000
        },
        {
          id: '2',
          product: 'Installation Service',
          quantity: 1,
          specifications: 'Professional installation and setup',
          unitPrice: 15000,
          totalPrice: 15000
        }
      ]
    },
    {
      id: '2',
      title: 'Maintenance Parts Order',
      description: 'Quarterly maintenance parts for OMNI-3000 systems',
      status: 'Draft',
      priority: 'Medium',
      createdAt: '2024-01-20',
      dueDate: '2024-02-20',
      estimatedValue: '$15,000',
      category: 'Maintenance',
      requester: 'Sarah Johnson',
      items: [
        {
          id: '1',
          product: 'Filter Set',
          quantity: 10,
          specifications: 'High-efficiency filters',
          unitPrice: 150,
          totalPrice: 1500
        }
      ]
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800'
      case 'Submitted': return 'bg-blue-100 text-blue-800'
      case 'Under Review': return 'bg-yellow-100 text-yellow-800'
      case 'Approved': return 'bg-green-100 text-green-800'
      case 'Rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'High': return 'bg-orange-100 text-orange-800'
      case 'Urgent': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
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
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Portal
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-slate-900">Request for Quote (RFQ)</h1>
                  <p className="text-sm text-slate-600">Submit and manage your quote requests</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <TrendingUp className="h-3 w-3 mr-1" />
                Active
              </Badge>
              <Button
                onClick={() => setShowNewRFQ(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                New RFQ
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
                Quote Management 💼
              </h1>
              <p className="text-slate-600 text-lg">
                Submit requests for quotes and track their progress
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">12</p>
                  <p className="text-sm text-slate-600">Total RFQs</p>
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
                  <p className="text-sm text-slate-600">Pending Review</p>
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
                  <p className="text-2xl font-bold text-slate-900">8</p>
                  <p className="text-sm text-slate-600">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">$2.1M</p>
                  <p className="text-sm text-slate-600">Total Value</p>
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
              New RFQ
            </Button>
            <Button
              variant={activeTab === 'drafts' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('drafts')}
              className={`px-6 ${activeTab === 'drafts' ? 'bg-white shadow-sm' : 'hover:bg-slate-200'}`}
            >
              <Edit className="h-4 w-4 mr-2" />
              Drafts
            </Button>
            <Button
              variant={activeTab === 'submitted' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('submitted')}
              className={`px-6 ${activeTab === 'submitted' ? 'bg-white shadow-sm' : 'hover:bg-slate-200'}`}
            >
              <Send className="h-4 w-4 mr-2" />
              Submitted
            </Button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'new' ? (
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-green-600" />
                <span>Create New RFQ</span>
              </CardTitle>
              <CardDescription>
                Fill out the form below to submit a new request for quote
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">RFQ Title</label>
                  <Input placeholder="Enter RFQ title" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Category</label>
                  <Input placeholder="e.g., System Upgrade, Maintenance" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Description</label>
                <textarea 
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  rows={4}
                  placeholder="Describe your requirements in detail"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Priority</label>
                  <select className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Due Date</label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Estimated Value</label>
                  <Input placeholder="$0.00" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Items</h3>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <Card className="border border-slate-200">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">Product</label>
                          <Input placeholder="Product name" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">Quantity</label>
                          <Input type="number" placeholder="1" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">Unit Price</label>
                          <Input placeholder="$0.00" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">Total</label>
                          <Input placeholder="$0.00" disabled />
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <label className="text-sm font-medium text-slate-700">Specifications</label>
                        <textarea 
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          rows={2}
                          placeholder="Detailed specifications"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 pt-6">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Send className="h-4 w-4 mr-2" />
                  Submit RFQ
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
                    placeholder="Search RFQs..." 
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            {/* RFQ List */}
            <div className="space-y-4">
              {rfqs.map((rfq) => (
                <Card key={rfq.id} className="border-0 shadow-sm hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-lg font-semibold text-slate-900">{rfq.title}</h3>
                          <Badge className={getStatusColor(rfq.status)}>
                            {rfq.status}
                          </Badge>
                          <Badge variant="secondary" className={getPriorityColor(rfq.priority)}>
                            {rfq.priority}
                          </Badge>
                        </div>
                        
                        <p className="text-slate-600 mb-4">{rfq.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-600">Created: {rfq.createdAt}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-600">Due: {rfq.dueDate}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-600">Value: {rfq.estimatedValue}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-600">{rfq.requester}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 lg:mt-0 lg:ml-6 flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
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