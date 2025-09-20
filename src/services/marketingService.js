import { db } from '../config/firebase';
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
  onSnapshot
} from 'firebase/firestore';

// Marketing Dashboard Service
export const marketingService = {
  // Add country import data
  addCountryImportData: async (countryData) => {
    try {
      const docRef = await addDoc(collection(db, 'countryImports'), {
        ...countryData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding country import data:', error);
      throw error;
    }
  },

  // Get all country import data
  getCountryImports: async () => {
    try {
      const q = query(collection(db, 'countryImports'), orderBy('country'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting country imports:', error);
      throw error;
    }
  },

  // Get import data by country
  getImportsByCountry: async (country) => {
    try {
      const q = query(
        collection(db, 'countryImports'),
        where('country', '==', country)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting imports by country:', error);
      throw error;
    }
  },

  // Update stock rating
  updateStockRating: async (countryId, stockRating) => {
    try {
      const countryRef = doc(db, 'countryImports', countryId);
      await updateDoc(countryRef, {
        stockRating: stockRating,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating stock rating:', error);
      throw error;
    }
  },

  // Listen to country imports changes (real-time updates)
  listenToCountryImports: (callback) => {
    try {
      const q = query(collection(db, 'countryImports'), orderBy('country'));
      
      return onSnapshot(q, (snapshot) => {
        const countries = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(countries);
      });
    } catch (error) {
      console.error('Error listening to country imports:', error);
      throw error;
    }
  },

  // Get product demand by country
  getProductDemandByCountry: async () => {
    try {
      const q = query(collection(db, 'productDemand'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting product demand:', error);
      throw error;
    }
  },

  // Add product demand data
  addProductDemand: async (demandData) => {
    try {
      const docRef = await addDoc(collection(db, 'productDemand'), {
        ...demandData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding product demand:', error);
      throw error;
    }
  },

  // Listen to product demand changes
  listenToProductDemand: (callback) => {
    try {
      const q = query(collection(db, 'productDemand'), orderBy('createdAt', 'desc'));
      
      return onSnapshot(q, (snapshot) => {
        const demands = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(demands);
      });
    } catch (error) {
      console.error('Error listening to product demand:', error);
      throw error;
    }
  }
};

// Initialize sample marketing data
export const initializeMarketingData = async () => {
  try {
    const sampleCountryImports = [
      {
        country: 'USA',
        imports: ['Rice', 'Spices', 'Tea', 'Organic Grains'],
        stockRating: 'High',
        totalImportValue: 2500000000,
        growthRate: 8.5,
        topProducts: [
          { product: 'Basmati Rice', value: 850000000, percentage: 34 },
          { product: 'Turmeric', value: 425000000, percentage: 17 },
          { product: 'Black Pepper', value: 325000000, percentage: 13 }
        ]
      },
      {
        country: 'UAE',
        imports: ['Vegetables', 'Fruits', 'Rice', 'Pulses'],
        stockRating: 'Very High',
        totalImportValue: 1800000000,
        growthRate: 12.3,
        topProducts: [
          { product: 'Fresh Vegetables', value: 540000000, percentage: 30 },
          { product: 'Basmati Rice', value: 360000000, percentage: 20 },
          { product: 'Fruits', value: 270000000, percentage: 15 }
        ]
      },
      {
        country: 'Germany',
        imports: ['Organic Grains', 'Spices', 'Tea'],
        stockRating: 'Medium',
        totalImportValue: 1200000000,
        growthRate: 6.2,
        topProducts: [
          { product: 'Organic Wheat', value: 360000000, percentage: 30 },
          { product: 'Cardamom', value: 240000000, percentage: 20 },
          { product: 'Green Tea', value: 180000000, percentage: 15 }
        ]
      },
      {
        country: 'Japan',
        imports: ['Tea', 'Pulses', 'Organic Products'],
        stockRating: 'High',
        totalImportValue: 950000000,
        growthRate: 4.8,
        topProducts: [
          { product: 'Green Tea', value: 285000000, percentage: 30 },
          { product: 'Organic Pulses', value: 190000000, percentage: 20 },
          { product: 'Sesame Seeds', value: 142500000, percentage: 15 }
        ]
      }
    ];

    const sampleProductDemand = [
      {
        product: 'Basmati Rice',
        countries: ['USA', 'UAE', 'Saudi Arabia', 'UK'],
        globalDemand: 'Very High',
        seasonalTrend: 'Peak during festivals',
        priceRange: { min: 60, max: 80, currency: 'INR/kg' },
        qualityRequirements: ['Aged rice', 'Long grain', 'Aromatic']
      },
      {
        product: 'Turmeric Powder',
        countries: ['USA', 'Germany', 'UK', 'Canada'],
        globalDemand: 'High',
        seasonalTrend: 'Consistent year-round',
        priceRange: { min: 180, max: 220, currency: 'INR/kg' },
        qualityRequirements: ['Curcumin content >3%', 'Organic certified', 'Powder form']
      },
      {
        product: 'Black Pepper',
        countries: ['USA', 'Germany', 'Netherlands', 'France'],
        globalDemand: 'High',
        seasonalTrend: 'Higher demand in winter',
        priceRange: { min: 450, max: 550, currency: 'INR/kg' },
        qualityRequirements: ['Moisture <12%', 'Bold size', 'Clean sorted']
      }
    ];

    // Add sample data
    for (const countryData of sampleCountryImports) {
      await marketingService.addCountryImportData(countryData);
    }

    for (const demandData of sampleProductDemand) {
      await marketingService.addProductDemand(demandData);
    }

    console.log('Marketing sample data initialized successfully');
  } catch (error) {
    console.error('Error initializing marketing data:', error);
    throw error;
  }
};