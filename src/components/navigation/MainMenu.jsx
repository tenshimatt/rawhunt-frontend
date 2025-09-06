import React, { useState } from 'react';
import { 
  Search, 
  User, 
  Star, 
  MessageSquare, 
  Settings, 
  ShieldCheck, 
  TrendingUp, 
  Package, 
  Bell,
  LogOut,
  ChevronDown,
  ChevronRight,
  DollarSign,
  Award,
  Users,
  MapPin,
  Palette,
  Heart,
  Camera,
  Mic,
  Calendar,
  Globe,
  ShoppingCart,
  Store,
  UserPlus,
  BookOpen,
  Play,
  Trophy,
  Zap,
  Activity,
  Scale,
  Thermometer,
  AlertCircle,
  FileText,
  Upload,
  Phone,
  GraduationCap,
  Video,
  BarChart3,
  Calculator,
  Coins,
  Gift,
  Truck,
  Smartphone,
  Volume2,
  CheckSquare,
  PieChart,
  Target,
  Gamepad2,
  Crown,
  Brain,
  ScanLine,
  Briefcase
} from 'lucide-react';

const MainMenu = ({ user, isOpen, onClose, onNavigate }) => {
  const [expandedSections, setExpandedSections] = useState({
    core: true,
    location: false,
    community: false,
    health: false,
    education: false,
    commerce: false,
    paws: false,
    advanced: false,
    business: false,
    gamification: false,
    account: false,
    admin: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const menuSections = [
    {
      key: 'core',
      title: '🐕 Core Platform Features',
      icon: Heart,
      items: [
        {
          title: 'Multi-pet household management',
          icon: Users,
          description: 'Individual pet profiles, photos, breed info, age tracking',
          status: 'planned',
          onClick: () => onNavigate('pets')
        },
        {
          title: 'Smart feeding calculator',
          icon: Calculator,
          description: 'AI-powered portion recommendations by weight, age, activity, breed',
          status: 'planned',
          onClick: () => onNavigate('feeding-calculator')
        },
        {
          title: 'Barcode scanner',
          icon: ScanLine,
          description: 'Quick food/supplement entry via mobile app',
          status: 'planned',
          onClick: () => onNavigate('barcode-scanner')
        },
        {
          title: 'Voice-to-text logging',
          icon: Mic,
          description: 'Hands-free daily feeding notes',
          status: 'planned',
          onClick: () => onNavigate('voice-logging')
        },
        {
          title: 'Weekly batch confirmation',
          icon: CheckSquare,
          description: 'Smart deviation detection for feeding schedules',
          status: 'planned',
          onClick: () => onNavigate('batch-confirmation')
        },
        {
          title: 'Feeding reminder notifications',
          icon: Bell,
          description: 'Timezone-aware scheduling system',
          status: 'partial',
          onClick: () => onNavigate('notifications')
        },
        {
          title: 'Multi-language support',
          icon: Globe,
          description: 'Global raw feeding community access',
          status: 'planned',
          onClick: () => onNavigate('language-settings')
        }
      ]
    },
    {
      key: 'location',
      title: '📍 Location & Discovery',
      icon: MapPin,
      items: [
        {
          title: 'IP-based store locator',
          icon: Store,
          description: 'Real-time inventory status from partner stores',
          status: 'working',
          onClick: () => onNavigate('search')
        },
        {
          title: 'Raw-friendly vet directory',
          icon: Heart,
          description: 'Vetted veterinarians with ratings and reviews',
          status: 'planned',
          onClick: () => onNavigate('vet-directory')
        },
        {
          title: 'Local raw feeding meetups',
          icon: Users,
          description: 'Event scheduling and community gatherings',
          status: 'planned',
          onClick: () => onNavigate('meetups')
        },
        {
          title: 'Supplier heat maps',
          icon: MapPin,
          description: 'Raw food availability density visualization',
          status: 'working',
          onClick: () => onNavigate('map')
        },
        {
          title: 'Price comparison engine',
          icon: DollarSign,
          description: 'Compare prices across local and online suppliers',
          status: 'planned',
          onClick: () => onNavigate('price-compare')
        },
        {
          title: 'Delivery radius calculator',
          icon: Truck,
          description: 'Local raw food co-op delivery zones',
          status: 'planned',
          onClick: () => onNavigate('delivery-zones')
        }
      ]
    },
    {
      key: 'community',
      title: '👥 Community & Social',
      icon: Users,
      items: [
        {
          title: 'Pet profile sharing',
          icon: Camera,
          description: 'Privacy controls and follower system',
          status: 'planned',
          onClick: () => onNavigate('pet-profiles')
        },
        {
          title: 'Before/after galleries',
          icon: Trophy,
          description: 'Transformation showcases from raw diet results',
          status: 'planned',
          onClick: () => onNavigate('transformations')
        },
        {
          title: 'Community challenges',
          icon: Target,
          description: '30-day raw transition, DIY meal prep challenges',
          status: 'planned',
          onClick: () => onNavigate('challenges')
        },
        {
          title: 'Expert breeder network',
          icon: Crown,
          description: 'Breed-specific feeding advice from professionals',
          status: 'planned',
          onClick: () => onNavigate('breeders')
        },
        {
          title: 'Recipe exchange',
          icon: BookOpen,
          description: 'User recipes with ratings and nutritional analysis',
          status: 'planned',
          onClick: () => onNavigate('recipes')
        },
        {
          title: 'Success story submissions',
          icon: Star,
          description: 'Share achievements and earn PAWS token rewards',
          status: 'planned',
          onClick: () => onNavigate('success-stories')
        },
        {
          title: 'Live Q&A sessions',
          icon: Video,
          description: 'Sessions with certified pet nutritionists',
          status: 'planned',
          onClick: () => onNavigate('qa-sessions')
        },
        {
          title: 'Peer mentorship program',
          icon: UserPlus,
          description: 'Pairing new feeders with experienced ones',
          status: 'planned',
          onClick: () => onNavigate('mentorship')
        }
      ]
    },
    {
      key: 'health',
      title: '🏥 Health & Wellness Tracking',
      icon: Activity,
      items: [
        {
          title: 'Symptom tracker',
          icon: AlertCircle,
          description: 'Photo uploads for skin/coat condition monitoring',
          status: 'planned',
          onClick: () => onNavigate('symptoms')
        },
        {
          title: 'Weight trend graphs',
          icon: Scale,
          description: 'Ideal weight projections and tracking',
          status: 'planned',
          onClick: () => onNavigate('weight-tracking')
        },
        {
          title: 'Stool quality scorer',
          icon: BarChart3,
          description: 'Bristol scale adapted for pets',
          status: 'planned',
          onClick: () => onNavigate('stool-tracker')
        },
        {
          title: 'Energy level tracker',
          icon: Zap,
          description: 'Activity correlation and monitoring',
          status: 'planned',
          onClick: () => onNavigate('energy-tracking')
        },
        {
          title: 'Allergy/sensitivity log',
          icon: AlertCircle,
          description: 'Ingredient elimination tracking system',
          status: 'planned',
          onClick: () => onNavigate('allergies')
        },
        {
          title: 'Vaccination scheduler',
          icon: Calendar,
          description: 'Medication reminders and tracking',
          status: 'planned',
          onClick: () => onNavigate('vaccinations')
        },
        {
          title: 'Vet visit summaries',
          icon: FileText,
          description: 'Document upload and visit history',
          status: 'planned',
          onClick: () => onNavigate('vet-visits')
        },
        {
          title: 'Lab result storage',
          icon: Upload,
          description: 'Trend analysis and historical tracking',
          status: 'planned',
          onClick: () => onNavigate('lab-results')
        },
        {
          title: 'Emergency vet contacts',
          icon: Phone,
          description: 'Location-based quick-dial system',
          status: 'planned',
          onClick: () => onNavigate('emergency-contacts')
        }
      ]
    },
    {
      key: 'education',
      title: '📚 Educational Content',
      icon: BookOpen,
      items: [
        {
          title: 'Interactive raw feeding course',
          icon: GraduationCap,
          description: 'Comprehensive course with completion certificates',
          status: 'planned',
          onClick: () => onNavigate('courses')
        },
        {
          title: 'Video tutorial library',
          icon: Play,
          description: 'Meal prep and feeding technique tutorials',
          status: 'planned',
          onClick: () => onNavigate('videos')
        },
        {
          title: 'Breed-specific guides',
          icon: BookOpen,
          description: 'Downloadable PDFs for different breeds',
          status: 'planned',
          onClick: () => onNavigate('breed-guides')
        },
        {
          title: 'Transition timeline generator',
          icon: Calendar,
          description: 'Custom schedules for switching from kibble',
          status: 'planned',
          onClick: () => onNavigate('transition-planner')
        },
        {
          title: 'Myth-buster section',
          icon: Brain,
          description: 'Address common raw feeding concerns',
          status: 'planned',
          onClick: () => onNavigate('myths')
        },
        {
          title: 'Scientific study database',
          icon: FileText,
          description: 'Research with accessible summaries',
          status: 'planned',
          onClick: () => onNavigate('research')
        },
        {
          title: 'Weekly webinars',
          icon: Video,
          description: 'Live sessions with replay access',
          status: 'planned',
          onClick: () => onNavigate('webinars')
        },
        {
          title: 'Glossary with audio',
          icon: Volume2,
          description: 'Terms with pronunciation guides',
          status: 'planned',
          onClick: () => onNavigate('glossary')
        }
      ]
    },
    {
      key: 'commerce',
      title: '🛒 E-commerce & Marketplace',
      icon: ShoppingCart,
      items: [
        {
          title: 'Subscription boxes',
          icon: Package,
          description: 'Customized monthly deliveries',
          status: 'planned',
          onClick: () => onNavigate('subscriptions')
        },
        {
          title: 'Bulk buying co-ops',
          icon: Users,
          description: 'Group purchase coordination',
          status: 'planned',
          onClick: () => onNavigate('bulk-buying')
        },
        {
          title: 'Used equipment marketplace',
          icon: Store,
          description: 'Freezers, grinders, scales marketplace',
          status: 'planned',
          onClick: () => onNavigate('equipment-marketplace')
        },
        {
          title: 'Digital product store',
          icon: Package,
          description: 'Meal plans, guides, templates',
          status: 'planned',
          onClick: () => onNavigate('digital-store')
        },
        {
          title: 'Affiliate program',
          icon: Award,
          description: 'Supplement and tool recommendations',
          status: 'planned',
          onClick: () => onNavigate('affiliates')
        },
        {
          title: 'Gift registry',
          icon: Gift,
          description: 'Registry system for new pet adoptions',
          status: 'planned',
          onClick: () => onNavigate('gift-registry')
        },
        {
          title: 'Loyalty points system',
          icon: Award,
          description: 'Integrated with PAWS token ecosystem',
          status: 'working',
          onClick: () => onNavigate('paws')
        },
        {
          title: 'Flash sales notifications',
          icon: Bell,
          description: 'Alerts for perishable inventory deals',
          status: 'planned',
          onClick: () => onNavigate('flash-sales')
        }
      ]
    },
    {
      key: 'paws',
      title: '🪙 PAWS Token Ecosystem (Solana)',
      icon: Coins,
      items: [
        {
          title: 'Token minting',
          icon: Coins,
          description: 'Solana blockchain-based PAWS tokens',
          status: 'working',
          onClick: () => onNavigate('paws')
        },
        {
          title: 'Staking rewards',
          icon: TrendingUp,
          description: 'Long-term platform engagement rewards',
          status: 'planned',
          onClick: () => onNavigate('staking')
        },
        {
          title: 'NFT pet badges',
          icon: Award,
          description: 'Milestone achievement collectibles',
          status: 'planned',
          onClick: () => onNavigate('nft-badges')
        },
        {
          title: 'Governance voting',
          icon: CheckSquare,
          description: 'Community voting on features and partnerships',
          status: 'planned',
          onClick: () => onNavigate('governance')
        },
        {
          title: 'Peer-to-peer tipping',
          icon: DollarSign,
          description: 'Reward helpful community members',
          status: 'working',
          onClick: () => onNavigate('tipping')
        },
        {
          title: 'Merchant discounts',
          icon: Store,
          description: 'Partner stores accepting PAWS tokens',
          status: 'planned',
          onClick: () => onNavigate('merchant-network')
        },
        {
          title: 'Referral bonuses',
          icon: UserPlus,
          description: 'PAWS rewards for bringing new members',
          status: 'working',
          onClick: () => onNavigate('referrals')
        },
        {
          title: 'Content creation rewards',
          icon: Camera,
          description: 'Earn PAWS for blog posts, videos, recipes',
          status: 'planned',
          onClick: () => onNavigate('content-rewards')
        }
      ]
    },
    {
      key: 'advanced',
      title: '🚀 Advanced Features',
      icon: Zap,
      items: [
        {
          title: 'AI meal photo analyzer',
          icon: Camera,
          description: 'Estimate portions and identify ingredients',
          status: 'planned',
          onClick: () => onNavigate('photo-analyzer')
        },
        {
          title: 'Smart scale integration',
          icon: Scale,
          description: 'Automatic weight logging via IoT devices',
          status: 'planned',
          onClick: () => onNavigate('smart-scales')
        },
        {
          title: 'Wearable device sync',
          icon: Smartphone,
          description: 'Activity data correlation from pet wearables',
          status: 'planned',
          onClick: () => onNavigate('wearables')
        },
        {
          title: 'Voice assistant integration',
          icon: Volume2,
          description: 'Alexa/Google Assistant for feeding reminders',
          status: 'planned',
          onClick: () => onNavigate('voice-assistants')
        },
        {
          title: 'QR code vet sharing',
          icon: ScanLine,
          description: 'Instant medical history access for vets',
          status: 'planned',
          onClick: () => onNavigate('qr-medical')
        },
        {
          title: 'Blockchain-verified sourcing',
          icon: ShieldCheck,
          description: 'Premium supplier verification system',
          status: 'planned',
          onClick: () => onNavigate('verified-sourcing')
        },
        {
          title: 'AR portion visualizer',
          icon: Camera,
          description: 'Augmented reality feeding portion guide',
          status: 'planned',
          onClick: () => onNavigate('ar-portions')
        },
        {
          title: 'Third-party API',
          icon: Settings,
          description: 'Integrations for fitness trackers, smart feeders',
          status: 'planned',
          onClick: () => onNavigate('api-integrations')
        }
      ]
    },
    {
      key: 'business',
      title: '💼 Business/Breeder Tools',
      icon: Briefcase,
      items: [
        {
          title: 'Litter management system',
          icon: Users,
          description: 'Track multiple puppies and feeding protocols',
          status: 'planned',
          onClick: () => onNavigate('litter-management')
        },
        {
          title: 'Client portal',
          icon: User,
          description: 'Breeders share feeding protocols with clients',
          status: 'planned',
          onClick: () => onNavigate('breeder-portal')
        },
        {
          title: 'Wholesale ordering',
          icon: Package,
          description: 'Volume discounts for commercial operations',
          status: 'planned',
          onClick: () => onNavigate('wholesale')
        },
        {
          title: 'Kennel feeding scheduler',
          icon: Calendar,
          description: 'Boarding facility management tools',
          status: 'planned',
          onClick: () => onNavigate('kennel-scheduler')
        },
        {
          title: 'Cost accounting tools',
          icon: Calculator,
          description: 'Commercial raw feeding operation analytics',
          status: 'planned',
          onClick: () => onNavigate('cost-accounting')
        }
      ]
    },
    {
      key: 'gamification',
      title: '🎮 Gamification & Engagement',
      icon: Gamepad2,
      items: [
        {
          title: 'Daily check-in streaks',
          icon: Target,
          description: 'Bonus PAWS rewards for consistency',
          status: 'planned',
          onClick: () => onNavigate('daily-streaks')
        },
        {
          title: 'Achievement system',
          icon: Trophy,
          description: 'Raw Rookie, Supplement Sage badges',
          status: 'planned',
          onClick: () => onNavigate('achievements')
        },
        {
          title: 'Community leaderboards',
          icon: BarChart3,
          description: 'Rankings for community contributions',
          status: 'planned',
          onClick: () => onNavigate('leaderboards')
        },
        {
          title: 'Virtual pet avatar',
          icon: Heart,
          description: 'Avatar evolves with real pet progress',
          status: 'planned',
          onClick: () => onNavigate('virtual-pet')
        },
        {
          title: 'Educational mini-games',
          icon: Brain,
          description: 'Interactive raw feeding concept games',
          status: 'planned',
          onClick: () => onNavigate('mini-games')
        },
        {
          title: 'Seasonal events',
          icon: Calendar,
          description: 'Limited-edition NFT rewards and challenges',
          status: 'planned',
          onClick: () => onNavigate('seasonal-events')
        }
      ]
    },
    {
      key: 'account',
      title: 'Your Account',
      icon: User,
      items: user ? [
        {
          title: 'Profile Settings',
          icon: Settings,
          description: 'Manage your account settings',
          status: 'partial',
          onClick: () => onNavigate('profile')
        },
        {
          title: 'Order History',
          icon: Package,
          description: 'View your past orders',
          status: 'planned',
          onClick: () => onNavigate('orders')
        },
        {
          title: 'My Reviews',
          icon: Star,
          description: 'Reviews you\'ve written',
          status: 'working',
          onClick: () => onNavigate('my-reviews')
        },
        {
          title: 'Transaction History',
          icon: TrendingUp,
          description: 'Reward points transactions',
          status: 'working',
          onClick: () => onNavigate('transactions')
        }
      ] : [
        {
          title: 'Sign In',
          icon: User,
          description: 'Access your account',
          status: 'working',
          onClick: () => onNavigate('login')
        },
        {
          title: 'Create Account',
          icon: User,
          description: 'Join the Rawgle community',
          status: 'working', 
          onClick: () => onNavigate('register')
        }
      ]
    }
  ];

  // Add admin section for admin users
  if (user?.role === 'admin') {
    menuSections.push({
      key: 'admin',
      title: 'Administration',
      icon: ShieldCheck,
      items: [
        {
          title: 'User Management',
          icon: Users,
          description: 'Manage platform users',
          status: 'planned',
          onClick: () => onNavigate('admin/users')
        },
        {
          title: 'Supplier Management',
          icon: Package,
          description: 'Manage supplier listings',
          status: 'planned',
          onClick: () => onNavigate('admin/suppliers')
        },
        {
          title: 'Platform Analytics',
          icon: TrendingUp,
          description: 'View platform metrics',
          status: 'planned',
          onClick: () => onNavigate('admin/analytics')
        },
        {
          title: 'Points Management',
          icon: Award,
          description: 'Monitor reward points system',
          status: 'planned',
          onClick: () => onNavigate('admin/paws')
        }
      ]
    });
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'working': return 'text-green-600 bg-green-50 border-green-200';
      case 'ready': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'partial': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'planned': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'working': return 'Working';
      case 'ready': return 'Ready';
      case 'partial': return 'Partial';
      case 'planned': return 'Planned';
      default: return 'Unknown';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={onClose}>
      <div 
        className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">R</span>
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Rawgle Platform</h2>
                <p className="text-xs text-gray-500">Feature Overview</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-light"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-4">
          {menuSections.map((section) => (
            <div key={section.key} className="mb-6">
              <button
                onClick={() => toggleSection(section.key)}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <section.icon className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">{section.title}</span>
                </div>
                {expandedSections[section.key] ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {expandedSections[section.key] && (
                <div className="ml-8 mt-2 space-y-2">
                  {section.items.map((item, index) => (
                    <button
                      key={index}
                      onClick={item.onClick}
                      className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <item.icon className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-gray-900 group-hover:text-emerald-600">
                              {item.title}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(item.status)}`}>
                            {getStatusText(item.status)}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {user && (
          <div className="border-t p-4">
            <button 
              onClick={() => onNavigate('logout')}
              className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        )}

        <div className="border-t p-4 bg-gray-50">
          <div className="text-xs text-gray-500 text-center">
            <p className="mb-1">Rawgle Platform v1.0</p>
            <p>Raw Feeding Community</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;