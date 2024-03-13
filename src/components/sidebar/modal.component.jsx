import React, { useContext, useEffect, useState } from 'react';
import AOS from 'aos'
import 'aos/dist/aos.css';
import './sidebar.styles.scss';
import { useNavigate } from 'react-router-dom';

export const Modal = ({ item }) => {
    const { id, title, imageUrls } = item
    const navigate = useNavigate()

    useEffect(() => {
        AOS.init();
    }, [])

    return (
        <div className='modal-container' data-aos='fade-down'
            onClick={() => {
                navigate(`/shop/${item.categoryTitle}`)
            }}
        >
            <div
                className='background-image'
                style={{
                    backgroundImage: `url(${imageUrls})`,
                }}
                key={id}
            />
            <h3>{title}</h3>
        </div>
    )
}

export default Modal