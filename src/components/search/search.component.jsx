import { useContext } from 'react';
import { ProductCard } from '../product-card/product-card.component';
import { useLocation } from 'react-router-dom';

import { CartContext } from '../../contexts/cart.context';

export const Search = () => {
    const { isSidebarOpen } = useContext(CartContext)
    const location = useLocation();

    return (
        <div className='category-container' style={{ left: isSidebarOpen && '20%', gridTemplateColumns: isSidebarOpen && `repeat(3, 1fr)` }}>
            {location.state.length ? location.state.map((product, idx) => {
                return <ProductCard key={idx} product={product} />
            }) : (
                <div style={{ display: 'flex', width: '100%' }}>
                    <p>There are no products matching your search..</p>
                </div>
            )}

        </div>
    )
}
export default Search