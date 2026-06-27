import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './tailwind.css';
import App from './App';
import { ProductsProvider } from './context/products_context';
import { FilterProvider } from './context/filter_context';
import { CartProvider } from './context/cart_context';
import { UserProvider } from './context/user_context';
import { OrderProvider } from './context/order_context';
import { SettingsProvider } from './context/settings_context';
import ErrorBoundary from './components/ErrorBoundary';

ReactDOM.render(
  <ErrorBoundary>
    <SettingsProvider>
      <UserProvider>
        <ProductsProvider>
          <FilterProvider>
            <CartProvider>
              <OrderProvider>
                <App />
              </OrderProvider>
            </CartProvider>
          </FilterProvider>
        </ProductsProvider>
      </UserProvider>
    </SettingsProvider>
  </ErrorBoundary>,
  document.getElementById('root')
);
