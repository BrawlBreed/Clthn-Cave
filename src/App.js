import { Routes, Route, useParams } from 'react-router-dom';

import { createContext, useState, useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';

import {
  onAuthStateChangedListener,
  createUserDocumentFromAuth,
} from './utils/firebase/firebase.utils';
import { setCurrentUser } from './store/user/user.action';

import Home from './routes/home/home.component';
import Navigation from './routes/navigation/navigation.component';
import Authentication from './routes/authentication/authentication.component';
import Shop from './routes/shop/shop.component';
import Checkout from './routes/checkout/checkout.component';
import AddNew from './routes/admin-panel/AddNew';
import {CategoriesManager} from './routes/admin-panel/CategoriesManager';
import { Footer } from './components/footer/footer.component';

import React from 'react'
import AdminPanel from './routes/admin-panel/AdminPanel';

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      console.log(user)
      if (user) {
        createUserDocumentFromAuth(user);
      }
      dispatch(setCurrentUser(user));
    });

    return unsubscribe;
  }, [dispatch]);


  return (
    <Routes>
      <Route path='/' element={<Navigation sidebar={true}/>}>
        <Route index element={<Home />} />
        <Route path='shop/*' element={<Shop />} />
        <Route path='checkout' element={<Checkout />} />
      </Route>  
      <Route path='admin-panel/*' element={<AdminPanel/>}/>
      {/* <Route path='/' element={<Navigation sidebar={false}/>}>
        <Route path='auth' element={<Authentication />} /> 
      </Route>       */}
    </Routes>

  );
};

export default App;
