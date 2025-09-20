import { db } from '../config/firebase';
import { collection, addDoc, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Test function to check if Firebase is working
export const testFirebaseConnection = async () => {
  try {
    console.log('Testing Firebase connection...');
    
    // Test 1: Try to add a test document
    const testDocRef = await addDoc(collection(db, 'test'), {
      message: 'Firebase connection test',
      timestamp: serverTimestamp(),
      test: true
    });
    
    console.log('✅ Test document created with ID:', testDocRef.id);
    
    // Test 2: Try to read the test document
    const testSnapshot = await getDocs(collection(db, 'test'));
    console.log('✅ Found', testSnapshot.size, 'test documents');
    
    // Test 3: Try to create a farmer document
    const farmerId = 'test-farmer-' + Date.now();
    await setDoc(doc(db, 'farmers', farmerId), {
      name: 'Test Farmer',
      email: 'test@example.com',
      mobile: '1234567890',
      exportItem: 'Rice',
      location: 'Test Location',
      createdAt: new Date(),
      savings: 0,
      monthlyEarnings: [],
      test: true
    });
    
    console.log('✅ Test farmer document created with ID:', farmerId);
    
    // Test 4: Try to read farmers collection
    const farmersSnapshot = await getDocs(collection(db, 'farmers'));
    console.log('✅ Found', farmersSnapshot.size, 'farmer documents');
    
    // Test 5: Create sample market insights
    const marketInsightRef = await addDoc(collection(db, 'marketInsights'), {
      crop: 'Basmati Rice',
      demand: 'High',
      price: 65,
      priceUnit: '₹/kg',
      trend: '+12%',
      description: 'Test market insight',
      createdAt: serverTimestamp(),
      test: true
    });
    
    console.log('✅ Test market insight created with ID:', marketInsightRef.id);
    
    // Test 6: Read market insights
    const insightsSnapshot = await getDocs(collection(db, 'marketInsights'));
    console.log('✅ Found', insightsSnapshot.size, 'market insight documents');
    
    return {
      success: true,
      message: 'All Firebase tests passed!',
      testDocId: testDocRef.id,
      farmerId: farmerId,
      marketInsightId: marketInsightRef.id,
      farmersCount: farmersSnapshot.size,
      insightsCount: insightsSnapshot.size
    };
    
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
    return {
      success: false,
      message: error.message,
      error: error
    };
  }
};

// Function to check what data exists in Firebase
export const checkExistingData = async () => {
  try {
    console.log('Checking existing data in Firebase...');
    
    const collections = ['farmers', 'marketInsights', 'exportOrders', 'cropPricing', 'exportRecommendations'];
    const results = {};
    
    for (const collectionName of collections) {
      try {
        const snapshot = await getDocs(collection(db, collectionName));
        results[collectionName] = {
          count: snapshot.size,
          documents: snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
        };
        console.log(`📊 ${collectionName}: ${snapshot.size} documents`);
      } catch (error) {
        results[collectionName] = {
          count: 0,
          error: error.message
        };
        console.log(`❌ ${collectionName}: Error - ${error.message}`);
      }
    }
    
    return results;
    
  } catch (error) {
    console.error('Error checking existing data:', error);
    return { error: error.message };
  }
};
