import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_STOCK } from '../graphql/queries';


const ProductsTable = () => {
  const { data } = useQuery(GET_STOCK);
  const products = (data?.getStock?.products || []).map(p => ({
    name: p.name,
    purchasePrice: p.price,
    quantity: p.quantity,
    sellingPrice: p.price,
    totalPrice: p.price * p.quantity,
    status: 'paid'
  }));

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