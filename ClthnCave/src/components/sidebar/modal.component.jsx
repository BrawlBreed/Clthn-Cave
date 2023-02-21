import React, { useContext, useEffect, useState } from 'react'
import { CartContext } from '../../contexts/cart.context';
import AOS from 'aos'
import 'aos/dist/aos.css';
import './sidebar.styles.scss'

export const Modal = ({ item }) => {
    const { addItemToCart } = useContext(CartContext);
    const { id, name, imageUrl } = item

    useEffect(() => {
        AOS.init();

    }, [])


    return (
        <div className='modal-container' data-aos='fade-down'>
            <div
                className='background-image'
                style={{
                    backgroundImage: `url(${imageUrl})`,
                }}
                key={id}
            />
            <h3>{name}</h3>
            <button
                onClick={() => addItemToCart(item)}
            >Add to cart</button>
        </div>
    )
}

export default Modal