import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

import { Provider } from 'react-redux';
import { store } from './store/store';

import { UserProvider } from './contexts/user.context';
import { CategoriesProvider } from './contexts/categories.context';
import { CartProvider } from './contexts/cart.context';
import { SidebarProvider } from './contexts/sidebar.context';
import { RecoveryProvider } from './contexts/recovery.context';
import { AddProvider } from './contexts/add.context';
import { CheckoutProvider } from './contexts/checkout.context';
import { EditProvider } from './contexts/edit.context';
import { OrdersProvider } from './contexts/orders.context';

import './index.scss';

const rootElement = document.getElementById('root');

render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <CheckoutProvider>
          <OrdersProvider>
            <AddProvider>
              <EditProvider>
                <RecoveryProvider>
                  <CategoriesProvider>
                    <SidebarProvider>
                      <CartProvider>
                        <App />
                      </CartProvider>
                    </SidebarProvider>
                  </CategoriesProvider>
                </RecoveryProvider>
              </EditProvider>
          </AddProvider>
          </OrdersProvider>
        </CheckoutProvider>
      </Provider> 
    </BrowserRouter>
  </React.StrictMode>,
  rootElement
);
