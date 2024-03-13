import React, { useEffect } from 'react'

export const CheckoutStatusBar = ({ stage }) => {
    let state = { preview: 1, details: 0, payment: 0, placeOrder: 0 }

    switch (stage) {
        case 1:
            state = { preview: 1, details: 0, payment: 0, placeOrder: 0 }
            break
        case 2:
            state = { preview: 1, details: 1, payment: 0, placeOrder: 0 }
            break
        case 3:
            state = { preview: 1, details: 1, payment: 1, placeOrder: 0 }
            break
        case 4:
            state = { preview: 1, details: 1, payment: 1, placeOrder: 1 }
            break
        default:
            state = { preview: 1, details: 0, payment: 0, placeOrder: 0 }
            break
    }


    return (
        <div className="checkout-steps">
            <div className={state.preview ? 'active' : ''} >Product Preview</div>
            <div className={state.details ? 'active' : ''} >Order Details</div>
            <div className={state.payment ? 'active' : ''} >Payment</div>
            <div className={state.placeOrder ? 'active' : ''}>PlaceOrder</div>
        </div>
    )
}

export default CheckoutStatusBar