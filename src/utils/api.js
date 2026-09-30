// src/utils/api.js

export const getBaseUrl = () => {
  return (
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_DJANGO_BASE_URL ||
    ""
  );
};

export const getApiUrl = (endpoint) => {
  const base = getBaseUrl();
  // Strip trailing slash from base if present and leading slash from endpoint if needed
  const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${cleanBase}${cleanEndpoint}`;
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80";
  }
  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("data:")
  ) {
    return imagePath;
  }
  const base = getBaseUrl();
  const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${cleanBase}${cleanPath}`;
};

export const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Wireless Noise-Canceling Headphones",
    description: "Immerse yourself in crystal clear sound with industry-leading noise cancellation and 30-hour battery life.",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    category: "Electronics",
    rating: 4.8,
    reviewsCount: 128
  },
  {
    id: 2,
    name: "Pro Fitness Smartwatch",
    description: "Track your workouts, heart rate, sleep quality, and daily activity with built-in GPS and vibrant AMOLED screen.",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    category: "Wearables",
    rating: 4.6,
    reviewsCount: 94
  },
  {
    id: 3,
    name: "Ergonomic Mesh Office Chair",
    description: "Designed for ultimate posture support with breathable mesh back, adjustable armrests, and dynamic lumbar support.",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1580481072645-022f9a6d1296?w=800&auto=format&fit=crop&q=80",
    category: "Furniture",
    rating: 4.7,
    reviewsCount: 56
  },
  {
    id: 4,
    name: "RGB Mechanical Gaming Keyboard",
    description: "Tactile mechanical switches, customizable per-key RGB backlighting, and durable aluminum top frame.",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80",
    category: "Accessories",
    rating: 4.9,
    reviewsCount: 210
  },
  {
    id: 5,
    name: "Precision Wireless Gaming Mouse",
    description: "Ultra-fast wireless connectivity with 26K DPI optical sensor and lightweight ergonomic design.",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80",
    category: "Accessories",
    rating: 4.5,
    reviewsCount: 88
  },
  {
    id: 6,
    name: "Urban Leather Laptop Backpack",
    description: "Handcrafted genuine leather backpack with padded laptop sleeve and multiple organization pockets.",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    category: "Fashion",
    rating: 4.7,
    reviewsCount: 73
  }
];
