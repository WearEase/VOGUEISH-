export const promoCodes = [
  {
    code: 'WELCOME10',
    description: '10% off your first order',
    discount: 10,
    type: 'percentage' as const,
    minOrderValue: 0,
    expiryDate: '2024-12-31'
  },
  {
    code: 'SAVE20',
    description: '$20 off orders over $100',
    discount: 20,
    type: 'fixed' as const,
    minOrderValue: 100,
    expiryDate: '2024-12-31'
  },
  {
    code: 'FIRSTORDER',
    description: '15% off for new customers',
    discount: 15,
    type: 'percentage' as const,
    minOrderValue: 50,
    expiryDate: '2024-12-31'
  },
  {
    code: 'TRIAL5',
    description: '$5 off home trial service',
    discount: 5,
    type: 'fixed' as const,
    minOrderValue: 0,
    expiryDate: '2024-12-31'
  }
];
