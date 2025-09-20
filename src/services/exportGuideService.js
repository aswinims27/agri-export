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
  serverTimestamp
} from 'firebase/firestore';

// Export Guide Service
export const exportGuideService = {
  // Add guide step
  addGuideStep: async (stepData) => {
    try {
      const docRef = await addDoc(collection(db, 'exportGuide'), {
        ...stepData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding guide step:', error);
      throw error;
    }
  },

  // Get all guide steps
  getGuideSteps: async () => {
    try {
      const q = query(collection(db, 'exportGuide'), orderBy('stepNumber'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting guide steps:', error);
      throw error;
    }
  },

  // Get guide step by category
  getGuideByCategory: async (category) => {
    try {
      const q = query(
        collection(db, 'exportGuide'),
        where('category', '==', category),
        orderBy('stepNumber')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting guide by category:', error);
      throw error;
    }
  },

  // Update guide step
  updateGuideStep: async (stepId, updateData) => {
    try {
      const stepRef = doc(db, 'exportGuide', stepId);
      await updateDoc(stepRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating guide step:', error);
      throw error;
    }
  }
};

// Initialize export guide data
export const initializeExportGuide = async () => {
  try {
    const guideSteps = [
      {
        stepNumber: 1,
        category: 'Documentation',
        title: 'Business Registration',
        description: 'Register your business and obtain necessary licenses',
        content: `
          <h3>Required Documents:</h3>
          <ul>
            <li>Business Registration Certificate</li>
            <li>PAN Card</li>
            <li>GST Registration</li>
            <li>Import Export Code (IEC)</li>
            <li>Bank Account Details</li>
          </ul>
          <h3>Process:</h3>
          <ol>
            <li>Apply for IEC from DGFT website</li>
            <li>Complete GST registration</li>
            <li>Open current account for export transactions</li>
            <li>Get digital signature certificate</li>
          </ol>
        `,
        estimatedTime: '7-10 days',
        cost: '₹5,000 - ₹15,000',
        difficulty: 'Medium'
      },
      {
        stepNumber: 2,
        category: 'Documentation',
        title: 'Product Certification',
        description: 'Obtain quality certifications for your products',
        content: `
          <h3>Common Certifications:</h3>
          <ul>
            <li>FSSAI License for food products</li>
            <li>Organic Certification</li>
            <li>ISO 22000 (Food Safety)</li>
            <li>HACCP Certification</li>
            <li>Phytosanitary Certificate</li>
          </ul>
          <h3>Benefits:</h3>
          <ul>
            <li>Higher product prices</li>
            <li>Access to premium markets</li>
            <li>Buyer confidence</li>
            <li>Compliance with international standards</li>
          </ul>
        `,
        estimatedTime: '15-30 days',
        cost: '₹10,000 - ₹50,000',
        difficulty: 'High'
      },
      {
        stepNumber: 3,
        category: 'Packaging',
        title: 'Export Packaging Standards',
        description: 'Learn about international packaging requirements',
        content: `
          <h3>Packaging Requirements:</h3>
          <ul>
            <li>Food-grade materials only</li>
            <li>Proper labeling in English</li>
            <li>Nutritional information</li>
            <li>Country of origin marking</li>
            <li>Batch number and expiry date</li>
          </ul>
          <h3>Packaging Types:</h3>
          <ul>
            <li>Primary: Direct contact with product</li>
            <li>Secondary: Retail packaging</li>
            <li>Tertiary: Transport packaging</li>
          </ul>
        `,
        estimatedTime: '3-5 days',
        cost: '₹2,000 - ₹10,000',
        difficulty: 'Low'
      },
      {
        stepNumber: 4,
        category: 'Customs',
        title: 'Customs Clearance Process',
        description: 'Understand export customs procedures',
        content: `
          <h3>Required Documents:</h3>
          <ul>
            <li>Commercial Invoice</li>
            <li>Packing List</li>
            <li>Bill of Lading/Airway Bill</li>
            <li>Certificate of Origin</li>
            <li>Export License (if required)</li>
          </ul>
          <h3>Process Steps:</h3>
          <ol>
            <li>File Shipping Bill online</li>
            <li>Submit documents to customs</li>
            <li>Physical examination (if required)</li>
            <li>Duty payment and clearance</li>
            <li>Let Export Order (LEO)</li>
          </ol>
        `,
        estimatedTime: '1-3 days',
        cost: '₹1,000 - ₹5,000',
        difficulty: 'Medium'
      },
      {
        stepNumber: 5,
        category: 'Payment',
        title: 'International Payment Methods',
        description: 'Choose the right payment method for your exports',
        content: `
          <h3>Payment Methods:</h3>
          <ul>
            <li><strong>Letter of Credit (LC):</strong> Most secure for new exporters</li>
            <li><strong>Advance Payment:</strong> Best cash flow, higher risk</li>
            <li><strong>Documents Against Payment (D/P):</strong> Moderate risk</li>
            <li><strong>Documents Against Acceptance (D/A):</strong> Credit terms</li>
          </ul>
          <h3>Recommendations:</h3>
          <ul>
            <li>Start with LC for new buyers</li>
            <li>Use advance payment for trusted buyers</li>
            <li>Consider export credit insurance</li>
          </ul>
        `,
        estimatedTime: '1-2 days',
        cost: '₹500 - ₹2,000',
        difficulty: 'Medium'
      }
    ];

    for (const step of guideSteps) {
      await exportGuideService.addGuideStep(step);
    }

    console.log('Export guide data initialized successfully');
  } catch (error) {
    console.error('Error initializing export guide:', error);
    throw error;
  }
};