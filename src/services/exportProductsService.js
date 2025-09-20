import { db, auth } from '../config/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  addDoc, 
  query, 
  orderBy, 
  where, 
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';

// Export Products Service
export const exportProductsService = {
  // Add new export product
  addProduct: async (productData) => {
    try {
      const docRef = await addDoc(collection(db, 'exportProducts'), {
        ...productData,
        farmerId: auth.currentUser.uid,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding export product:', error);
      throw error;
    }
  },

  // Get farmer's products
  getFarmerProducts: async (farmerId) => {
    try {
      const q = query(
        collection(db, 'exportProducts'),
        where('farmerId', '==', farmerId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting farmer products:', error);
      throw error;
    }
  },

  // Get all products with filters
  getAllProducts: async (filters = {}) => {
    try {
      let q = collection(db, 'exportProducts');
      
      if (filters.category) {
        q = query(q, where('category', '==', filters.category));
      }
      if (filters.targetCountry) {
        q = query(q, where('targetCountries', 'array-contains', filters.targetCountry));
      }
      
      q = query(q, where('status', '==', 'active'), orderBy('createdAt', 'desc'));
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting all products:', error);
      throw error;
    }
  },

  // Update product
  updateProduct: async (productId, updateData) => {
    try {
      const productRef = doc(db, 'exportProducts', productId);
      await updateDoc(productRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (productId) => {
    try {
      await deleteDoc(doc(db, 'exportProducts', productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Listen to products changes
  listenToProducts: (callback, filters = {}) => {
    try {
      let q = collection(db, 'exportProducts');
      
      if (filters.farmerId) {
        q = query(q, where('farmerId', '==', filters.farmerId));
      }
      if (filters.category) {
        q = query(q, where('category', '==', filters.category));
      }
      
      q = query(q, where('status', '==', 'active'), orderBy('createdAt', 'desc'));
      
      return onSnapshot(q, (snapshot) => {
        const products = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(products);
      });
    } catch (error) {
      console.error('Error listening to products:', error);
      throw error;
    }
  }
};