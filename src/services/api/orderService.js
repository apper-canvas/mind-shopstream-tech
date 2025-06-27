import { mockOrders } from '@/services/mockData/orders';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const orderService = {
  async getAll() {
    await delay(300);
    return [...mockOrders];
  },

  async getById(id) {
    await delay(200);
    const order = mockOrders.find(o => o.id === id);
    if (!order) {
      throw new Error('Order not found');
    }
    return { ...order };
  },

  async create(orderData) {
    await delay(500);
    const newId = Math.max(...mockOrders.map(o => o.id)) + 1;
    const newOrder = {
      id: newId,
      ...orderData,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockOrders.push(newOrder);
    return { ...newOrder };
  },

  async update(id, updateData) {
    await delay(350);
    const index = mockOrders.findIndex(o => o.id === id);
    if (index === -1) {
      throw new Error('Order not found');
    }
    
    mockOrders[index] = {
      ...mockOrders[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...mockOrders[index] };
  },

  async delete(id) {
    await delay(300);
    const index = mockOrders.findIndex(o => o.id === id);
    if (index === -1) {
      throw new Error('Order not found');
    }
    
    const deletedOrder = mockOrders.splice(index, 1)[0];
    return { ...deletedOrder };
  }
};