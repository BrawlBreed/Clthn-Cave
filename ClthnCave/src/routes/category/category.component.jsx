import { useContext, useState, useEffect, Fragment } from 'react';
import { useParams, Outlet } from 'react-router-dom';

import ProductCard from '../../components/product-card/product-card.component';

import { CategoriesContext } from '../../contexts/categories.context';
import { SidebarContext } from '../../contexts/sidebar.context';

import './category.styles.scss';

const Category = () => {
  const { category } = useParams();
  const { categoriesMap } = useContext(CategoriesContext);
  const [products, setProducts] = useState(categoriesMap[category]);
  const { sidebarState } = useContext(SidebarContext)
  const { isSidebarOpen } = sidebarState

  useEffect(() => {

    if (categoriesMap.length) {
      const products = []
      categoriesMap.map((item) => {
        item.category.title === category &&
          products.push(item.products)
      })
      setProducts(products.flat());
    }
  }, [category, categoriesMap]);

  return (
    <Fragment>
      <h2 className='category-title'>{category.toUpperCase()}</h2>
      <div className='category-container' style={{ left: isSidebarOpen && '20%', gridTemplateColumns: isSidebarOpen && `repeat(3, 1fr)` }}>
        {products ?
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          )) : <></>}
      </div>
    </Fragment>
  );
};

export default Category;
