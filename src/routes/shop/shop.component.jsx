import { Routes, Route } from 'react-router-dom';

import CategoriesPreview from '../categories-preview/categories-preview.component';
import Category from '../category/category.component';
import { Product } from '../../components/product/product.preview.component';
import { Search } from '../../components/search/search.component';

import './shop.styles.scss';

const Shop = () => {
  return (
    <Routes>
      <Route index element={<CategoriesPreview />} />
      <Route path='search' element={<Search />} />
      <Route path=':category' element={<Category />} />
      <Route path=':category/:product' element={<Product />} />
    </Routes>
  );
};

export default Shop;
