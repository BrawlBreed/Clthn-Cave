import { createContext, useReducer, useEffect } from "react";

export const RecoveryContext = createContext({
    setPage: () => { },
    setOtp: () => { },
    setObb: () => { },
    setEmail: () => { },
    recoveryState: {}
})

const INITIAL_STATE = {
    page: 'signIn',
    otp: 0,
    obb: '',
    email: ''
}
const types = {
    setPage: 'setPage',
    setOtp: 'setOtp',
    setObb: 'setObb',
    setEmail: 'setEmail'
}
const reducer = (state, action) => {
    const { type, payload } = action

    switch (type) {
        case types.setPage:
            return { ...state, page: payload }
        case types.setOtp:
            return { ...state, otp: payload }
        case types.setObb:
            return { ...state, obb: payload }
        case types.setEmail:
            return { ...state, email: payload }
        default:
            console.log('Unknown error!')
    }

}

export const RecoveryProvider = ({ children }) => {
    const [recoveryState, dispatch] = useReducer(reducer, INITIAL_STATE)

    const setPage = (page) => {
        dispatch({ type: types.setPage, payload: page })
    }
    const setOtp = (otp) => {
        dispatch({ type: types.setOtp, payload: otp })
    }
    const setObb = (obb) => {
        dispatch({ type: types.setObb, payload: obb })
    }
    const setEmail = (e) => {
        dispatch({ type: types.setEmail, payload: e.target.value })
    }

    const value = {
        setPage,
        setOtp,
        setObb,
        setEmail,
        recoveryState: recoveryState
    }

    return <RecoveryContext.Provider value={value}>{children}</RecoveryContext.Provider>
}