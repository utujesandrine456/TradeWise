const generateSalesOrders = (count) => {
  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  const customers = [
    'John Smith', 'Sarah Johnson', 'Mike Williams', 'Emily Brown', 'David Lee',
    'Alex Turner', 'Jessica Parker', 'Robert Chen', 'Maria Garcia', 'James Wilson'
  ];
  const products = [
    'Premium Widget', 'Basic Component Kit', 'Power Adapter', 'USB-C Cable', 'Wireless Mouse',
    'Mechanical Keyboard', 'HDMI Cable', 'Laptop Charger', 'Phone Case', 'Screen Protector'
  ];
  
  return Array.from({ length: count }, (_, i) => {
    const orderDate = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const shippingDate = status === 'pending' ? null : 
      new Date(orderDate.getTime() + (Math.floor(Math.random() * 3) + 1) * 24 * 60 * 60 * 1000);
    const deliveryDate = ['delivered', 'cancelled'].includes(status) ? 
      new Date(orderDate.getTime() + (Math.floor(Math.random() * 7) + 3) * 24 * 60 * 60 * 1000) : null;
    
    const itemsCount = Math.floor(Math.random() * 5) + 1;
    const subtotal = parseFloat((Math.random() * 2000 + 100).toFixed(2));
    const tax = parseFloat((subtotal * 0.1).toFixed(2));
    const shipping = parseFloat((Math.random() * 20 + 5).toFixed(2));
    
    return {
      id: `SO-${2000 + i}`,
      customer: customers[Math.floor(Math.random() * customers.length)],
      orderDate: orderDate.toISOString(),
      status,
      shippingDate: shippingDate ? shippingDate.toISOString() : null,
      deliveryDate: deliveryDate ? deliveryDate.toISOString() : null,
      items: Array.from({ length: itemsCount }, () => ({
        id: `ITEM-${Math.floor(10000 + Math.random() * 90000)}`,
        name: products[Math.floor(Math.random() * products.length)],
        quantity: Math.floor(Math.random() * 5) + 1,
        unitPrice: parseFloat((Math.random() * 200 + 10).toFixed(2)),
        status: status === 'delivered' ? 'delivered' : 
                status === 'cancelled' ? 'cancelled' :
                Math.random() > 0.5 ? 'in_stock' : 'backorder'
      })),
      payment: {
        method: ['credit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'][Math.floor(Math.random() * 4)],
        status: status === 'cancelled' ? 'refunded' : 
                ['delivered', 'shipped'].includes(status) ? 'paid' :
                'pending'
      },
      subtotal,
      tax,
      shipping,
      total: parseFloat((subtotal + tax + shipping).toFixed(2)),
      shippingAddress: '123 Main St, Anytown, USA',
      notes: status === 'cancelled' ? 'Customer requested cancellation' : ''
    };
  });
};

export const mockSalesOrders = generateSalesOrders(15);

export const mockCustomers = [
  { id: 1, name: 'John Smith', email: 'john.smith@example.com', phone: '+1 (555) 123-4567', orders: 15, totalSpent: 12500.75 },
  { id: 2, name: 'Sarah Johnson', email: 'sarah.j@example.com', phone: '+1 (555) 234-5678', orders: 8, totalSpent: 8450.25 },
  { id: 3, name: 'Mike Williams', email: 'mike.w@example.com', phone: '+1 (555) 345-6789', orders: 22, totalSpent: 18750.50 },
  { id: 4, name: 'Emily Brown', email: 'emily.b@example.com', phone: '+1 (555) 456-7890', orders: 5, totalSpent: 3250.75 },
  { id: 5, name: 'David Lee', email: 'david.lee@example.com', phone: '+1 (555) 567-8901', orders: 12, totalSpent: 9650.25 }
];
