import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { CartContext } from '../../contexts/cart.context';

import Button from '../button/button.component';

import './product-card.styles.scss';

export const ProductCard = ({ product, categoryTitle }) => {
  const { title, price, imageUrls } = product;
  const { addItemToCart } = useContext(CartContext);
  const navigate = useNavigate()

  return (
    <div className='product-card-container'>
      <div className='card' onClick={() => { navigate(`/shop/${categoryTitle}/${title}`) }}>
        <img width='325px' height='335px' src={imageUrls} alt={`${title}`} style={{ transition: '0.3s', margin: '10px' }} />
        <div className='footer'>
          <span className='name'>{title}</span>
          <div>
            <h3 className='price'>{price}BGN</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
