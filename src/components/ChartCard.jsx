import React from 'react';
import { motion } from 'framer-motion';

const ChartCard = ({ title, children, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 shadow-lg ${className}`}
    >
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        {title}
      </h3>
      {children}
    </motion.div>
  );
};

export default ChartCard;