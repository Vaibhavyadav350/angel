import React from 'react';
import logo from '../../assets/logo.png';
import { FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { links, navCategories } from '../../utils/constants';
import CartButtons from '../CartButtons/';
import { useProductsContext } from '../../context/products_context';
import { useUserContext } from '../../context/user_context';

const Nav = () => {
  const { currentUser } = useUserContext();
  const { openSidebar } = useProductsContext();

  // Categories that have sub-menus
  const categoryLinks = ['Women', 'Men', 'Kids', 'Jewelry'];

  return (
    <nav className='nav-center'>
      <div className='nav-header'>
        <Link to='/'>
          <img src={logo} alt='Angel Fashion Studio' className="h-14 object-contain" />
        </Link>
        <button type='button' className='nav-toggle' onClick={openSidebar}>
          <FaBars />
        </button>
      </div>
      <ul className='nav-links'>
        {links.map((link) => {
          const { url, text, id } = link;
          const isCategory = categoryLinks.includes(text);
          const subCategories = isCategory ? navCategories[text] : null;

          if (isCategory && subCategories) {
            return (
              <li key={id} className='nav-dropdown'>
                <Link to={url}>{text}</Link>
                <ul className='nav-dropdown-menu'>
                  <li>
                    <Link to={url}>All {text}</Link>
                  </li>
                  {subCategories.map((sub) => (
                    <li key={sub}>
                      <Link to={`/products?category=${text}&subCategory=${encodeURIComponent(sub)}`}>
                        {sub}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            );
          }

          return (
            <li key={id}>
              <Link to={url}>{text}</Link>
            </li>
          );
        })}
        {currentUser && (
          <li>
            <Link to='/checkout'>checkout</Link>
          </li>
        )}
        {currentUser && (
          <li>
            <Link to='/orders'>orders</Link>
          </li>
        )}
      </ul>
      <CartButtons />
    </nav>
  );
};

export default Nav;
