import { useContext, Fragment } from 'react';

import { CategoriesContext } from '../../contexts/categories.context';
import CategoryPreview from '../../components/category-preview/category-preview.component';

const CategoriesPreview = () => {
  const { categoriesMap } = useContext(CategoriesContext);

  return (
    <Fragment>
      {categoriesMap.length ? categoriesMap.map(({ category, products }) => {
        return (
          <CategoryPreview categoryTitle={category.title} products={products} />
        );
      }) : <></>}
    </Fragment>
  );
};

export default CategoriesPreview;
