const generateHistoryItems = (count) => {
  const types = ['sale', 'purchase', 'inventory_update', 'user_action'];
  const statuses = ['completed', 'pending', 'failed', 'refunded'];
  const users = ['John Doe', 'Jane Smith', 'Admin', 'System'];
  const products = ['Widget Pro', 'Gadget X', 'Tool Set', 'Component Kit'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `HIST-${1000 + i}`,
    type: types[Math.floor(Math.random() * types.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    user: users[Math.floor(Math.random() * users.length)],
    product: products[Math.floor(Math.random() * products.length)],
    quantity: Math.floor(Math.random() * 10) + 1,
    amount: parseFloat((Math.random() * 1000 + 10).toFixed(2)),
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    details: `Transaction #${1000 + i} details`
  }));
};

export const mockHistoryItems = generateHistoryItems(20);
