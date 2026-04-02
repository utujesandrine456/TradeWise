import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
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
