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
  BookOpen, 
  Download, 
  Search, 
  Filter,
  FileText,
  File,
  Folder,
  Calendar,
  User,
  Eye,
  Star,
  Bookmark,
  Share2,
  Printer,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Package,
  Settings,
  Wrench,
  Shield,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'

interface Document {
  id: string
  title: string
  description: string
  type: 'PDF' | 'DOC' | 'XLS' | 'PPT'
  size: string
  category: 'User Manual' | 'Installation Guide' | 'Technical Specs' | 'Safety Guide' | 'Maintenance'
  version: string
  lastUpdated: string
  downloads: number
  rating: number
  isNew?: boolean
  isPopular?: boolean
  tags: string[]
  filePath: string
}

interface Category {
  id: string
  name: string
  icon: any
  count: number
  color: string
}

export default function ManualsPage() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  const categories: Category[] = [
    { id: 'all', name: 'All Documents', icon: FileText, count: 45, color: 'bg-slate-100 text-slate-600' },
    { id: 'user-manual', name: 'User Manuals', icon: BookOpen, count: 12, color: 'bg-blue-100 text-blue-600' },
    { id: 'installation', name: 'Installation Guides', icon: Settings, count: 8, color: 'bg-green-100 text-green-600' },
    { id: 'technical', name: 'Technical Specs', icon: Wrench, count: 15, color: 'bg-purple-100 text-purple-600' },
    { id: 'safety', name: 'Safety Guides', icon: Shield, count: 6, color: 'bg-red-100 text-red-600' },
    { id: 'maintenance', name: 'Maintenance', icon: Zap, count: 4, color: 'bg-orange-100 text-orange-600' }
  ]

  const documents: Document[] = [
    {
      id: '1',
      title: 'OMNI-7000 User Manual',
      description: 'Complete user guide for OMNI-7000 system operation and configuration',
      type: 'PDF',
      size: '2.4 MB',
      category: 'User Manual',
      version: 'v2.1',
      lastUpdated: '2024-01-15',
      downloads: 1245,
      rating: 4.8,
      isNew: true,
      isPopular: true,
      tags: ['OMNI-7000', 'User Guide', 'Operation'],
      filePath: '/manuals/OMNI-4000-7000/OMNI 7000 Operations and Maintenance Guide.pdf'
    },
    {
      id: '2',
      title: 'OMNI-3000 Installation Guide',
      description: 'Step-by-step installation instructions for OMNI-3000 system',
      type: 'PDF',
      size: '1.8 MB',
      category: 'Installation Guide',
      version: 'v1.5',
      lastUpdated: '2024-01-10',
      downloads: 892,
      rating: 4.6,
      isPopular: true,
      tags: ['OMNI-3000', 'Installation', 'Setup'],
      filePath: '/manuals/OMNI-3000-6000/User-Manual-Volume-1-System-Architecture-Installation.pdf'
    },
    {
      id: '3',
      title: 'OMNI-6000 Technical Specifications',
      description: 'Detailed technical specifications and system requirements',
      type: 'PDF',
      size: '3.2 MB',
      category: 'Technical Specs',
      version: 'v3.0',
      lastUpdated: '2024-01-08',
      downloads: 567,
      rating: 4.7,
      tags: ['OMNI-6000', 'Technical', 'Specifications'],
      filePath: '/manuals/OMNI-3000-6000/User-Manual-Volume-1-System-Architecture-Installation.pdf'
    },
    {
      id: '4',
      title: 'Safety Procedures Manual',
      description: 'Comprehensive safety procedures and guidelines for all OMNI systems',
      type: 'PDF',
      size: '1.5 MB',
      category: 'Safety Guide',
      version: 'v2.0',
      lastUpdated: '2024-01-05',
      downloads: 1103,
      rating: 4.9,
      isNew: true,
      tags: ['Safety', 'Procedures', 'Guidelines'],
      filePath: '/manuals/safety-procedures.pdf'
    },
    {
      id: '5',
      title: 'Preventive Maintenance Schedule',
      description: 'Recommended maintenance schedule and procedures',
      type: 'XLS',
      size: '0.8 MB',
      category: 'Maintenance',
      version: 'v1.2',
      lastUpdated: '2024-01-03',
      downloads: 445,
      rating: 4.5,
      tags: ['Maintenance', 'Schedule', 'Preventive'],
      filePath: '/manuals/maintenance-schedule.xlsx'
    }
  ]

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <FileText className="h-5 w-5 text-red-500" />
      case 'DOC': return <FileText className="h-5 w-5 text-blue-500" />
      case 'XLS': return <FileText className="h-5 w-5 text-green-500" />
      case 'PPT': return <FileText className="h-5 w-5 text-orange-500" />
      default: return <File className="h-5 w-5 text-slate-500" />
    }
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = activeCategory === 'all' || doc.category.toLowerCase().replace(' ', '-') === activeCategory
    const matchesSearch = searchQuery === '' || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
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
                <div className="p-2 bg-orange-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-slate-900">Documentation</h1>
                  <p className="text-sm text-slate-600">Access manuals and guides</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                <TrendingUp className="h-3 w-3 mr-1" />
                Updated
              </Badge>
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
                Documentation Center 📚
              </h1>
              <p className="text-slate-600 text-lg">
                Access comprehensive manuals, guides, and technical documentation
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-lg hover:shadow-xl transition-all">
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">45</p>
                  <p className="text-sm text-slate-600">Total Documents</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Download className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">4.2K</p>
                  <p className="text-sm text-slate-600">Downloads</p>
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
                  <p className="text-2xl font-bold text-slate-900">4.7</p>
                  <p className="text-sm text-slate-600">Avg Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">12</p>
                  <p className="text-sm text-slate-600">Updated This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-sm sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <Button
                      key={category.id}
                      variant={activeCategory === category.id ? 'default' : 'ghost'}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full justify-start ${activeCategory === category.id ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' : 'hover:bg-slate-100'}`}
                    >
                      <div className={`p-2 rounded-lg mr-3 ${category.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium">{category.name}</div>
                        <div className="text-xs text-slate-500">{category.count} documents</div>
                      </div>
                    </Button>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Documents List */}
          <div className="lg:col-span-3">
            {/* Search and Filter */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      placeholder="Search documents..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Bookmarks
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>

            {/* Documents Grid */}
            <div className="space-y-4">
              {filteredDocuments.map((doc) => (
                <Card key={doc.id} className="border-0 shadow-sm hover:shadow-lg transition-all group">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {getFileIcon(doc.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-slate-900 group-hover:text-orange-600 transition-colors">
                            {doc.title}
                          </h3>
                          {doc.isNew && (
                            <Badge className="bg-green-100 text-green-800">
                              New
                            </Badge>
                          )}
                          {doc.isPopular && (
                            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                              Popular
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-slate-600 mb-4">{doc.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-4">
                          <div className="flex items-center space-x-1">
                            <Package className="h-4 w-4" />
                            <span>{doc.size}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Updated {doc.lastUpdated}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Download className="h-4 w-4" />
                            <span>{doc.downloads} downloads</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span>{doc.rating}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {doc.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0 flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white transition-all duration-200">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredDocuments.length === 0 && (
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-12 text-center">
                    <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No documents found</h3>
                    <p className="text-slate-600">Try adjusting your search or filter criteria</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}