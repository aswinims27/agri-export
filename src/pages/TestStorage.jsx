import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle, XCircle, Shield, Upload, Loader, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { testFirebaseStorage, checkStoragePermissions, testStorageRules } from '../utils/testStorage';

const TestStorage = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState(null);
  const [permissionResults, setPermissionResults] = useState(null);
  const [rulesResults, setRulesResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runStorageTest = async () => {
    setLoading(true);
    try {
      const results = await testFirebaseStorage();
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

  const checkPermissions = async () => {
    setLoading(true);
    try {
      const results = await checkStoragePermissions();
      setPermissionResults(results);
    } catch (error) {
      setPermissionResults({
        success: false,
        message: error.message,
        error: error
      });
    } finally {
      setLoading(false);
    }
  };

  const testRules = async () => {
    setLoading(true);
    try {
      const results = await testStorageRules();
      setRulesResults(results);
    } catch (error) {
      setRulesResults({
        success: false,
        message: error.message,
        error: error
      });
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults(null);
    setPermissionResults(null);
    setRulesResults(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Please log in to test Firebase Storage functionality.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Firebase Storage Test
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Test Firebase Storage permissions and functionality
          </p>
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-blue-800 dark:text-blue-200">
              <strong>Logged in as:</strong> {user.email} (ID: {user.uid})
            </p>
          </div>
        </motion.div>

        {/* Test Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={checkPermissions}
            disabled={loading}
            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? <Loader className="h-5 w-5 animate-spin" /> : <Shield className="h-5 w-5" />}
            <span>Check Permissions</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={runStorageTest}
            disabled={loading}
            className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? <Loader className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
            <span>Run Full Storage Test</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={testRules}
            disabled={loading}
            className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? <Loader className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5" />}
            <span>Test Storage Rules</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={clearResults}
            className="flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
          >
            <XCircle className="h-5 w-5" />
            <span>Clear Results</span>
          </motion.button>
        </div>

        {/* Permission Check Results */}
        {permissionResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-lg mb-8 ${
              permissionResults.success 
                ? 'bg-green-100 dark:bg-green-900/30 border border-green-400' 
                : 'bg-red-100 dark:bg-red-900/30 border border-red-400'
            }`}
          >
            <div className="flex items-center space-x-3 mb-4">
              {permissionResults.success ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600" />
              )}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Permission Check Results
              </h3>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {permissionResults.message}
            </p>

            {permissionResults.success && (
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p><strong>User ID:</strong> {permissionResults.userId}</p>
                <p><strong>Can Read:</strong> {permissionResults.canRead ? '✅ Yes' : '❌ No'}</p>
                <p><strong>Existing Files:</strong> {permissionResults.existingFiles}</p>
                {permissionResults.files && permissionResults.files.length > 0 && (
                  <div>
                    <p><strong>Files in directory:</strong></p>
                    <ul className="list-disc list-inside ml-4">
                      {permissionResults.files.map((file, index) => (
                        <li key={index}>{file}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Full Storage Test Results */}
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
                Full Storage Test Results
              </h3>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {testResults.message}
            </p>

            {testResults.success && (
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p><strong>Test File Path:</strong> {testResults.testFilePath}</p>
                <p><strong>Download URL:</strong> <a href={testResults.downloadURL} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View File</a></p>
                <p><strong>Files Count:</strong> {testResults.filesCount}</p>
                <p><strong>User ID:</strong> {testResults.userId}</p>
              </div>
            )}

            {testResults.error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-red-700 dark:text-red-300 text-sm">
                  <strong>Error Code:</strong> {testResults.code || 'Unknown'}
                </p>
                <p className="text-red-700 dark:text-red-300 text-sm">
                  <strong>Error Details:</strong> {testResults.error.message}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Storage Rules Test Results */}
        {rulesResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-lg mb-8 ${
              rulesResults.success 
                ? 'bg-green-100 dark:bg-green-900/30 border border-green-400' 
                : 'bg-red-100 dark:bg-red-900/30 border border-red-400'
            }`}
          >
            <div className="flex items-center space-x-3 mb-4">
              {rulesResults.success ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600" />
              )}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Storage Rules Test Results
              </h3>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {rulesResults.message}
            </p>

            {rulesResults.results && (
              <div className="space-y-4">
                <p className="font-medium text-gray-900 dark:text-white">
                  User ID: {rulesResults.results.userId}
                </p>
                <div className="space-y-3">
                  {rulesResults.results.tests.map((test, index) => (
                    <div key={index} className={`p-3 rounded-lg ${
                      test.success 
                        ? 'bg-green-50 dark:bg-green-900/20' 
                        : 'bg-red-50 dark:bg-red-900/20'
                    }`}>
                      <div className="flex items-center space-x-2 mb-1">
                        {test.success ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="font-medium text-gray-900 dark:text-white capitalize">
                          {test.test.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {test.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-4">
            How to Use This Storage Test
          </h3>
          <div className="space-y-2 text-blue-800 dark:text-blue-200">
            <p><strong>1. Check Permissions:</strong> Verifies basic read access to your storage directory.</p>
            <p><strong>2. Run Full Storage Test:</strong> Tests upload, download, and delete operations.</p>
            <p><strong>3. Test Storage Rules:</strong> Validates security rules by testing different access scenarios.</p>
            <p><strong>4. Clear Results:</strong> Removes all test results from the display.</p>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              <strong>Current Storage Rules:</strong> Users can only access files in their own directory 
              (id-proofs/{user.uid}/**). This ensures data privacy and security.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TestStorage;