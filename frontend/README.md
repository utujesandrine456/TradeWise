# TradeWise Frontend

This is the frontend for the TradeWise application, built with React and Vite.

## Environment Setup

Create a `.env` file in the `frontend` directory with the following variables:

```env
VITE_API_URL=http://localhost:2009/api
VITE_GRAPHQL_URL=http://localhost:2009/graphql
```

## Features
- **Dashboard**: Unified view of business performance.
- **Analytics**: Real-time sales and purchase data visualization using Recharts.
- **Auth**: Secure authentication managed through a consolidated `useAuth` hook.
- **Transactions**: Record sales and purchases with automatic profit/loss calculation.

## Development
```bash
npm install
npm run dev
```

## Notes
- The application uses both REST and GraphQL APIs.
- Authentication state is shared across the application via `AuthProvider`.
- Visual design follows a premium brand theme with custom gradients and glassmorphism.
