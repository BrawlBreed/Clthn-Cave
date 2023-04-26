import { createContext, useState, useEffect, useReducer } from 'react';

export const AddContext = createContext({
    handleChange: () => { },
    handleFileSelect: () => { },
    setCategoryImage: () => { },
    setCategory: () => { },
    setImageUrls: () => { },
    setSize: () => { },
    state: {},
})

const INITIAL_STATE = {
    title: '',
    category: '',
    description: '',
    price: '',
    imageUrls: [],
    categoryImage: [],
    sizes: [],
}
const types = {
    setCategory: 'setCategory',
    setImageUrls: 'setImageUrls',
    setCategoryImage: 'setCategoryImage',
    setSize: 'setSize',
    title: 'title',
    description: 'description',
    price: 'price',
}

const reducer = (state, action) => {
    const { type, payload } = action

    switch (type) {
        case types.setCategory:
            return { ...state, category: payload }
            break
        case types.setImageUrls:
            return { ...state, imageUrls: payload }
            break
        case types.setCategoryImage:
            return { ...state, categoryImage: payload }
            break
        case types.setSize:
            return { ...state, sizes: payload }
        case types.category:
            return { ...state, category: payload }
            break
        case types.title:
            return { ...state, title: payload }
            break
        case types.description:
            return { ...state, description: payload }
            break
        case types.price:
            return { ...state, price: payload }
            break
        default:

            break
    }
}


export const AddProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === "price") {
            dispatch({ type: types[name], payload: Number(value) > 0 ? value : 0 })

        } else {
            dispatch({ type: types[name], payload: value })
        }
    };
    const setCategory = (value) => {
        dispatch({ type: types.setCategory, payload: value })
    }
    const setImageUrls = (urlArr) => {
        dispatch({ type: types.setImageUrls, payload: urlArr })
    }
    const setCategoryImage = (imageUrl) => {
        dispatch({ type: types.setCategoryImage, payload: imageUrl })
    }
    const setSize = (e) => {
        const { value, checked } = e.target
        let sizeArr = []
        if (checked) {
            sizeArr.push(value, ...Array.from(state.sizes))
        } else {
            sizeArr = Array.from(state.sizes).filter((item) => item !== value)
        }
        const sizeSet = new Set(sizeArr)
        dispatch({ type: types.setSize, payload: sizeSet })

    }

    const value = {
        setCategory,
        setImageUrls,
        setCategoryImage,
        setSize,
        handleChange,
        state: state,
    }
    return <AddContext.Provider value={value}>{children}</AddContext.Provider>
}