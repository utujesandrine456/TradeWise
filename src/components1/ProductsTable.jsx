import React from 'react';


const ProductsTable = () => {
    const products = [
    { name: 'Cement', purchasePrice: 9000, quantity: 3, sellingPrice: 9500, totalPrice: 28500, status: 'paid' },
    { name: 'Fer plan', purchasePrice: 12000, quantity: 4, sellingPrice: 17000, totalPrice: 68000, status: 'paid' },
    { name: 'Olive Oil', purchasePrice: 5000, quantity: 3, sellingPrice: 7000, totalPrice: 21000, status: 'credit' },
    { name: 'Biscuits', purchasePrice:8000, quantity: 7, sellingPrice: 10000, totalPrice: 70000, status: 'paid' },
    { name: 'Gucci clothes', purchasePrice: 12000, quantity: 8, sellingPrice: 13000, totalPrice: 104000, status: 'credit' },
    ];

  return (
    <div className="bg-black p-6 rounded-lg shadow-lg text-white ">
      <h3 className="text-xl font-semibold mb-4 text-white">Highly Purchased Products</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                Product name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                Purchase price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                Quantity
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                Selling Price
              </th>
               <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                Total price frw
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {products.map((product, index) => (
              <tr key={index} className="hover:bg-gray-600 transition duration-150 ease-in-out cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {product.purchasePrice}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {product.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {product.sellingPrice}
                </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {product.totalPrice}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.status === 'paid' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                    {product.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsTable; 