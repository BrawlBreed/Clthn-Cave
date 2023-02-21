import { useContext } from 'react';
import { Link } from 'react-router-dom';

import ProductCard from '../product-card/product-card.component';
import { SidebarContext } from '../../contexts/sidebar.context';

import './category-preview.styles.scss';

const CategoryPreview = ({ title, products }) => {
  const { sidebarState } = useContext(SidebarContext)
  const { isSidebarOpen } = sidebarState


  return (
    <div className='category-preview-container'>
      <h2 >
        <Link className='title' to={title} style={{ marginLeft: isSidebarOpen && '8%' }}>
          {title.toUpperCase()}
        </Link>
      </h2>
      <div className='preview' style={{ marginLeft: isSidebarOpen && '20%', gridTemplateColumns: isSidebarOpen && `repeat(3, 1fr)` }}>
        {products
          .filter((_, idx) => idx < 4)
          .map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </div>
    </div>
  );
};

export default CategoryPreview;
