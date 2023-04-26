import { useContext } from 'react';

import { IoBagOutline } from 'react-icons/io5';

import { CartContext } from '../../contexts/cart.context';

import './cart-icon.styles.scss';

const CartIcon = () => {
  const { cartState, setIsCartOpen } = useContext(CartContext);
  const { isCartOpen, cartCount } = cartState

  const toggleIsCartOpen = () => setIsCartOpen(!isCartOpen);

  return (
    <div className='cart-icon-container' onClick={toggleIsCartOpen}>
      <IoBagOutline className='shopping-icon' />
      <a className='item-count'>{cartCount}</a>
    </div>
  );
};

export default CartIcon;
