import { useContext } from 'react'
import { Outlet } from 'react-router-dom';
import { CategoriesContext } from '../../contexts/categories.context';

import Directory from '../../components/directory/directory.component';

const Home = () => {
  const { categoriesMap } = useContext(CategoriesContext)
  return (
    <div>
      <Directory categories={categoriesMap} />
      <Outlet />
    </div>
  );
};

export default Home;
