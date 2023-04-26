import { createContext, useState, useEffect, useReducer } from 'react';
import { getOrders } from '../utils/firebase/firebase.utils';

export const OrdersContext = createContext({
    currentOrder: {

    },
    restData: [],
    setData: () => { },
    setCurrentOrder: () => { }
})

export const OrdersProvider = ({ children }) => {
    const [restData, setRestData] = useState([])
    const [currentOrder, setCurrentOrder] = useState({})

    useEffect(async () => {
        const data = await getOrders()
        setRestData(data)
    }, [])

    const value = {
        restData: restData,
        currentOrder: currentOrder,
        setCurrentOrder,
    }

    return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}