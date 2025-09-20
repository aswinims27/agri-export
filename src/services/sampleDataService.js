import { exportOrdersService } from './dataService';

// Create sample export orders for testing
export const createSampleExportOrders = async (farmerId, farmerData) => {
  try {
    const sampleOrders = [
      {
        buyer: 'Global Foods LLC',
        product: 'Basmati Rice',
        quantity: '10 MT',
        value: 850000,
        status: 'Delivered',
        country: 'USA',
        orderDate: new Date('2024-01-15'),
        deliveryDate: new Date('2024-02-15'),
        paymentStatus: 'Paid',
        qualityGrade: 'Premium',
        packaging: '50kg bags',
        shippingMethod: 'Sea Freight'
      },
      {
        buyer: 'Asian Imports Co.',
        product: 'Turmeric Powder',
        quantity: '5 MT',
        value: 325000,
        status: 'In Transit',
        country: 'UAE',
        orderDate: new Date('2024-02-01'),
        expectedDelivery: new Date('2024-03-15'),
        paymentStatus: 'Partial',
        qualityGrade: 'Standard',
        packaging: '25kg bags',
        shippingMethod: 'Air Freight'
      },
      {
        buyer: 'European Spices',
        product: 'Black Pepper',
        quantity: '2 MT',
        value: 480000,
        status: 'Processing',
        country: 'Germany',
        orderDate: new Date('2024-02-20'),
        expectedDelivery: new Date('2024-04-01'),
        paymentStatus: 'Pending',
        qualityGrade: 'Premium',
        packaging: '10kg bags',
        shippingMethod: 'Sea Freight'
      }
    ];

    // Create sample orders for the farmer
    for (const order of sampleOrders) {
      await exportOrdersService.createExportOrder({
        ...order,
        farmerId: farmerId,
        farmerName: farmerData.name,
        farmerLocation: farmerData.location,
        farmerEmail: farmerData.email
      });
    }

    console.log('Sample export orders created successfully');
  } catch (error) {
    console.error('Error creating sample export orders:', error);
    throw error;
  }
};

// Create sample earnings data
export const createSampleEarningsData = async (farmerId) => {
  try {
    const sampleEarnings = [
      {
        month: 'Jan',
        year: 2024,
        totalEarnings: 25000,
        totalExports: 3,
        exportItems: ['Basmati Rice', 'Wheat'],
        expenses: 5000,
        netProfit: 20000
      },
      {
        month: 'Feb',
        year: 2024,
        totalEarnings: 32000,
        totalExports: 4,
        exportItems: ['Turmeric Powder', 'Rice'],
        expenses: 7000,
        netProfit: 25000
      },
      {
        month: 'Mar',
        year: 2024,
        totalEarnings: 28000,
        totalExports: 3,
        exportItems: ['Spices', 'Pulses'],
        expenses: 6000,
        netProfit: 22000
      },
      {
        month: 'Apr',
        year: 2024,
        totalEarnings: 45000,
        totalExports: 6,
        exportItems: ['Basmati Rice', 'Black Pepper'],
        expenses: 9000,
        netProfit: 36000
      },
      {
        month: 'May',
        year: 2024,
        totalEarnings: 38000,
        totalExports: 5,
        exportItems: ['Organic Rice', 'Turmeric'],
        expenses: 8000,
        netProfit: 30000
      },
      {
        month: 'Jun',
        year: 2024,
        totalEarnings: 52000,
        totalExports: 7,
        exportItems: ['Cardamom', 'Rice', 'Spices'],
        expenses: 12000,
        netProfit: 40000
      }
    ];

    // Add earnings data to farmer's document
    const { earningsService } = await import('./dataService');
    
    for (const earnings of sampleEarnings) {
      await earningsService.addMonthlyEarnings(farmerId, earnings);
    }

    console.log('Sample earnings data created successfully');
  } catch (error) {
    console.error('Error creating sample earnings data:', error);
    throw error;
  }
};
