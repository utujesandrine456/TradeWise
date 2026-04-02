import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './store'
import { CartProvider } from './contexts/CartContext.jsx'
import ToastProvider from './contexts/ToastProvider.jsx'
import { NotificationProvider } from './contexts/NotificationContext.jsx'
import { AuthProvider } from './hooks/useAuth.jsx'
import { ApolloProvider } from '@apollo/client'
import { apolloClient } from './graphql/client.js'

const hideInitialLoader = () => {
  const loader = document.getElementById('initial-loader');
  if (loader) {
    loader.classList.add('fade-out');
    setTimeout(() => {
      loader.style.display = 'none';
    }, 500);
  }
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <Provider store={store}>
        <CartProvider>
          <AuthProvider>
            <ToastProvider>
              <NotificationProvider>
                <App />
              </NotificationProvider>
            </ToastProvider>
          </AuthProvider>
        </CartProvider>
      </Provider>
    </ApolloProvider>
  </React.StrictMode>,
)

setTimeout(hideInitialLoader, 100);
