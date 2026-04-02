import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
<<<<<<< HEAD
import { Provider } from 'react-redux'
import { store } from './store'
import { CartProvider } from './contexts/CartContext.jsx'
import ToastProvider from './contexts/ToastProvider.jsx'
import { NotificationProvider } from './contexts/NotificationContext.jsx'

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
    <CartProvider>
      <Provider store={store}>
        <ToastProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </ToastProvider>
      </Provider>
    </CartProvider>
  </React.StrictMode>,
)

setTimeout(hideInitialLoader, 100);
=======
import { AuthProvider } from './hooks/useAuth.jsx'
import { ApolloProvider } from '@apollo/client'
import { apolloClient } from './graphql/client.js'
import { CartProvider } from './contexts/CartContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <CartProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </CartProvider>
    </ApolloProvider>
  </React.StrictMode>,
)
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
