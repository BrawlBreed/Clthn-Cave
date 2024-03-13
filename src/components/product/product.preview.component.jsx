import React, { useContext, useState, useEffect } from 'react';
import { CategoriesContext } from '../../contexts/categories.context';
import { SidebarContext } from '../../contexts/sidebar.context';
import { CartContext } from '../../contexts/cart.context';
import { useParams } from 'react-router-dom';

import './product-preview.styles.scss';
import FormInput from '../form-input/form-input.component';
import { Button } from '../button/button.component';

import { productValidate } from '../../utils/validation/validation';

export const Product = () => {
    const { category, product } = useParams();
    const { categoriesMap } = useContext(CategoriesContext);
    const { sidebarState } = useContext(SidebarContext)
    const { addItemToCart } = useContext(CartContext)
    const [article, setArticle] = useState({})
    const [activePic, setActivePic] = useState('')
    const [quantity, setQuantity] = useState(0)
    const [size, setSize] = useState('')
    const [errors, setErrors] = useState({})
    const { isSidebarOpen } = sidebarState;

    useEffect(() => {
        if (categoriesMap.length) {
            const productObj = categoriesMap.map((item) =>
                item.products
            ).flat().filter((item) => item.title === product).flat()

            setArticle(productObj);
            setActivePic(productObj[0].imageUrls[0])
        }

    }, [category, categoriesMap]);

    const handleItemAdd = (e) => {
        e.preventDefault()

        const data = { size: size, quantity: quantity }
        setErrors(productValidate(data, errors))

        const valid = Object.values(errors).filter((item) => {
            return item.length > 0
        })

        if (valid.length === 0) {
            const cartItem = {
                ...article[0],
                quantity: quantity,
                size: size
            }

            addItemToCart(cartItem)
        }

    }

    return (
        <>
            {
                article.length ? (
                    <div className='product-card-container'>
                        <div className='image-preview-container'>
                            <h1>{article[0].title}</h1>
                            {article[0].imageUrls.filter((_, i) => i < 9).map((item) => (
                                <img onClick={() => setActivePic(item)} style={{ border: '1px solid gray', cursor: 'pointer' }} width={75} height={75} src={item} />
                            ))}
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <img width={350} height={350} src={activePic} />
                            <h4>{article[0].description}</h4>
                        </div>
                        <div className='product-specifics-container'>
                            <div>
                                <div>
                                    <label>Size:</label>
                                    <select className='countryCode' onChange={(e) => {
                                        const value = e.target.value
                                        setSize(value)
                                    }}>
                                        {article[0].sizes.map((item) => <option value={item}>{item.toUpperCase()}</option>)}
                                    </select>
                                </div>
                                {errors.size && <span style={{ color: 'red' }}>{errors.size}</span>}
                            </div>
                            <div>
                                <div>
                                    <label>Quantity:</label>
                                    <FormInput value={quantity} onChange={(e) => {
                                        const value = Number(e.target.value)
                                        setQuantity(value > 0 ? value : 0)
                                    }}
                                        type='number'
                                    />
                                </div>
                                {errors.quantity && <span style={{ color: 'red', position: 'absolute', marginTop: '5%' }}>{errors.quantity}</span>}

                            </div>
                            <Button onClick={handleItemAdd} style={{ width: '25%' }}>Add to cart</Button>
                        </div>
                    </div>

                ) : <h1>{product}</h1>
            }

        </>

    )
}

export default Product