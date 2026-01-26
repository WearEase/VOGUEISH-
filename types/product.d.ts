export interface Product {
    slug: string;
    name: string;
    brand: string;
    realPrice: number | string;
    discountedPrice: number | string;
    mainImage: string;
    extraImage1?: string;
    extraImage2?: string;
    extraImage3?: string;
    extraImage4?: string;
    sizesAvailable: string[];
    description: string;
  }
  
  export type TabType = 'description' | 'details' | 'returns';
  