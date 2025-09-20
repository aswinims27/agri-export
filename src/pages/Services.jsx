import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, Truck, Shield, TrendingUp, Users, CreditCard, FileText, BookOpen, 
  MessageCircle, Award, Zap, Heart, Plus, Package, MapPin, DollarSign,
  BarChart3, AlertTriangle, FileCheck, Calculator
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { exportProductsService } from '../services/exportProductsService';
import { communityService } from '../services/communityService';
import { marketingService } from '../services/marketingService';
import { exportGuideService } from '../services/exportGuideService';
import { smartExportService } from '../services/smartExportService';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import PostCard from '../components/PostCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Services = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [countryImports, setCountryImports] = useState([]);
  const [guideSteps, setGuideSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Product form state
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    quantity: '',
    price: '',
    targetCountries: [],
    description: ''
  });
  
  // Post form state
  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    category: ''
  });
  
  // Smart tools state
  const [pricingSuggestion, setPricingSuggestion] = useState(null);
  const [riskAlerts, setRiskAlerts] = useState([]);
  const [currencyConversion, setCurrencyConversion] = useState(null);

  const categories = ['Spices', 'Grains', 'Pulses', 'Fruits', 'Vegetables', 'Organic Products', 'Processed Foods'];
  const countries = ['USA', 'UAE', 'Germany', 'Japan', 'UK', 'Saudi Arabia', 'Canada', 'Australia'];
  const postCategories = ['General Discussion', 'Market Updates', 'Technical Help', 'Success Stories', 'Questions'];

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch farmer's products
      const farmerProducts = await exportProductsService.getFarmerProducts(user.uid);
      setProducts(farmerProducts);
      
      // Fetch community posts
      const communityPosts = await communityService.getAllPosts();
      setPosts(communityPosts);
      
      // Fetch country imports for marketing dashboard
      const imports = await marketingService.getCountryImports();
      setCountryImports(imports);
      
      // Fetch export guide
      const guide = await exportGuideService.getGuideSteps();
      setGuideSteps(guide);
      
      // Get smart export suggestions
      if (farmerProducts.length > 0) {
        const firstProduct = farmerProducts[0];
        const pricing = await smartExportService.getDynamicPricing(firstProduct.name, 'USA');
        setPricingSuggestion(pricing);
        
        const alerts = await smartExportService.getExportRiskAlerts('USA', firstProduct.name);
        setRiskAlerts(alerts);
        
        const conversion = await smartExportService.convertCurrency(firstProduct.price, 'INR', 'USD');
        setCurrencyConversion(conversion);
      }
    } catch (error) {
      console.error('Error fetching services data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      await exportProductsService.addProduct({
        ...productForm,
        quantity: parseInt(productForm.quantity),
        price: parseFloat(productForm.price)
      });
      setProductForm({
        name: '',
        category: '',
        quantity: '',
        price: '',
        targetCountries: [],
        description: ''
      });
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      await communityService.createPost(postForm);
      setPostForm({
        title: '',
        content: '',
        category: ''
      });
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLike = async (postId, isLiked) => {
    try {
      await communityService.toggleLike(postId, isLiked);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleComment = async (postId, comment) => {
    try {
      await communityService.addComment(postId, comment);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

  const coreServices = [
    {
      icon: Globe,
      title: 'Buyer Matchmaking',
      description: 'Connect with verified international buyers actively looking for your products',
      features: ['AI-powered matching', 'Buyer verification', 'Direct communication', 'Price negotiation support']
    },
    {
      icon: Truck,
      title: 'Logistics Management',
      description: 'End-to-end logistics support from farm gate to international destination',
      features: ['Shipping coordination', 'Customs clearance', 'Insurance coverage', 'Real-time tracking']
    },
    {
      icon: Shield,
      title: 'Compliance Guidance',
      description: 'Expert assistance with export regulations and documentation requirements',
      features: ['Document preparation', 'Regulatory compliance', 'Quality certifications', 'Legal support']
    },
    {
      icon: TrendingUp,
      title: 'Market Intelligence',
      description: 'Real-time market data, pricing insights, and demand forecasting',
      features: ['Price trends', 'Market analysis', 'Demand forecasting', 'Competitive intelligence']
    }
  ];

  const valueAddedServices = [
    {
      icon: Award,
      title: 'Export Readiness Score',
      description: 'Comprehensive assessment of your export preparedness with actionable recommendations'
    },
    {
      icon: CreditCard,
      title: 'Finance & Payments',
      description: 'Secure payment processing, trade financing, and working capital solutions'
    },
    {
      icon: FileText,
      title: 'Insurance Services',
      description: 'Comprehensive coverage for crops, shipments, and trade transactions'
    },
    {
      icon: BookOpen,
      title: 'Knowledge Hub',
      description: 'Educational resources, webinars, and training programs for farmers'
    },
    {
      icon: MessageCircle,
      title: 'Multilingual Support',
      description: '24/7 customer support in multiple regional languages'
    },
    {
      icon: Users,
      title: 'Farmer Community',
      description: 'Connect with fellow exporters, share experiences, and learn from others'
    }
  ];

  const tabs = [
    { id: 'products', label: 'Export Products', icon: Package },
    { id: 'community', label: 'Community Forum', icon: MessageCircle },
    { id: 'marketing', label: 'Marketing Dashboard', icon: BarChart3 },
    { id: 'guide', label: 'Export Guide', icon: FileCheck },
    { id: 'smart-tools', label: 'Smart Tools', icon: Calculator }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please log in to access services
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Our <span className="text-green-600 dark:text-green-400">Services</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Comprehensive solutions to help farmers succeed in global markets, 
              from initial planning to successful export delivery.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Navigation */}
      <section className="py-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-green-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-600'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Export Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Export Products
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  List your products for international buyers
                </p>
              </div>

              {/* Add Product Form */}
              <ChartCard title="Add New Product">
                <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Quantity (kg)
                    </label>
                    <input
                      type="number"
                      value={productForm.quantity}
                      onChange={(e) => setProductForm({...productForm, quantity: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price (₹/kg)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Target Countries
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {countries.map(country => (
                        <label key={country} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={productForm.targetCountries.includes(country)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setProductForm({
                                  ...productForm,
                                  targetCountries: [...productForm.targetCountries, country]
                                });
                              } else {
                                setProductForm({
                                  ...productForm,
                                  targetCountries: productForm.targetCountries.filter(c => c !== country)
                                });
                              }
                            }}
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{country}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
                    >
                      Add Product
                    </button>
                  </div>
                </form>
              </ChartCard>

              {/* Products List */}
              <ChartCard title="Your Export Products">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {product.name}
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <p><span className="font-medium">Category:</span> {product.category}</p>
                        <p><span className="font-medium">Quantity:</span> {product.quantity} kg</p>
                        <p><span className="font-medium">Price:</span> ₹{product.price}/kg</p>
                        <p><span className="font-medium">Target Countries:</span> {product.targetCountries?.join(', ')}</p>
                      </div>
                      <div className="mt-3">
                        <span className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs rounded-full">
                          {product.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ChartCard>
            </div>
          )}

          {/* Community Forum Tab */}
          {activeTab === 'community' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Community Forum
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Connect with fellow farmers and share experiences
                </p>
              </div>

              {/* Create Post Form */}
              <ChartCard title="Create New Post">
                <form onSubmit={handlePostSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={postForm.title}
                      onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={postForm.category}
                      onChange={(e) => setPostForm({...postForm, category: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="">Select Category</option>
                      {postCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Content
                    </label>
                    <textarea
                      value={postForm.content}
                      onChange={(e) => setPostForm({...postForm, content: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
                  >
                    Create Post
                  </button>
                </form>
              </ChartCard>

              {/* Posts List */}
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onComment={handleComment}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Marketing Dashboard Tab */}
          {activeTab === 'marketing' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Marketing Dashboard
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Real-time market insights and country-wise import data
                </p>
              </div>

              {/* Country Import Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {countryImports.slice(0, 4).map((country, index) => (
                  <StatCard
                    key={country.id}
                    icon={Globe}
                    title={country.country}
                    value={country.stockRating}
                    subtitle={`${country.imports?.length || 0} products`}
                    color={country.stockRating === 'Very High' ? 'green' : 
                           country.stockRating === 'High' ? 'blue' : 
                           country.stockRating === 'Medium' ? 'yellow' : 'red'}
                  />
                ))}
              </div>

              {/* Import Value Chart */}
              <ChartCard title="Country-wise Import Values">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={countryImports}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="country" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`$${(value/1000000).toFixed(0)}M`, 'Import Value']}
                        labelStyle={{ color: '#374151' }}
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Bar dataKey="totalImportValue" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>

              {/* Product Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartCard title="Top Import Products">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={countryImports[0]?.topProducts || []}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({product, percentage}) => `${product} (${percentage}%)`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {(countryImports[0]?.topProducts || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>

                <ChartCard title="Growth Rates by Country">
                  <div className="space-y-4">
                    {countryImports.map((country) => (
                      <div key={country.id} className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {country.country}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${Math.min(country.growthRate * 8, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-green-600">
                            +{country.growthRate}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ChartCard>
              </div>
            </div>
          )}

          {/* Export Guide Tab */}
          {activeTab === 'guide' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Export Guide
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Step-by-step guide to successful exporting
                </p>
              </div>

              <div className="space-y-6">
                {guideSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 shadow-lg"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {step.stepNumber}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {step.title}
                          </h3>
                          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm rounded-full">
                            {step.category}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {step.description}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {step.estimatedTime}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {step.cost}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Award className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {step.difficulty}
                            </span>
                          </div>
                        </div>
                        <div 
                          className="prose prose-sm max-w-none text-gray-600 dark:text-gray-300"
                          dangerouslySetInnerHTML={{ __html: step.content }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Smart Tools Tab */}
          {activeTab === 'smart-tools' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Smart Export Tools
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  AI-powered tools to optimize your exports
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Dynamic Pricing */}
                {pricingSuggestion && (
                  <ChartCard title="Dynamic Pricing Suggestion">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {pricingSuggestion.product}
                        </span>
                        <span className="text-sm text-gray-500">
                          to {pricingSuggestion.targetCountry}
                        </span>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            ₹{pricingSuggestion.priceRange.suggested}/kg
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            Range: ₹{pricingSuggestion.priceRange.min} - ₹{pricingSuggestion.priceRange.max}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Confidence: {pricingSuggestion.confidence} • 
                        Updated: {new Date(pricingSuggestion.lastUpdated).toLocaleDateString()}
                      </div>
                    </div>
                  </ChartCard>
                )}

                {/* Currency Conversion */}
                {currencyConversion && (
                  <ChartCard title="Currency Conversion">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          ₹{currencyConversion.amount}
                        </span>
                        <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                          ${currencyConversion.convertedAmount}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Exchange Rate: 1 INR = ${currencyConversion.rate}
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <div className="font-semibold">USD</div>
                          <div>${(currencyConversion.amount * 0.012).toFixed(2)}</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <div className="font-semibold">EUR</div>
                          <div>€{(currencyConversion.amount * 0.011).toFixed(2)}</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <div className="font-semibold">GBP</div>
                          <div>£{(currencyConversion.amount * 0.0095).toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  </ChartCard>
                )}
              </div>

              {/* Risk Alerts */}
              {riskAlerts.length > 0 && (
                <ChartCard title="Export Risk Alerts">
                  <div className="space-y-4">
                    {riskAlerts.map((alert, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-l-4 ${
                          alert.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400' :
                          alert.type === 'opportunity' ? 'bg-green-50 dark:bg-green-900/20 border-green-400' :
                          'bg-blue-50 dark:bg-blue-900/20 border-blue-400'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                            alert.type === 'warning' ? 'text-yellow-600' :
                            alert.type === 'opportunity' ? 'text-green-600' :
                            'text-blue-600'
                          }`} />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {alert.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              {alert.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              Action: {alert.action}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ChartCard>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Core Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center mb-4">
              <Zap className="h-8 w-8 text-green-600 dark:text-green-400 mr-2" />
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                Core Services
              </h2>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Essential services that form the foundation of your export journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {coreServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <service.icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {service.description}
                    </p>
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value-Added Services */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-green-600 dark:text-green-400 mr-2" />
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                Value-Added Services
              </h2>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Additional services to enhance your export success and grow your business
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {valueAddedServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Simple, streamlined process to get you exporting in no time
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Register & Verify', desc: 'Sign up and complete verification process' },
              { step: '2', title: 'Get Matched', desc: 'Our AI connects you with suitable buyers' },
              { step: '3', title: 'Negotiate & Confirm', desc: 'Discuss terms and finalize agreements' },
              { step: '4', title: 'Export & Deliver', desc: 'Ship your products with our support' }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {item.desc}
                </p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-green-200 dark:bg-green-800 transform translate-x-4"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Start Your Export Journey?
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Join thousands of farmers who have successfully expanded their business globally with our comprehensive services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-green-600 hover:bg-green-50 px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-200">
                Get Started Today
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-200">
                Schedule Consultation
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;