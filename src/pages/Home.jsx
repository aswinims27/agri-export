import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Globe, Truck, Shield, TrendingUp, Users, Award, Zap } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Globe,
      title: 'Export Matches',
      description: 'Connect with verified global buyers looking for your products'
    },
    {
      icon: Truck,
      title: 'Logistics',
      description: 'End-to-end logistics support for international shipping'
    },
    {
      icon: Shield,
      title: 'Compliance',
      description: 'Expert guidance on export regulations and documentation'
    },
    {
      icon: TrendingUp,
      title: 'Market Insights',
      description: 'Real-time market data and pricing intelligence'
    }
  ];

  const exportMarkets = [
    { country: 'USA', demand: 'High', products: 'Rice, Spices' },
    { country: 'UAE', demand: 'Very High', products: 'Vegetables, Fruits' },
    { country: 'Germany', demand: 'Medium', products: 'Organic Grains' },
    { country: 'Japan', demand: 'High', products: 'Tea, Pulses' }
  ];

  const stats = [
    { number: '10,000+', label: 'Farmers Connected' },
    { number: '50+', label: 'Countries Reached' },
    { number: '₹500Cr+', label: 'Export Value' },
    { number: '95%', label: 'Success Rate' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-green-100/20 to-transparent dark:from-green-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Take your farm to the{' '}
              <span className="text-green-600 dark:text-green-400">world</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Empowering farmers to connect with global buyers and expand their reach beyond borders
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/register"
                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-200 group"
              >
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 px-8 py-4 font-semibold text-lg transition-colors duration-200"
              >
                Learn More
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to export globally
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools and support you need to succeed in international markets
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Export Markets Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Top Export Markets
            </h2>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Explore high-demand markets for your agricultural products
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {exportMarkets.map((market, index) => (
              <motion.div
                key={market.country}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center hover:bg-white/20 transition-colors duration-300"
              >
                <h3 className="text-2xl font-bold mb-2">{market.country}</h3>
                <div className="mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    market.demand === 'Very High' ? 'bg-red-500/20 text-red-100' :
                    market.demand === 'High' ? 'bg-orange-500/20 text-orange-100' :
                    'bg-yellow-500/20 text-yellow-100'
                  }`}>
                    {market.demand} Demand
                  </span>
                </div>
                <p className="text-green-100">{market.products}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Bridging Farmers with Global Opportunities
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                We believe every farmer deserves access to global markets. Our platform eliminates traditional barriers and provides the technology, expertise, and network needed to succeed internationally.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Expert Support</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">24/7 guidance</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="h-8 w-8 text-green-600 dark:text-green-400" />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Certified Quality</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">International standards</div>
                  </div>
                </div>
              </div>
              <Link
                to="/about"
                className="inline-flex items-center mt-8 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold group"
              >
                Learn More About Us
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-8 text-white"
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <Zap className="h-8 w-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold">Fast</div>
                  <div className="text-sm opacity-90">Quick Setup</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <Shield className="h-8 w-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold">Secure</div>
                  <div className="text-sm opacity-90">Protected Transactions</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <Globe className="h-8 w-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold">Global</div>
                  <div className="text-sm opacity-90">Worldwide Reach</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold">Profitable</div>
                  <div className="text-sm opacity-90">Better Margins</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 dark:bg-gray-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to expand your farm's global reach?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of farmers who are already exporting their products worldwide. Start your journey today.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-200 group"
            >
              Start Exporting Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;