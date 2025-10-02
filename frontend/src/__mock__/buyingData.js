const generatePurchaseOrders = (count) => {
  const statuses = ['pending', 'ordered', 'shipped', 'delivered', 'cancelled'];
  const suppliers = ['TechSupplies Inc', 'Global Parts Co', 'ElectroDistro', 'Widget World', 'Gadget Galaxy'];
  const items = [
    'Premium Widgets', 'Basic Components', 'Power Adapters', 'USB Cables', 'Wireless Mice',
    'Mechanical Keyboards', 'HDMI Cables', 'Laptop Chargers', 'Phone Cases', 'Screen Protectors'
  ];
  
  return Array.from({ length: count }, (_, i) => {
    const orderDate = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const estimatedDelivery = new Date(orderDate);
    estimatedDelivery.setDate(orderDate.getDate() + Math.floor(Math.random() * 14) + 3);
    
    return {
      id: `PO-${1000 + i}`,
      supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
      orderDate: orderDate.toISOString(),
      status,
      estimatedDelivery: status === 'delivered' ? null : estimatedDelivery.toISOString(),
      totalAmount: parseFloat((Math.random() * 5000 + 100).toFixed(2)),
      items: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => ({
        id: `ITEM-${Math.floor(10000 + Math.random() * 90000)}`,
        name: items[Math.floor(Math.random() * items.length)],
        quantity: Math.floor(Math.random() * 20) + 1,
        unitPrice: parseFloat((Math.random() * 100 + 5).toFixed(2)),
        received: status === 'delivered' ? Math.floor(Math.random() * 5) + 1 : 0
      })),
      notes: status === 'cancelled' ? 'Order cancelled by supplier' : ''
    };
  });
};

export const mockPurchaseOrders = generatePurchaseOrders(15);

export const mockSuppliers = [
  { id: 1, name: 'TechSupplies Inc', contact: 'John Smith', email: 'john@techsupplies.com', phone: '+1 (555) 123-4567' },
  { id: 2, name: 'Global Parts Co', contact: 'Sarah Johnson', email: 'sarah@globalparts.com', phone: '+1 (555) 234-5678' },
  { id: 3, name: 'ElectroDistro', contact: 'Mike Williams', email: 'mike@electro.com', phone: '+1 (555) 345-6789' },
  { id: 4, name: 'Widget World', contact: 'Emily Brown', email: 'emily@widgetworld.com', phone: '+1 (555) 456-7890' },
  { id: 5, name: 'Gadget Galaxy', contact: 'David Lee', email: 'david@gadgetgalaxy.com', phone: '+1 (555) 567-8901' }
];
