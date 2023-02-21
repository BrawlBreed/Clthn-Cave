import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { UserProvider } from './contexts/user.context';
import { CategoriesProvider } from './contexts/categories.context';
import { CartProvider } from './contexts/cart.context';
import { SidebarProvider } from './contexts/sidebar.context';
import { RecoveryProvider } from './contexts/recovery.context';

import './index.scss';

const rootElement = document.getElementById('root');

render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <RecoveryProvider>
          <CategoriesProvider>
            <SidebarProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </SidebarProvider>
          </CategoriesProvider>
        </RecoveryProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>,
  rootElement
);
