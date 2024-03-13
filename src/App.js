import { Routes, Route, useParams } from 'react-router-dom';

import { createContext, useState, useEffect, useReducer, useContext } from 'react';
import { useDispatch } from 'react-redux';

import {
  onAuthStateChangedListener,
  createUserDocumentFromAuth,
} from './utils/firebase/firebase.utils';

import Home from './routes/home/home.component';
import Navigation from './routes/navigation/navigation.component';
import Authentication from './routes/authentication/authentication.component';
import Shop from './routes/shop/shop.component';
import Checkout from './routes/checkout/checkout.component';

import React from 'react'
import AdminPanel from './routes/admin-panel/AdminPanel';
import { UserContext } from './contexts/user.context';

const App = () => {
  const { setCurrentUser } = useContext(UserContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      if (user) {
        createUserDocumentFromAuth(user);
      }
      setCurrentUser(user)
    });

    return unsubscribe;
  }, []);


  return (
    <Routes>
      <Route path='/' element={<Navigation sidebar={true}/>}>
        <Route index element={<Home />} />
        <Route path='shop/*' element={<Shop />} />
        <Route path='checkout' element={<Checkout />} />
      </Route>  
      <Route path='admin-panel/*' element={<AdminPanel/>}/>
      <Route path='/' element={<Navigation sidebar={false}/>}>
        <Route path='auth' element={<Authentication />} /> 
      </Route>      
    </Routes>

  );
};

export default App;
