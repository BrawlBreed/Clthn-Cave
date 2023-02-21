import { useContext } from 'react';

import { ReactComponent as ShoppingIcon } from '../../assets/shopping-bag.svg';

import { CartContext } from '../../contexts/cart.context';

import './cart-icon.styles.scss';

const CartIcon = () => {
  const { cartState, setIsCartOpen } = useContext(CartContext);
  const { isCartOpen, cartCount } = cartState

  const toggleIsCartOpen = () => setIsCartOpen(!isCartOpen);

  return (
    <div className='cart-icon-container' onClick={toggleIsCartOpen}>
      <ShoppingIcon className='shopping-icon' />
      <a className='item-count'>{cartCount}</a>
    </div>
  );
};

export default CartIcon;
