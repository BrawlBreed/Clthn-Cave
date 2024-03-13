import React, { createContext, useEffect, useReducer } from "react";

// const fetchAddressSuggestions = async (address) => {
//     const endpoint = `https://nominatim.openstreetmap.org/search?q=${address}&format=json&limit=10`;
//     const response = await fetch(endpoint);
//     const data = await response.json();
//     return data.map((result) => result.display_name);
// }


export const CheckoutContext = createContext({
    state: {
        stage: 0,
        email: '',
        name: '',
        phone: '',
        address: '',
        city: '',
        postcode: '',
        suggestions: '',
        pmethod: ''
    },
    setStage: () => { },
    setCountry: () => { },
    handleAddressChange: () => { },
    handleChange: () => { },
    setPhone: () => { },
    setPaymentMethod: () => { }
})

const INITIAL_STATE = {
    stage: 1,
    name: '',
    email: '',
    phone: '',
    country: '359 ',
    address: '',
    city: '',
    postcode: '',
    pmethod: ''
    // suggestions: '',
}

const types = {
    setStage: 'setStage',
    address: 'address',
    city: 'city',
    postcode: 'postcode',
    name: 'name',
    email: 'email',
    phone: 'phone',
    country: 'country',
    pmethod: 'pmethod'
    // suggestions: 'suggestions',
}

const reducer = (state, action) => {
    const { type, payload } = action

    switch (type) {
        case types.setStage:
            return { ...state, stage: payload }
        case types.name:
            return { ...state, name: payload }
        case types.email:
            return { ...state, email: payload }
        case types.city:
            return { ...state, city: payload }
        case types.postcode:
            return { ...state, postcode: payload }
        case types.address:
            return { ...state, address: payload }
        case types.phone:
            return { ...state, phone: payload }
        case types.pmethod:
            return { ...state, pmethod: payload }
        case types.country:
            return { ...state, country: payload }
        case types.suggestions:
            return { ...state, suggestions: payload }
        default:
            break
    }
}

export const CheckoutProvider = ({ children }) => {
    const [checkoutState, dispatch] = useReducer(reducer, INITIAL_STATE)

    const setStage = (stage) => {
        dispatch({ type: types.setStage, payload: stage })
    }

    const handleAddressChange = async (e) => {
        const inputAddress = e.target.value;
        dispatch({ type: types.address, payload: inputAddress })
        // const addressSuggestions = await fetchAddressSuggestions(inputAddress);
        // dispatch({ type: types.suggestions, payload: addressSuggestions });
    }

    const setPhone = (e) => {
        const text = e.target.value.split(' ')[1];
        const value = text === undefined ? '' : text;
        const regex = /^[0-9\b]+$/;
        if (regex.test(text)) {
            dispatch({ type: types.phone, payload: value })
        }
    }
    const setCountry = (e) => {
        const value = e.target.value + ' '

        dispatch({ type: types.country, payload: value })
    }

    const handleChange = (e) => {
        const { name, value } = e.target

        dispatch({ type: types[name], payload: value })
    }

    const setPaymentMethod = (value) => {
        dispatch({ type: types.pmethod, payload: value })
    }

    const value = {
        state: checkoutState,
        setStage,
        handleAddressChange,
        setPhone,
        setPaymentMethod,
        setCountry,
        handleChange
    }

    return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>
}