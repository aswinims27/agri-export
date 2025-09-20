import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User, MapPin, Phone, Mail, Leaf, TrendingUp, DollarSign, Package, 
  Globe, Award, ArrowUpRight, AlertTriangle, Calculator, FileText
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { marketInsightsService, exportOrdersService, earningsService, cropPricingService, exportRecommendationsService, initializeSampleData } from '../services/dataService';
import { exportProductsService } from '../services/exportProductsService';
import { smartExportService } from '../services/smartExportService';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';

const Dashboard = () => {
  const { user, userData } = useAuth();
  const [marketInsights, setMarketInsights] = useState([]);
  const [exportRecommendations, setExportRecommendations] = useState([]);
  const [recentExports, setRecentExports] = useState([]);
  const [earningsData, setEarningsData] = useState([]);
  const [topCrops, setTopCrops] = useState([]);
  const [exportableProducts, setExportableProducts] = useState([]);
  const [countryTrends, setCountryTrends] = useState([]);
  const [smartInsights, setSmartInsights] = useState({
    pricingSuggestions: [],
    riskAlerts: [],
    currencyRates: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Initialize sample data if needed (only runs once)
        try {
          await initializeSampleData();
        } catch (error) {
          console.log('Sample data already exists or error initializing:', error);
        }
        
        // Fetch real market insights
        const insights = await marketInsightsService.getMarketInsights();
        setMarketInsights(insights);
        
        // Fetch real export recommendations for this farmer
        const recommendations = await exportRecommendationsService.getFarmerRecommendations(user.uid);
        setExportRecommendations(recommendations);
        
        // Fetch farmer's export orders
        const orders = await exportOrdersService.getFarmerExportOrders(user.uid);
        setRecentExports(orders.slice(0, 5)); // Show only recent 5
        
        // Fetch farmer's earnings data
        const earnings = await earningsService.getFarmerEarnings(user.uid);
        setEarningsData(earnings);
        
        // Fetch current crop prices
        const cropPrices = await cropPricingService.getCurrentCropPrices();
        setTopCrops(cropPrices);
        
        // Fetch farmer's exportable products
        const products = await exportProductsService.getFarmerProducts(user.uid);
        setExportableProducts(products);
        
        // Get smart insights
        if (products.length > 0) {
          const firstProduct = products[0];
          const pricing = await smartExportService.getDynamicPricing(firstProduct.name, 'USA');
          const alerts = await smartExportService.getExportRiskAlerts('USA', firstProduct.name);
          const currency = await smartExportService.convertCurrency(100, 'INR', 'USD');
          
          setSmartInsights({
            pricingSuggestions: [pricing],
            riskAlerts: alerts,
            currencyRates: currency
          });
        }
        
        // Sample country trends data
        setCountryTrends([
          { country: 'USA', demand: 85, growth: 12 },
          { country: 'UAE', demand: 92, growth: 18 },
          { country: 'Germany', demand: 78, growth: 8 },
          { country: 'Japan', demand: 88, growth: 15 }
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please log in to access your dashboard
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {userData?.name || user.displayName || 'Farmer'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Here's an overview of your export business performance
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={DollarSign}
            title="Total Earnings"
            value="₹2,20,000"
            subtitle={
              <span className="flex items-center">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                +12% from last month
              </span>
            }
            color="green"
            trend={true}
          />
          
          <StatCard
            icon={Package}
            title="Active Exports"
            value="28"
            subtitle="5 pending delivery"
            color="blue"
          />
          
          <StatCard
            icon={Globe}
            title="Countries Reached"
            value="12"
            subtitle="3 new this month"
            color="purple"
          />
          
          <StatCard
            icon={Award}
            title="Success Rate"
            value="94%"
            subtitle="Excellent rating"
            color="yellow"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Earnings Chart */}
            <ChartCard title="Monthly Earnings vs Previous Year">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={earningsData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`₹${value.toLocaleString()}`, 'Earnings']}
                      labelStyle={{ color: '#374151' }}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="totalEarnings" 
                      stroke="#059669" 
                      strokeWidth={3}
                      dot={{ fill: '#059669', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
            
            {/* Country Demand Trends */}
            <ChartCard title="Real-time Country Import Trends">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={countryTrends}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="country" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'demand' ? `${value}%` : `+${value}%`,
                        name === 'demand' ? 'Demand Level' : 'Growth Rate'
                      ]}
                      labelStyle={{ color: '#374151' }}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar dataKey="demand" fill="#10B981" name="demand" />
                    <Bar dataKey="growth" fill="#3B82F6" name="growth" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            {/* Recent Exports */}
            <ChartCard title="Recent Exports with Status Tracking">
              <div className="space-y-4">
                {recentExports.map((export_item) => (
                  <div key={export_item.id} className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                        <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {export_item.product} to {export_item.buyer}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {export_item.quantity} • {export_item.country}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {typeof export_item.value === 'number' ? `₹${export_item.value.toLocaleString()}` : export_item.value}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        export_item.status === 'Delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        export_item.status === 'In Transit' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {export_item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Profile Card */}
            <ChartCard title="Profile Overview">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {userData?.name || user.displayName || 'Not provided'}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {user.email}
                  </span>
                </div>
                {userData?.mobile && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {userData.mobile}
                    </span>
                  </div>
                )}
                {userData?.location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {userData.location}
                    </span>
                  </div>
                )}
                {userData?.exportItem && (
                  <div className="flex items-center space-x-3">
                    <Leaf className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Primary: {userData.exportItem}
                    </span>
                  </div>
                )}
              </div>
            </ChartCard>
            
            {/* Exportable Products */}
            <ChartCard title="Your Exportable Products">
              <div className="space-y-3">
                {exportableProducts.slice(0, 3).map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {product.quantity} kg • {product.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        ₹{product.price}/kg
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        {smartInsights.currencyRates ? 
                          `$${(product.price * smartInsights.currencyRates.rate).toFixed(2)}/kg` : 
                          'USD rate loading...'
                        }
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
            
            {/* Smart Export Insights */}
            <ChartCard title="Smart Export Insights">
              <div className="space-y-4">
                {/* Dynamic Pricing */}
                {smartInsights.pricingSuggestions.length > 0 && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calculator className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800 dark:text-green-400">
                        Pricing Suggestion
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Suggested price for {smartInsights.pricingSuggestions[0].product}: 
                      <span className="font-semibold text-green-600 ml-1">
                        ₹{smartInsights.pricingSuggestions[0].priceRange.suggested}/kg
                      </span>
                    </p>
                  </div>
                )}
                
                {/* Risk Alerts */}
                {smartInsights.riskAlerts.slice(0, 2).map((alert, index) => (
                  <div key={index} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
                        {alert.title}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      {alert.message}
                    </p>
                  </div>
                ))}
                
                {/* Currency Rates */}
                {smartInsights.currencyRates && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-400">
                        Currency Rates
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-semibold">USD</div>
                        <div>${smartInsights.currencyRates.rate}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">EUR</div>
                        <div>€0.011</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">GBP</div>
                        <div>£0.0095</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ChartCard>

            {/* Export Recommendations */}
            <ChartCard title="AI-Powered Export Recommendations">
              <div className="space-y-4">
                {exportRecommendations.map((rec, index) => (
                  <div key={index} className="p-4 bg-green-50/50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {rec.buyer}
                      </p>
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        {rec.match}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      Looking for: {rec.product}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {rec.location}
                    </p>
                  </div>
                ))}
              </div>
            </ChartCard>

            {/* Market Insights */}
            <ChartCard title="Top Crops in Demand This Week">
              <div className="space-y-3">
                {topCrops.map((crop, index) => (
                  <div key={crop.id || index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {crop.crop}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {crop.demand} demand
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {crop.priceUnit === '₹/kg' ? `₹${crop.currentPrice}/kg` : crop.price}
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        {crop.trend}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;