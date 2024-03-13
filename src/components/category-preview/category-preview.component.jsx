import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import ProductCard from '../product-card/product-card.component';
import { SidebarContext } from '../../contexts/sidebar.context';

import './category-preview.styles.scss';

const CategoryPreview = ({ categoryTitle, products }) => {
  const { sidebarState } = useContext(SidebarContext)
  const { isSidebarOpen } = sidebarState

  return (
    <div className='category-preview-container'>
      <h2 >
        <Link className='title' to={categoryTitle} style={{ marginLeft: isSidebarOpen && '8%' }}>
          {categoryTitle.toUpperCase()}
        </Link>
      </h2>
      <div className='preview' style={{ marginLeft: isSidebarOpen && '20%', gridTemplateColumns: isSidebarOpen && `repeat(3, 1fr)` }}>
        {products.length ? products
          .filter((_, idx) => idx < 4)
          .map((product) => (
            <ProductCard key={product.id} product={product} categoryTitle={categoryTitle} />
          )) : <></>}
      </div>
    </div>
  );
};

export default CategoryPreview;
