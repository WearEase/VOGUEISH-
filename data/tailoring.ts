export interface TailoringOption {
  id: string;
  name: string;
  description: string;
  additionalCost: number;
  deliveryTime: string;
  category: string;
}

export interface FabricOption {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  composition: string;
  weight: string;
  care: string[];
}

export const tailoringOptions: TailoringOption[] = [
  {
    id: 'basic-alterations',
    name: 'Basic Alterations',
    description: 'Hem adjustments, sleeve shortening, basic fits',
    additionalCost: 25,
    deliveryTime: '3-5 business days',
    category: 'alterations'
  },
  {
    id: 'custom-measurements',
    name: 'Custom Measurements',
    description: 'Tailored to your exact measurements',
    additionalCost: 75,
    deliveryTime: '7-10 business days',
    category: 'custom'
  },
  {
    id: 'premium-tailoring',
    name: 'Premium Tailoring',
    description: 'Hand-finished details, premium construction',
    additionalCost: 150,
    deliveryTime: '14-21 business days',
    category: 'premium'
  },
  {
    id: 'complete-custom',
    name: 'Complete Custom Design',
    description: 'Fully custom garment from scratch',
    additionalCost: 300,
    deliveryTime: '21-28 business days',
    category: 'custom'
  }
];

export const fabricOptions: FabricOption[] = [
  {
    id: 'premium-cotton',
    name: 'Premium Cotton',
    description: 'Luxurious 100% cotton with smooth finish',
    price: 0,
    image: '/images/fabrics/cotton.jpg',
    composition: '100% Cotton',
    weight: '140 GSM',
    care: ['Machine wash cold', 'Tumble dry low']
  },
  {
    id: 'merino-wool',
    name: 'Merino Wool',
    description: 'Soft, breathable merino wool blend',
    price: 50,
    image: '/images/fabrics/wool.jpg',
    composition: '80% Merino Wool, 20% Silk',
    weight: '200 GSM',
    care: ['Dry clean only', 'Store with moth protection']
  },
  {
    id: 'luxury-silk',
    name: 'Luxury Silk',
    description: 'Pure mulberry silk with lustrous finish',
    price: 100,
    image: '/images/fabrics/silk.jpg',
    composition: '100% Mulberry Silk',
    weight: '120 GSM',
    care: ['Hand wash cold', 'Air dry', 'Iron on low heat']
  },
  {
    id: 'linen-blend',
    name: 'Linen Blend',
    description: 'Breathable linen-cotton blend for comfort',
    price: 25,
    image: '/images/fabrics/linen.jpg',
    composition: '60% Linen, 40% Cotton',
    weight: '160 GSM',
    care: ['Machine wash cold', 'Hang dry', 'Iron while damp']
  }
];