const generateTransactions = (count, type) => {
  const categories = type === 'credit' ? 
    ['sale', 'refund', 'interest', 'other_income'] :
    ['purchase', 'salary', 'rent', 'utilities', 'supplies', 'taxes', 'other_expense'];
    
  const descriptions = {
    sale: 'Product/Service Sale',
    refund: 'Customer Refund',
    interest: 'Interest Earned',
    other_income: 'Miscellaneous Income',
    purchase: 'Inventory Purchase',
    salary: 'Employee Salaries',
    rent: 'Office Rent',
    utilities: 'Utility Bills',
    supplies: 'Office Supplies',
    taxes: 'Tax Payment',
    other_expense: 'Miscellaneous Expense'
  };
  
  const methods = ['bank_transfer', 'credit_card', 'cash', 'check', 'online_payment'];
  
  return Array.from({ length: count }, (_, i) => {
    const amount = parseFloat((Math.random() * 5000 + 10).toFixed(2));
    const category = categories[Math.floor(Math.random() * categories.length)];
    const date = new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000);
    
    return {
      id: `${type === 'credit' ? 'CR' : 'DB'}-${1000 + i}`,
      date: date.toISOString(),
      description: descriptions[category],
      category,
      amount,
      payment_method: methods[Math.floor(Math.random() * methods.length)],
      status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)],
      reference: `REF-${Math.floor(10000 + Math.random() * 90000)}`,
      notes: Math.random() > 0.7 ? 'Additional notes about this transaction' : ''
    };
  });
};

// Generate mock data
export const mockCredits = generateTransactions(25, 'credit');
export const mockDebits = generateTransactions(25, 'debit');

// Calculate summary
export const creditsSummary = {
  total: mockCredits.reduce((sum, t) => sum + t.amount, 0),
  thisMonth: mockCredits
    .filter(t => new Date(t.date) > new Date(new Date().setDate(1)))
    .reduce((sum, t) => sum + t.amount, 0),
  byCategory: mockCredits.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {})
};

export const debitsSummary = {
  total: mockDebits.reduce((sum, t) => sum + t.amount, 0),
  thisMonth: mockDebits
    .filter(t => new Date(t.date) > new Date(new Date().setDate(1)))
    .reduce((sum, t) => sum + t.amount, 0),
  byCategory: mockDebits.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {})
};
