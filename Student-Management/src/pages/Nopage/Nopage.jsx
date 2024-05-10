import React from 'react'
import nopage  from '../Nopage/nopage.jpg'
import { FaCircleArrowLeft } from "react-icons/fa6";
import { NavLink } from 'react-router-dom';
import '../Nopage/nopage.css'

function Nopage() {
  return (
    <>
    <div className="container-fluid py-5 ">
      <div className="rs-ponsive px-4 py-3 rounded  bg-white">
        <p className="fs-2 fw-bold ps-2 py-3 purple">Page Not Found</p>
        <div className='p-0'>
          <img src={nopage} className='img-fluid' alt="nopage" />
        </div>
        <div className='d-flex justify-content-center'>
          <button  className="btn btn-danger rounded-0 border-1  text-center mt-2 fw-bold">
            <NavLink to="/" className="Dash-link">
            <FaCircleArrowLeft className="fw-bold me-2 mb-1"/>
                 <span>Go Back</span> 
            </NavLink>
          </button>
        </div>
        </div>
       
        </div>
    </>
  )
}

export default Nopage