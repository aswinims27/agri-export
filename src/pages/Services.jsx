import React from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, Truck, Shield, TrendingUp, Users, CreditCard, 
  FileText, BookOpen, MessageCircle, Award, Zap, Heart
} from 'lucide-react';

const Services = () => {
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