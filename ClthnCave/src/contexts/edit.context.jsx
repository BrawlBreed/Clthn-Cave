import { createContext, useState, useEffect, useReducer } from 'react';
import { getCategoriesAndDocuments, handleUpload, deleteCategories } from '../utils/firebase/firebase.utils';

export const EditContext = createContext({
    currentProduct: {},
    restData: [],
    setModal: () => { },
    setData: () => { },
    setCategoryIndex: () => { },
    setProductIndex: () => { },
    handleFileSelect: () => { },
    handleChange: () => { },
    handleChangeSize: () => { },
})

const INITIAL_STATE = {
    currentProduct: {
        price: 0,
        description: '',
        title: '',
        sizes: [],
        imageUrls: [],
    },
    currentCategory: {
        title: '',
        imageUrl: ''
    },
    productIndex: 0,
    categoryIndex: 0,
    modal: false,
    restData: [],
}

const types = {
    imageUrls: 'imageUrls',
    sizes: 'sizes',
    title: 'title',
    description: 'description',
    price: 'price',
    setData: 'setData',
    setCurrentProduct: 'setCurrent',
    setCurrentCategory: 'setCurrentCategory',
    categoryTitle: 'categoryTitle',
    categoryImage: 'categoryImage',
    setModal: 'setModal',
    setCategoryIndex: 'setCategoryIndex',
    setProductIndex: 'setProductIndex'
}

const reducer = (state, action) => {
    const { type, payload } = action

    switch (type) {
        case types.setData:
            return { ...state, restData: payload }
        case types.setCurrentProduct:
            return { ...state, currentProduct: payload }
        case types.setCurrentCategory:
            return { ...state, currentCategory: payload }
        case types.categoryTitle:
            return { ...state, currentCategory: { ...state.currentCategory, title: payload } }
        case types.categoryImage:
            return { ...state, currentCategory: { ...state.currentCategory, imageUrl: payload } }
        case types.setModal:
            return { ...state, modal: payload }
        case types.setCategoryIndex:
            return { ...state, categoryIndex: payload }
        case types.setProductIndex:
            return { ...state, productIndex: payload }
        case types.title:
            return { ...state, currentProduct: { ...state.currentProduct, title: payload } }
        case types.description:
            return { ...state, currentProduct: { ...state.currentProduct, description: payload } }
        case types.price:
            return { ...state, currentProduct: { ...state.currentProduct, price: payload } }
        case types.imageUrls:
            return { ...state, currentProduct: { ...state.currentProduct, imageUrls: payload } }
        case types.sizes:
            return { ...state, currentProduct: { ...state.currentProduct, sizes: payload } }
        default:
            break
    }
}
export const EditProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

    const setCurrent = () => {
        console.log(state)
        const product = {
            ...state.restData[state.categoryIndex].products[state.productIndex],
        }
        const category = {
            ...state.restData[state.categoryIndex].category,
        }

        dispatch({ type: types.setCurrentProduct, payload: product })
        dispatch({ type: types.setCurrentCategory, payload: category })
    }

    const setModal = () => {
        const value = !state.modal;
        dispatch({ type: types.setModal, payload: value })
    }

    const setCategoryIndex = (value) => {
        dispatch({ type: types.setCategoryIndex, payload: value })
    }

    const setProductIndex = (value) => {
        if (state.currentProduct.title) {
            const restData = state.restData[state.categoryIndex]
            restData.products[state.productIndex] = state.currentProduct
            dispatch({ type: types.setData, payload: [restData] })
        }

        dispatch({ type: types.setProductIndex, payload: value })
    }

    const handleFileSelect = async (e) => {
        const { files, name } = e.target;
        const url = await handleUpload(files);

        dispatch({ type: types[name], payload: url })
    }

    const handleChangeSize = (e) => {
        const { value, checked } = e.target
        let sizeArr = []
        if (checked) {
            sizeArr.push(value, ...Array.from(state.currentProduct.sizes))
        } else {
            sizeArr = Array.from(state.currentProduct.sizes).filter((item) => item !== value)
        }
        const sizeSet = new Set(sizeArr)
        dispatch({ type: types.sizes, payload: [...sizeSet] })
    }

    const handleChange = (e) => {
        const { name, value } = e.target

        dispatch({ type: types[name], payload: value })
    }

    useEffect(async () => {
        const data = await getCategoriesAndDocuments()

        dispatch({ type: types.setData, payload: data })
    }, [])

    useEffect(() => {
        if (state.restData.length) setCurrent()
    }, [state.productIndex, state.categoryIndex, state.restData])

    const value = {
        state: state,
        setModal,
        handleFileSelect,
        handleChangeSize,
        handleChange,
        setCategoryIndex,
        setProductIndex
    }

    return <EditContext.Provider value={value}>{children}</EditContext.Provider>
}
