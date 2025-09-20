import { db, auth } from '../config/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  addDoc, 
  query, 
  orderBy, 
  where, 
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';

// Market Insights Service
export const marketInsightsService = {
  // Add market insight data
  addMarketInsight: async (insightData) => {
    try {
      const docRef = await addDoc(collection(db, 'marketInsights'), {
        ...insightData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding market insight:', error);
      throw error;
    }
  },

  // Get all market insights
  getMarketInsights: async () => {
    try {
      const q = query(collection(db, 'marketInsights'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting market insights:', error);
      throw error;
    }
  },

  // Get market insights by crop
  getMarketInsightsByCrop: async (crop) => {
    try {
      const q = query(
        collection(db, 'marketInsights'), 
        where('crop', '==', crop),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting market insights by crop:', error);
      throw error;
    }
  }
};

// Export Orders Service
export const exportOrdersService = {
  // Create new export order
  createExportOrder: async (orderData) => {
    try {
      const docRef = await addDoc(collection(db, 'exportOrders'), {
        ...orderData,
        farmerId: auth.currentUser.uid,
        status: 'Processing',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating export order:', error);
      throw error;
    }
  },

  // Get all export orders for a farmer
  getFarmerExportOrders: async (farmerId) => {
    try {
      const q = query(
        collection(db, 'exportOrders'),
        where('farmerId', '==', farmerId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting farmer export orders:', error);
      throw error;
    }
  },

  // Update export order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const orderRef = doc(db, 'exportOrders', orderId);
      await updateDoc(orderRef, {
        status: status,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Get all export orders (admin)
  getAllExportOrders: async () => {
    try {
      const q = query(collection(db, 'exportOrders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting all export orders:', error);
      throw error;
    }
  }
};

// Earnings Service
export const earningsService = {
  // Add monthly earnings
  addMonthlyEarnings: async (farmerId, earningsData) => {
    try {
      const farmerRef = doc(db, 'farmers', farmerId);
      await updateDoc(farmerRef, {
        monthlyEarnings: arrayUnion({
          ...earningsData,
          timestamp: serverTimestamp()
        }),
        savings: earningsData.totalEarnings
      });
    } catch (error) {
      console.error('Error adding monthly earnings:', error);
      throw error;
    }
  },

  // Get farmer earnings
  getFarmerEarnings: async (farmerId) => {
    try {
      const farmerDoc = await getDoc(doc(db, 'farmers', farmerId));
      if (farmerDoc.exists()) {
        return farmerDoc.data().monthlyEarnings || [];
      }
      return [];
    } catch (error) {
      console.error('Error getting farmer earnings:', error);
      throw error;
    }
  },

  // Update savings
  updateSavings: async (farmerId, amount) => {
    try {
      const farmerRef = doc(db, 'farmers', farmerId);
      await updateDoc(farmerRef, {
        savings: amount
      });
    } catch (error) {
      console.error('Error updating savings:', error);
      throw error;
    }
  }
};

// Crop Pricing Service
export const cropPricingService = {
  // Add crop pricing data
  addCropPricing: async (pricingData) => {
    try {
      const docRef = await addDoc(collection(db, 'cropPricing'), {
        ...pricingData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding crop pricing:', error);
      throw error;
    }
  },

  // Get current crop prices
  getCurrentCropPrices: async () => {
    try {
      const q = query(collection(db, 'cropPricing'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting current crop prices:', error);
      throw error;
    }
  },

  // Get price by crop
  getPriceByCrop: async (crop) => {
    try {
      const q = query(
        collection(db, 'cropPricing'),
        where('crop', '==', crop),
        orderBy('createdAt', 'desc'),
        where('isActive', '==', true)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data();
      }
      return null;
    } catch (error) {
      console.error('Error getting price by crop:', error);
      throw error;
    }
  }
};

// Export Recommendations Service
export const exportRecommendationsService = {
  // Add export recommendation
  addExportRecommendation: async (recommendationData) => {
    try {
      const docRef = await addDoc(collection(db, 'exportRecommendations'), {
        ...recommendationData,
        createdAt: serverTimestamp(),
        isActive: true
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding export recommendation:', error);
      throw error;
    }
  },

  // Get export recommendations for farmer
  getFarmerRecommendations: async (farmerId) => {
    try {
      const farmerDoc = await getDoc(doc(db, 'farmers', farmerId));
      if (farmerDoc.exists()) {
        const farmerData = farmerDoc.data();
        const exportItem = farmerData.exportItem;
        
        const q = query(
          collection(db, 'exportRecommendations'),
          where('product', '==', exportItem),
          where('isActive', '==', true),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      }
      return [];
    } catch (error) {
      console.error('Error getting farmer recommendations:', error);
      throw error;
    }
  }
};

// Initialize sample data (run once)
export const initializeSampleData = async () => {
  try {
    // Add sample market insights
    const sampleMarketInsights = [
      {
        crop: 'Basmati Rice',
        demand: 'High',
        price: 65,
        priceUnit: '₹/kg',
        trend: '+12%',
        description: 'High demand in Middle East and European markets',
        topMarkets: ['UAE', 'Saudi Arabia', 'Germany', 'USA'],
        seasonality: 'Year-round demand, peak during festival seasons'
      },
      {
        crop: 'Turmeric',
        demand: 'Very High',
        price: 180,
        priceUnit: '₹/kg',
        trend: '+8%',
        description: 'Increasing demand due to health benefits',
        topMarkets: ['UAE', 'USA', 'UK', 'Japan'],
        seasonality: 'Best prices during winter months'
      },
      {
        crop: 'Black Pepper',
        demand: 'Medium',
        price: 450,
        priceUnit: '₹/kg',
        trend: '+15%',
        description: 'Steady demand in European and American markets',
        topMarkets: ['Germany', 'USA', 'France', 'Netherlands'],
        seasonality: 'Peak harvest season offers best prices'
      },
      {
        crop: 'Cardamom',
        demand: 'High',
        price: 1200,
        priceUnit: '₹/kg',
        trend: '+5%',
        description: 'Premium spice with consistent demand',
        topMarkets: ['Saudi Arabia', 'Kuwait', 'USA', 'UK'],
        seasonality: 'Limited supply periods drive higher prices'
      }
    ];

    // Add sample crop pricing
    const sampleCropPricing = [
      {
        crop: 'Basmati Rice',
        currentPrice: 65,
        previousPrice: 58,
        priceUnit: '₹/kg',
        trend: '+12%',
        lastUpdated: serverTimestamp(),
        isActive: true,
        market: 'International'
      },
      {
        crop: 'Turmeric',
        currentPrice: 180,
        previousPrice: 167,
        priceUnit: '₹/kg',
        trend: '+8%',
        lastUpdated: serverTimestamp(),
        isActive: true,
        market: 'International'
      },
      {
        crop: 'Black Pepper',
        currentPrice: 450,
        previousPrice: 391,
        priceUnit: '₹/kg',
        trend: '+15%',
        lastUpdated: serverTimestamp(),
        isActive: true,
        market: 'International'
      },
      {
        crop: 'Cardamom',
        currentPrice: 1200,
        previousPrice: 1143,
        priceUnit: '₹/kg',
        trend: '+5%',
        lastUpdated: serverTimestamp(),
        isActive: true,
        market: 'International'
      }
    ];

    // Add sample export recommendations
    const sampleExportRecommendations = [
      {
        buyer: 'Middle East Trading Co.',
        product: 'Organic Rice',
        match: '95%',
        location: 'Dubai, UAE',
        contactEmail: 'trading@middleeastco.com',
        requirements: 'Organic certification required, minimum 10MT order',
        priceRange: '₹70-75/kg',
        estimatedDelivery: '30-45 days'
      },
      {
        buyer: 'European Organics',
        product: 'Turmeric Powder',
        match: '88%',
        location: 'Hamburg, Germany',
        contactEmail: 'imports@europeanorganics.de',
        requirements: 'ISO certification, lab testing reports',
        priceRange: '₹190-200/kg',
        estimatedDelivery: '45-60 days'
      },
      {
        buyer: 'Global Spices Inc.',
        product: 'Black Pepper',
        match: '92%',
        location: 'New York, USA',
        contactEmail: 'purchasing@globalspices.com',
        requirements: 'ASTA quality standards, moisture content <12%',
        priceRange: '₹460-480/kg',
        estimatedDelivery: '35-50 days'
      }
    ];

    // Add sample data to collections
    for (const insight of sampleMarketInsights) {
      await marketInsightsService.addMarketInsight(insight);
    }

    for (const pricing of sampleCropPricing) {
      await cropPricingService.addCropPricing(pricing);
    }

    for (const recommendation of sampleExportRecommendations) {
      await exportRecommendationsService.addExportRecommendation(recommendation);
    }

    console.log('Sample data initialized successfully');
  } catch (error) {
    console.error('Error initializing sample data:', error);
    throw error;
  }
};
