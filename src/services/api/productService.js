import { mockProducts } from '@/services/mockData/products';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const productService = {
  async getAll() {
    await delay(300);
    return [...mockProducts];
  },

  async getById(id) {
    await delay(200);
    const product = mockProducts.find(p => p.id === id);
    if (!product) {
      throw new Error('Product not found');
    }
    return { ...product };
  },

  async getByCategory(category) {
    await delay(250);
    const categoryFilter = category.toLowerCase();
    return mockProducts.filter(product => 
      product.category.toLowerCase().includes(categoryFilter)
    );
  },

  async search(query) {
    await delay(300);
    const searchTerms = query.toLowerCase().split(' ');
    return mockProducts.filter(product => {
      const searchableText = `${product.name} ${product.description} ${product.category}`.toLowerCase();
      return searchTerms.some(term => searchableText.includes(term));
    });
  },

  async create(productData) {
    await delay(400);
    const newId = Math.max(...mockProducts.map(p => p.id)) + 1;
    const newProduct = {
      id: newId,
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockProducts.push(newProduct);
    return { ...newProduct };
  },

  async update(id, updateData) {
    await delay(350);
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Product not found');
    }
    
    mockProducts[index] = {
      ...mockProducts[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...mockProducts[index] };
  },

  async delete(id) {
    await delay(300);
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Product not found');
    }
    
const deletedProduct = mockProducts.splice(index, 1)[0];
    return { ...deletedProduct };
  },

  async getRecommendations(limit = 8) {
    await delay(350);
    
    // Simulate user browsing history and preferences
    const userPreferences = {
      categories: ['Electronics', 'Sports & Outdoors', 'Clothing & Fashion'],
      brands: ['Apple', 'Nike', 'Sony'],
      priceRange: { min: 50, max: 1000 }
    };
    
    // Filter products based on simulated preferences
    let candidateProducts = mockProducts.filter(product => {
      const inPriceRange = product.price >= userPreferences.priceRange.min && 
                          product.price <= userPreferences.priceRange.max;
      const isPreferredCategory = userPreferences.categories.includes(product.category);
      const isPreferredBrand = userPreferences.brands.includes(product.brand);
      const hasGoodRating = product.rating >= 4.0;
      
      // Weight the selection: preferred items more likely to be selected
      return inPriceRange && (isPreferredCategory || isPreferredBrand || hasGoodRating);
    });
    
    // If not enough candidates, include more products
    if (candidateProducts.length < limit) {
      const additionalProducts = mockProducts.filter(product => 
        !candidateProducts.find(p => p.id === product.id) && product.rating >= 4.0
      );
      candidateProducts = [...candidateProducts, ...additionalProducts];
    }
    
    // Sort by rating and randomize a bit for variety
    candidateProducts.sort((a, b) => {
      const ratingDiff = b.rating - a.rating;
      const randomFactor = (Math.random() - 0.5) * 0.3; // Small random factor
      return ratingDiff + randomFactor;
    });
    
    // Return requested number of recommendations
    return candidateProducts.slice(0, limit).map(product => ({ ...product }));
  }
};