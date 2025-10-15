import { gql } from '@apollo/client';

export const GET_STOCK = gql`
  query GetStock {
    getStock {
      id
      images { id name unit quantity }
      products { id name price quantity }
      transactions { id type description createdAt }
    }
  }
`;

export const STOCK_ANALYSIS = gql`
  query StockAnalysis($start: DateTime, $end: DateTime) {
    stockAnalysis(start: $start, end: $end) {
      totalSales
      totalPurchases
      profit
      products { bought { id name price quantity } sold { id name price quantity } }
      transactions { id type description createdAt }
    }
  }
`;

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($type: ENTransactionType!, $products: [GqlTransactionCreateProductInput!]!, $description: String!, $secondParty: String!, $financialDetails: GqlFinancialCreateInput) {
    createTransaction(type: $type, products: $products, description: $description, secondParty: $secondParty, financialDetails: $financialDetails) {
      id
      type
      description
      createdAt
      products { id name price quantity }
    }
  }
`;

export const CREATE_FINANCIAL = gql`
  mutation CreateFinancial($type: ENFinancialType!, $amount: Float!, $description: String!, $collateral: String, $deadline: DateTime) {
    createFinancial(type: $type, amount: $amount, description: $description, collateral: $collateral, deadline: $deadline) {
      id
      amount
      type
      description
      createdAt
    }
  }
`;

export const DELETE_STOCK_ITEM = gql`
  mutation DeleteStockItem($id: String!) {
    deleteStockItem(id: $id) {
      id
      name
      category
      quantity
      price
    }
  }
`;

export const CREATE_STOCK_ITEM = gql`
  mutation CreateStockItem($name: String!, $category: String!, $quantity: Int!, $price: Float!, $unit: EUnitType!) {
    createStockItem(name: $name, category: $category, quantity: $quantity, price: $price, unit: $unit) {
      id
      name
      category
      quantity
      price
      unit
      createdAt
    }
  }
`;

export const UPDATE_STOCK_ITEM = gql`
  mutation UpdateStockItem($id: String!, $name: String, $category: String, $quantity: Int, $price: Float, $unit: EUnitType) {
    updateStockItem(id: $id, name: $name, category: $category, quantity: $quantity, price: $price, unit: $unit) {
      id
      name
      category
      quantity
      price
      unit
      updatedAt
    }
  }
`;


