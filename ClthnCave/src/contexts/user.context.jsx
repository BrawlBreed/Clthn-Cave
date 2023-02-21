import { createContext, useState, useEffect, useReducer } from 'react';

import {
  onAuthStateChangedListener,
  createUserDocumentFromAuth,
} from '../utils/firebase/firebase.utils';

export const UserContext = createContext({
  setCurrentUser: () => null,
  currentUser: null,
});

export const userActionTypes = {
  SET_CURRENT_USER: 'SET_CURRENT_USER',

}

const INITIAL_STATE = {
  currentUser: null
}

const userReducer = (state, action) => {
  const { type, payload } = action

  switch (type) {
    case userActionTypes.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: payload
      }
    default:
      throw new Error('There is an error with modifying the user!')
  }
}

export const UserProvider = ({ children }) => {
  const [{ currentUser }, dispatch] = useReducer(userReducer, INITIAL_STATE)

  const setCurrentUser = (user) => {
    dispatch({ type: userActionTypes.SET_CURRENT_USER, payload: user })
  }

  const value = { currentUser, setCurrentUser }

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      console.log(user)
      if (user) {
        createUserDocumentFromAuth(user);
      }
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
