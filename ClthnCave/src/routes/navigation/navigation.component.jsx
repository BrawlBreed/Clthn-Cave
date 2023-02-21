import { Fragment, useContext, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import CartIcon from '../../components/cart-icon/cart-icon.component';
import CartDropdown from '../../components/cart-dropdown/cart-dropdown.component';

import { UserContext } from '../../contexts/user.context';
import { CartContext } from '../../contexts/cart.context';

import { signOutUser } from '../../utils/firebase/firebase.utils';

import Sidebar from '../../components/sidebar/sidebar.component';
import Footer from '../../components/footer/footer.component';

import Logo from '../../assets/clthncave.png';

import {
  NavigationContainer,
  LogoContainer,
  NavLinks,
  NavLink,
} from './navigation.styles';

const Navigation = ({ sidebar }) => {
  const { currentUser } = useContext(UserContext);
  const { cartState } = useContext(CartContext);
  const { isCartOpen } = cartState

  return (
    <Fragment>
      <NavigationContainer>
        <LogoContainer to='/'>
          <img src={Logo} alt='logo' />
        </LogoContainer>
        <NavLinks>
          <NavLink to='/shop'>SHOP</NavLink>
          {currentUser ? (
            <NavLink as='span' onClick={signOutUser}>
              SIGN OUT
            </NavLink>
          ) : (
            <NavLink to='/auth'>SIGN IN</NavLink>
          )}
          <CartIcon />
        </NavLinks>
        {isCartOpen && <CartDropdown />}
      </NavigationContainer>
      {sidebar && (
        <Sidebar />
      )}
      <Outlet />
      {/* <Footer /> */}
    </Fragment>
  );
};

export default Navigation;
