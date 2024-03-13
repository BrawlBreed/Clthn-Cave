import { Fragment, useContext, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';

import CartIcon from '../../components/cart-icon/cart-icon.component';
import CartDropdown from '../../components/cart-dropdown/cart-dropdown.component';

import { UserContext } from '../../contexts/user.context';
import { CartContext } from '../../contexts/cart.context';

import { signOutUser } from '../../utils/firebase/firebase.utils';

import Sidebar from '../../components/sidebar/sidebar.component';
import Footer from '../../components/footer/footer.component';

import { AiFillShop } from 'react-icons/ai'
import { Loader } from '../../utils/alerts/Loader'
import { CategoriesContext } from '../../contexts/categories.context';
import Logo from '../../assets/clthncave.png'

import {
  NavigationContainer,
  LogoContainer,
  NavLinks,
  NavLink,
  AuthLink
} from './navigation.styles';

const Navigation = ({ sidebar }) => {
  const { currentUser } = useContext(UserContext);
  const { cartState } = useContext(CartContext);
  const { isCartOpen } = cartState;
  const { categoriesMap } = useContext(CategoriesContext)

  return (
    <Fragment>
      <NavigationContainer>
        <Link to='/'>
          <img src={Logo} style={{ width: '100px', height: 'auto' }} />
        </Link>
        <NavLinks>
          <NavLink to='/shop'><AiFillShop style={{ width: '40px', height: 'auto' }} /></NavLink>
          <CartIcon />
          {currentUser ? (
            <AuthLink as='span' onClick={signOutUser}>
              SIGN OUT
            </AuthLink>
          ) : (
            <AuthLink to='/auth'>SIGN IN</AuthLink>
          )}

        </NavLinks>
        {isCartOpen && <CartDropdown />}
      </NavigationContainer>
      {sidebar && (
        <Sidebar />
      )}
      <Loader />
      <Outlet />
      {/* <Footer /> */}
    </Fragment>
  );
};

export default Navigation;
