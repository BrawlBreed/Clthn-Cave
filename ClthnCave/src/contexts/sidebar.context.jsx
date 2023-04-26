import React, { createContext, useReducer, useContext, useEffect } from 'react'
import { CategoriesContext } from './categories.context'

export const SidebarContext = createContext({
    isSidebarOpen: 0,
    searchBox: '',
    filteredItems: [],
    loading: false
})

const setFilteredItems = (input, filteredItems) => {
    // const result = filteredItems.map((item) => { return { ...item.products, categoryTitle: item.category.title } }).flat()
    //.filter((item) => item.title.toLowerCase().includes(input))
    const result = filteredItems.map((item) => {
        const { products, category } = item
        const result = products.map((item) => {
            return { ...item, categoryTitle: category.title }
        }).filter((item) => item.title.toLowerCase().includes(input))

        return result
    })

    return result.flat(2)
}


const INITIAL_STATE = {
    isSidebarOpen: 1,
    searchBox: '',
    filteredItems: [],
    loading: false
}

const types = {
    setMap: 'setMap',
    setIsSidebarOpen: 'setIsSidebarOpen',
    searchBoxFilter: 'searchBoxFilter',
    setFilteredItems: 'setFilteredItems'
}

const reducer = (state, action) => {
    const { type, payload } = action

    switch (type) {
        case types.setMap:
            return { ...state, filteredItems: payload, loading: true }
        case types.setIsSidebarOpen:
            return { ...state, isSidebarOpen: !state.isSidebarOpen }
        case types.searchBoxFilter:
            return { ...state, searchBox: payload }
        case types.setFilteredItems:
            return { ...state, filteredItems: payload }
        default:
            console.log('Unknown error')
    }
}

export const SidebarProvider = ({ children }) => {
    const [sidebarState, dispatch] = useReducer(reducer, INITIAL_STATE)
    const { categoriesMap } = useContext(CategoriesContext)

    const onChangeHandler = (e) => {
        dispatch({ type: types.searchBoxFilter, payload: e.target.value.toLowerCase() })
    }

    useEffect(() => {
        if (categoriesMap.length) {
            const products = categoriesMap.map((item) => item)
            dispatch({ type: types.setMap, payload: products })
        }
    }, [categoriesMap])

    useEffect(() => {
        if (categoriesMap.length) {
            const items = setFilteredItems(sidebarState.searchBox, categoriesMap)
            dispatch({ type: types.setFilteredItems, payload: items })
        }
    }, [sidebarState.searchBox])

    const setIsSidebarOpen = () => {
        dispatch({ type: types.setIsSidebarOpen })
    }


    const value = {
        setIsSidebarOpen,
        onChangeHandler,
        sidebarState
    }
    return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

