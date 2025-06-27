export const mockOrders = [
  {
    id: 1001,
    items: [
      {
        productId: 1,
        name: "iPhone 15 Pro Max",
        price: 1199.99,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop"
      },
      {
        productId: 3,
        name: "Sony WH-1000XM5 Headphones",
        price: 349.99,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop"
      }
    ],
    shipping: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "(555) 123-4567",
      address: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States"
    },
    payment: {
      cardNumber: "**** **** **** 1234",
      cardName: "John Doe"
    },
    total: 1549.98,
    subtotal: 1549.98,
    shipping_cost: 0,
    tax: 123.99,
    status: "confirmed",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    id: 1002,
    items: [
      {
        productId: 2,
        name: "Nike Air Max 270",
        price: 149.99,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop"
      }
    ],
    shipping: {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      phone: "(555) 987-6543",
      address: "456 Oak Avenue",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
      country: "United States"
    },
    payment: {
      cardNumber: "**** **** **** 5678",
      cardName: "Jane Smith"
    },
    total: 309.98,
    subtotal: 299.98,
    shipping_cost: 9.99,
    tax: 24.00,
    status: "shipped",
    createdAt: "2024-01-14T14:22:00Z",
    updatedAt: "2024-01-16T09:15:00Z"
  }
];