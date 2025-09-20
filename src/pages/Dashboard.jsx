import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User, MapPin, Phone, Mail, Leaf, TrendingUp, 
  DollarSign, Package, Globe, Award, ArrowUpRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { 
  marketInsightsService, 
  exportOrdersService, 
  earningsService, 
  cropPricingService,
  exportRecommendationsService,
  initializeSampleData 
} from '../services/dataService';

const Dashboard = () => {
  const { user, userData } = useAuth();
  const [marketInsights, setMarketInsights] = useState([]);
  const [exportRecommendations, setExportRecommendations] = useState([]);
  const [recentExports, setRecentExports] = useState([]);
  const [earningsData, setEarningsData] = useState([]);
  const [topCrops, setTopCrops] = useState([]);
  const [exportableProducts, setExportableProducts] = useState([
    { id: 1, name: 'Rice', price: 45, unit: '₹/kg', country: 'USA' },
    { id: 2, name: 'Wheat', price: 30, unit: '₹/kg', country: 'UAE' },
    { id: 3, name: 'Spices', price: 120, unit: '₹/kg', country: 'Germany' },
  ]);
  const [marketingData, setMarketingData] = useState([
    { country: 'USA', imports: 'Rice, Cotton', stockRating: 'High' },
    { country: 'UAE', imports: 'Fruits, Vegetables', stockRating: 'Very High' },
    { country: 'Germany', imports: 'Organic Grains', stockRating: 'Medium' },
  ]);
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

        // Fetch marketing data from Firestore and listen for updates
        const unsubscribe = db.collection('marketData').onSnapshot((snapshot) => {
          const newData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMarketingData(newData);
        });

        setLoading(false);
        return () => unsubscribe(); // Cleanup listener on unmount
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">₹2,20,000</p>
                <p className="text-green-600 text-sm flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  +12% from last month
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Active Exports</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">28</p>
                <p className="text-blue-600 text-sm flex items-center mt-1">
                  <Package className="h-4 w-4 mr-1" />
                  5 pending delivery
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Countries Reached</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
                <p className="text-purple-600 text-sm flex items-center mt-1">
                  <Globe className="h-4 w-4 mr-1" />
                  3 new this month
                </p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                <Globe className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">94%</p>
                <p className="text-yellow-600 text-sm flex items-center mt-1">
                  <Award className="h-4 w-4 mr-1" />
                  Excellent rating
                </p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg">
                <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Earnings Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Monthly Earnings
                </h3>
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
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
            </motion.div>

            {/* Recent Exports */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Recent Exports
              </h3>
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
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Profile Overview
              </h3>
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
            </motion.div>

            {/* Export Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Export Recommendations
              </h3>
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
            </motion.div>

            {/* Market Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Top Crops in Demand This Week
              </h3>
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
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;