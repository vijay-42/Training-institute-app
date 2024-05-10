import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../Navbar/Navbar.css'

function Navbar() {
  
  
  
  return (
    <>
      <div className='container-fluid m-0 p-0 d-flex'>
        <aside>
          <Sidebar/>
        </aside>
        
        <div className='section'>
          <Outlet />
        </div>

      </div>
    </>
  );
}

export default Navbar;
