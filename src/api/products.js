const products = [
  {
    id: 1,
    name: 'Maison Noir Jacket',
    category: 'Outerwear',
    price: 249,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5',
    description: 'Premium contemporary jacket.',
  },
  {
    id: 2,
    name: 'Classic Black Coat',
    category: 'Outerwear',
    price: 299,
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3',
    description: 'Minimal black coat for modern wardrobes.',
  },
  {
    id: 3,
    name: 'Maison White Shirt',
    category: 'Shirts',
    price: 129,
    image: 'https://images.unsplash.com/photo-1603252110481-7ba873bf42ab',
    description: 'Clean and elegant white shirt.',
  },
  {
    id: 4,
    name: 'Premium Trousers',
    category: 'Trousers',
    price: 159,
    image: 'https://images.unsplash.com/photo-1506629905607-d9b1a8f4c6a3',
    description: 'Tailored trousers with premium finish.',
  },
  {
    id: 5,
    name: 'Leather Handbag',
    category: 'Accessories',
    price: 189,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
    description: 'Premium leather handbag.',
  },
  {
    id: 6,
    name: 'Minimal Sunglasses',
    category: 'Accessories',
    price: 99,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083',
    description: 'Modern minimal sunglasses.',
  },
]

export async function getProducts() {
  await new Promise((resolve) => setTimeout(resolve, 300))

  return products
}

export async function getProduct(id) {
  await new Promise((resolve) => setTimeout(resolve, 200))

  return products.find((product) => product.id === Number(id))
}

export async function getProductsByCategory(category) {
  await new Promise((resolve) => setTimeout(resolve, 200))

  return products.filter(
    (product) => product.category === category
  )
}