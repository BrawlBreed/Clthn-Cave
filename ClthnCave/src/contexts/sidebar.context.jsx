import React, { createContext, useReducer, useContext, useEffect } from 'react'
import { CategoriesContext } from './categories.context'

export const SidebarContext = createContext({
    isSidebarOpen: 0,
    searchBox: '',
    filteredItems: [],
    loading: false
})

const setFilteredItems = (input, filteredItems) => {
    const filtered = Object.keys(filteredItems).map((key) => {
        return filteredItems[key].filter((item) => {
            return item.name.toLowerCase().includes(input)
        })
    })
    const result = filtered.filter((item, i, arr) => {
        return item.length > 0
    })


    return [result.flat()]
}


const INITIAL_STATE = {
    isSidebarOpen: 0,
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
        dispatch({ type: types.searchBoxFilter, payload: e.target.value })
    }

    useEffect(() => {
        dispatch({ type: types.setMap, payload: categoriesMap })
    }, [categoriesMap])

    useEffect(() => {
        const items = setFilteredItems(sidebarState.searchBox, categoriesMap)
        dispatch({ type: types.setFilteredItems, payload: items })
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

