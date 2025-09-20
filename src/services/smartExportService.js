import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp
} from 'firebase/firestore';

// Smart Export Tools Service
export const smartExportService = {
  // Dynamic pricing suggestions
  getDynamicPricing: async (product, targetCountry) => {
    try {
      // Get market data for the product
      const marketQuery = query(
        collection(db, 'marketInsights'),
        where('crop', '==', product)
      );
      const marketSnapshot = await getDocs(marketQuery);
      
      // Get country import data
      const countryQuery = query(
        collection(db, 'countryImports'),
        where('country', '==', targetCountry)
      );
      const countrySnapshot = await getDocs(countryQuery);
      
      let basePrice = 50; // Default base price
      let demandMultiplier = 1;
      let seasonalMultiplier = 1;
      let stockMultiplier = 1;
      
      if (!marketSnapshot.empty) {
        const marketData = marketSnapshot.docs[0].data();
        basePrice = marketData.price || basePrice;
        
        // Adjust based on demand
        switch (marketData.demand) {
          case 'Very High':
            demandMultiplier = 1.3;
            break;
          case 'High':
            demandMultiplier = 1.15;
            break;
          case 'Medium':
            demandMultiplier = 1.0;
            break;
          case 'Low':
            demandMultiplier = 0.85;
            break;
        }
      }
      
      if (!countrySnapshot.empty) {
        const countryData = countrySnapshot.docs[0].data();
        
        // Adjust based on stock rating
        switch (countryData.stockRating) {
          case 'Very High':
            stockMultiplier = 1.25;
            break;
          case 'High':
            stockMultiplier = 1.1;
            break;
          case 'Medium':
            stockMultiplier = 1.0;
            break;
          case 'Low':
            stockMultiplier = 0.9;
            break;
        }
      }
      
      // Seasonal adjustment (simplified)
      const currentMonth = new Date().getMonth();
      const harvestMonths = [9, 10, 11]; // Oct, Nov, Dec
      if (harvestMonths.includes(currentMonth)) {
        seasonalMultiplier = 0.95; // Lower prices during harvest
      } else if ([3, 4, 5].includes(currentMonth)) {
        seasonalMultiplier = 1.1; // Higher prices before harvest
      }
      
      const suggestedPrice = Math.round(basePrice * demandMultiplier * seasonalMultiplier * stockMultiplier);
      const priceRange = {
        min: Math.round(suggestedPrice * 0.9),
        max: Math.round(suggestedPrice * 1.1),
        suggested: suggestedPrice
      };
      
      return {
        product,
        targetCountry,
        priceRange,
        factors: {
          basePrice,
          demandMultiplier,
          seasonalMultiplier,
          stockMultiplier
        },
        confidence: 'High',
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Error getting dynamic pricing:', error);
      throw error;
    }
  },

  // Export risk alerts
  getExportRiskAlerts: async (targetCountry, product) => {
    try {
      const alerts = [];
      
      // Check country import restrictions
      const countryQuery = query(
        collection(db, 'countryImports'),
        where('country', '==', targetCountry)
      );
      const countrySnapshot = await getDocs(countryQuery);
      
      if (!countrySnapshot.empty) {
        const countryData = countrySnapshot.docs[0].data();
        
        // Stock shortage alert
        if (countryData.stockRating === 'Low') {
          alerts.push({
            type: 'warning',
            title: 'Low Stock Alert',
            message: `${targetCountry} has low stock levels. Consider alternative markets or premium pricing.`,
            severity: 'medium',
            action: 'Consider premium pricing strategy'
          });
        }
        
        // High demand opportunity
        if (countryData.stockRating === 'Very High') {
          alerts.push({
            type: 'opportunity',
            title: 'High Demand Opportunity',
            message: `${targetCountry} shows very high demand for your products.`,
            severity: 'low',
            action: 'Increase export volume'
          });
        }
      }
      
      // Seasonal alerts
      const currentMonth = new Date().getMonth();
      if ([11, 0, 1].includes(currentMonth)) { // Dec, Jan, Feb
        alerts.push({
          type: 'info',
          title: 'Seasonal Peak',
          message: 'Winter season typically shows higher demand for spices and preserved foods.',
          severity: 'low',
          action: 'Optimize inventory levels'
        });
      }
      
      // Currency fluctuation alert (simplified)
      alerts.push({
        type: 'info',
        title: 'Currency Monitor',
        message: 'Monitor USD/INR exchange rates for optimal pricing.',
        severity: 'low',
        action: 'Check daily exchange rates'
      });
      
      return alerts;
    } catch (error) {
      console.error('Error getting export risk alerts:', error);
      throw error;
    }
  },

  // Currency conversion
  convertCurrency: async (amount, fromCurrency, toCurrency) => {
    try {
      // In a real app, you'd use a currency API like exchangerate-api.com
      // For demo purposes, using fixed rates
      const exchangeRates = {
        'INR': { 'USD': 0.012, 'EUR': 0.011, 'GBP': 0.0095 },
        'USD': { 'INR': 83.5, 'EUR': 0.92, 'GBP': 0.79 },
        'EUR': { 'INR': 90.8, 'USD': 1.09, 'GBP': 0.86 }
      };
      
      if (fromCurrency === toCurrency) {
        return { amount, convertedAmount: amount, rate: 1 };
      }
      
      const rate = exchangeRates[fromCurrency]?.[toCurrency] || 1;
      const convertedAmount = Math.round(amount * rate * 100) / 100;
      
      return {
        amount,
        convertedAmount,
        rate,
        fromCurrency,
        toCurrency,
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Error converting currency:', error);
      throw error;
    }
  },

  // Calculate shipping costs
  calculateShippingCost: async (product, quantity, fromCountry, toCountry, shippingMethod) => {
    try {
      // Simplified shipping cost calculation
      const baseCosts = {
        'Sea Freight': { base: 500, perKg: 2 },
        'Air Freight': { base: 1500, perKg: 8 },
        'Express': { base: 2500, perKg: 15 }
      };
      
      const distanceMultipliers = {
        'USA': 1.5,
        'UAE': 1.0,
        'Germany': 1.3,
        'Japan': 1.4,
        'UK': 1.3
      };
      
      const method = baseCosts[shippingMethod] || baseCosts['Sea Freight'];
      const multiplier = distanceMultipliers[toCountry] || 1.0;
      
      const weightInKg = quantity; // Assuming quantity is in kg
      const baseCost = method.base * multiplier;
      const weightCost = method.perKg * weightInKg * multiplier;
      const totalCost = Math.round(baseCost + weightCost);
      
      // Estimated delivery time
      const deliveryTimes = {
        'Sea Freight': '25-35 days',
        'Air Freight': '5-7 days',
        'Express': '2-3 days'
      };
      
      return {
        shippingMethod,
        totalCost,
        baseCost,
        weightCost,
        currency: 'INR',
        estimatedDelivery: deliveryTimes[shippingMethod],
        fromCountry,
        toCountry,
        quantity: weightInKg
      };
    } catch (error) {
      console.error('Error calculating shipping cost:', error);
      throw error;
    }
  },

  // Generate export documentation data
  generateExportDocumentation: async (exportData) => {
    try {
      const {
        farmerId,
        farmerName,
        farmerAddress,
        buyerName,
        buyerAddress,
        product,
        quantity,
        price,
        totalValue,
        currency,
        shippingMethod,
        targetCountry
      } = exportData;
      
      const invoiceNumber = `INV-${Date.now()}`;
      const exportDate = new Date().toISOString().split('T')[0];
      
      const documentation = {
        invoice: {
          invoiceNumber,
          date: exportDate,
          seller: {
            name: farmerName,
            address: farmerAddress,
            country: 'India'
          },
          buyer: {
            name: buyerName,
            address: buyerAddress,
            country: targetCountry
          },
          items: [{
            description: product,
            quantity,
            unitPrice: price,
            totalPrice: totalValue,
            currency
          }],
          totalAmount: totalValue,
          currency,
          paymentTerms: 'As per contract',
          shippingTerms: 'FOB Indian Port'
        },
        packingList: {
          invoiceNumber,
          date: exportDate,
          packages: [{
            packageNumber: 1,
            description: product,
            quantity,
            netWeight: `${quantity} kg`,
            grossWeight: `${Math.round(quantity * 1.1)} kg`,
            dimensions: '50cm x 30cm x 20cm'
          }],
          totalPackages: 1,
          totalNetWeight: `${quantity} kg`,
          totalGrossWeight: `${Math.round(quantity * 1.1)} kg`
        },
        certificateOfOrigin: {
          certificateNumber: `COO-${Date.now()}`,
          date: exportDate,
          exporter: farmerName,
          consignee: buyerName,
          countryOfOrigin: 'India',
          destinationCountry: targetCountry,
          description: product,
          quantity
        }
      };
      
      // Store documentation in Firestore
      const docRef = await addDoc(collection(db, 'exportDocumentation'), {
        ...documentation,
        farmerId,
        status: 'generated',
        createdAt: serverTimestamp()
      });
      
      return {
        documentId: docRef.id,
        ...documentation
      };
    } catch (error) {
      console.error('Error generating export documentation:', error);
      throw error;
    }
  }
};