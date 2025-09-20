import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle, XCircle, Database, Loader } from 'lucide-react';
import { testFirebaseConnection, checkExistingData } from '../utils/testFirebase';
import { initializeSampleData } from '../services/dataService';
import { initializeMarketingData } from '../services/marketingService';
import { initializeExportGuide } from '../services/exportGuideService';

const TestFirebase = () => {
  const [testResults, setTestResults] = useState(null);
  const [existingData, setExistingData] = useState(null);
  const [loading, setLoading] = useState(false);

  const runFirebaseTest = async () => {
    setLoading(true);
    try {
      const results = await testFirebaseConnection();
      setTestResults(results);
    } catch (error) {
      setTestResults({
        success: false,
        message: error.message,
        error: error
      });
    } finally {
      setLoading(false);
    }
  };

  const checkData = async () => {
    setLoading(true);
    try {
      const data = await checkExistingData();
      setExistingData(data);
    } catch (error) {
      console.error('Error checking data:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeAllData = async () => {
    setLoading(true);
    try {
      await initializeSampleData();
      await initializeMarketingData();
      await initializeExportGuide();
      
      // Refresh data check
      const data = await checkExistingData();
      setExistingData(data);
      
      setTestResults({
        success: true,
        message: 'All sample data initialized successfully!'
      });
    } catch (error) {
      setTestResults({
        success: false,
        message: error.message,
        error: error
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Firebase Connection Test
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Test your Firebase configuration and initialize sample data
          </p>
        </motion.div>

        {/* Test Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={runFirebaseTest}
            disabled={loading}
            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? <Loader className="h-5 w-5 animate-spin" /> : <Play className="h-5 w-5" />}
            <span>Test Connection</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={checkData}
            disabled={loading}
            className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? <Loader className="h-5 w-5 animate-spin" /> : <Database className="h-5 w-5" />}
            <span>Check Data</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={initializeAllData}
            disabled={loading}
            className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? <Loader className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5" />}
            <span>Initialize Data</span>
          </motion.button>
        </div>

        {/* Test Results */}
        {testResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-lg mb-8 ${
              testResults.success 
                ? 'bg-green-100 dark:bg-green-900/30 border border-green-400' 
                : 'bg-red-100 dark:bg-red-900/30 border border-red-400'
            }`}
          >
            <div className="flex items-center space-x-3 mb-4">
              {testResults.success ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600" />
              )}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Test Results
              </h3>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {testResults.message}
            </p>

            {testResults.success && testResults.testDocId && (
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p><strong>Test Document ID:</strong> {testResults.testDocId}</p>
                <p><strong>Farmer ID:</strong> {testResults.farmerId}</p>
                <p><strong>Market Insight ID:</strong> {testResults.marketInsightId}</p>
                <p><strong>Farmers Count:</strong> {testResults.farmersCount}</p>
                <p><strong>Insights Count:</strong> {testResults.insightsCount}</p>
              </div>
            )}

            {testResults.error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-red-700 dark:text-red-300 text-sm">
                  <strong>Error Details:</strong> {testResults.error.message}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Existing Data */}
        {existingData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Existing Data in Firebase
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(existingData).map(([collection, data]) => (
                <div key={collection} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 capitalize">
                    {collection.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {data.error ? (
                      <p className="text-red-500">Error: {data.error}</p>
                    ) : (
                      <>
                        <p><strong>Documents:</strong> {data.count}</p>
                        {data.documents && data.documents.length > 0 && (
                          <div className="mt-2">
                            <p className="font-medium">Sample entries:</p>
                            <ul className="list-disc list-inside text-xs mt-1">
                              {data.documents.slice(0, 3).map((doc, index) => (
                                <li key={index}>
                                  {doc.name || doc.title || doc.crop || doc.country || doc.id}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mt-8"
        >
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-4">
            How to Use This Test Page
          </h3>
          <div className="space-y-2 text-blue-800 dark:text-blue-200">
            <p><strong>1. Test Connection:</strong> Verifies that Firebase is properly configured and accessible.</p>
            <p><strong>2. Check Data:</strong> Shows what data currently exists in your Firebase collections.</p>
            <p><strong>3. Initialize Data:</strong> Creates sample data for testing the application features.</p>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              <strong>Note:</strong> Make sure you're logged in before running these tests. 
              Some operations require authentication.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TestFirebase;