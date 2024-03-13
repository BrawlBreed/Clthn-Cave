import { useContext } from 'react';

import { CartContext } from '../../contexts/cart.context';

import './checkout-item.styles.scss';

const CheckoutItem = ({ cartItem }) => {
  const { title, imageUrls, price, quantity, size, sizes } = cartItem;

  const { clearItemFromCart, addItemToCart, removeItemToCart } =
    useContext(CartContext);

  const clearItemHandler = () => clearItemFromCart(cartItem);
  const addItemHandler = () => addItemToCart({ ...cartItem, quantity: 1 });
  const removeItemHandler = () => removeItemToCart(cartItem);

  return (
    <div className='checkout-item-container'>
      <div className='image-container'>
        <img src={imageUrls} alt={`${title}`} />
      </div>
      <span className='name'> {title} </span>
      <span className='quantity'>
        <div className='arrow' onClick={removeItemHandler}>
          &#10094;
        </div>
        <span className='value'>{quantity}</span>
        <div className='arrow' onClick={addItemHandler}>
          &#10095;
        </div>
      </span>
      <span className='size'>
        <select className='countryCode' defaultValue={size} onChange={(e) => {
          const value = e.target.value
          addItemToCart({ ...cartItem, size: value, quantity: 0 })
        }}>
          {sizes.map((item) => <option>{item.toUpperCase()}</option>)}
        </select>
      </span>
      <div>
      </div>
      <span className='price'> {price}</span>
      <div className='remove-button' onClick={clearItemHandler}>
        &#10005;
      </div>
    </div>
  );
};

export default CheckoutItem;
