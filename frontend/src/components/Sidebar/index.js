import React from 'react';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';
import { useProductsContext } from '../../context/products_context';
import { FaTimes } from 'react-icons/fa';
import { links } from '../../utils/constants';
import CartButtons from '../CartButtons/';
import { useUserContext } from '../../context/user_context';

const Sidebar = () => {
  const { currentUser } = useUserContext();
  const { isSidebarOpen, closeSidebar } = useProductsContext();

  return (
    <div>
      <aside
        className={`${isSidebarOpen ? 'sidebar show-sidebar' : 'sidebar'}`}
      >
        <div className='sidebar-header'>
          <img src={logo} alt='Angel Fashion Studio' className="h-[67px] object-contain" />
          <button type='button' className='close-btn' onClick={closeSidebar}>
            <FaTimes />
          </button>
        </div>
        <ul className='links'>
          {links.map((link) => {
            const { text, url, id } = link;
            return (
              <li key={id}>
                <Link to={url} onClick={closeSidebar}>
                  {text}
                </Link>
              </li>
            );
          })}
          {currentUser && (
            <li>
              <Link to='/checkout' onClick={closeSidebar}>
                checkout
              </Link>
            </li>
          )}
          {currentUser && (
            <li>
              <Link to='/orders' onClick={closeSidebar}>
                orders
              </Link>
            </li>
          )}
        </ul>
        <CartButtons />
      </aside>
    </div>
  );
};

export default Sidebar;
