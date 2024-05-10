import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { PiToggleLeftFill } from "react-icons/pi";
import { GiMoneyStack } from "react-icons/gi";
import { GiUpgrade } from "react-icons/gi";
import { RiTeamFill } from "react-icons/ri";
import { TbReportAnalytics } from "react-icons/tb";
import { MdSettingsSuggest } from "react-icons/md";
import { BiLogOutCircle } from "react-icons/bi";
import Favicon from '../Navbar/logo.png';
import "../Navbar/Navbar.css";

function Sidebar() {
  const location = useLocation();

  const navLinkStyle = (isActive) => ({
    fontWeight: isActive ? "400" : "normal",
    backgroundColor: isActive ? "#6719BD" : "#212121",
    transition: "background-color 0.3s ease", 
    ":hover": { 
      backgroundColor: isActive ? "#8F5BF8" : "#424242",
    }
  });
  

  return (
    <aside className="navbar-res text-white  float-start">
      <div className="menus">
        
        <ul className="p-0 pt-3">
          <li className="text-center">
            <img src={Favicon}  className="icon justify-content-center" alt="" />
            <h5 className="nav-text-hide mt-3 fs-4 fw-bold" >Admin</h5>
          </li>

          

          <li className="list-hover" style={navLinkStyle(location.pathname === "/")}>
            <NavLink to="/" className="Link">
              <FaHome style={{ fontSize: "25px", margin: "0 10px" }} />
             <span className="nav-text-hide">Dashboard</span> 
            </NavLink>
          </li>

          <li style={navLinkStyle(location.pathname === "/Student")}>
           
            <NavLink to="/Student" className="Link">
            <RiTeamFill style={{ fontSize: "25px", margin: "0 10px" }} />
            <span className="nav-text-hide">Student Management</span> 
            </NavLink>
          </li>

          <li style={navLinkStyle(location.pathname === "/In_active_Student")}>
           
            <NavLink to="/In_active_Student" className="Link">
            <PiToggleLeftFill style={{ fontSize: "25px", margin: "0 10px" }} />
             <span className="nav-text-hide">In-active Student</span> 
            </NavLink>
          </li>

          <li style={navLinkStyle(location.pathname === "/Grade")}>
            
            <NavLink to="/Grade" className="Link">
            <GiUpgrade style={{ fontSize: "25px", margin: "0 10px" }} />
              <span className="nav-text-hide">Grade Levels</span>
            </NavLink>
          </li>

          <li style={navLinkStyle(location.pathname === "/Fees_Section")}>
            
            <NavLink to="/Fees_Section" className="Link">
            <GiMoneyStack style={{ fontSize: "25px", margin: "0 10px" }} />
             <span className="nav-text-hide">Fees Section</span> 
            </NavLink>
          </li>

          <li style={navLinkStyle(location.pathname === "/Report_Section")}>
        
            <NavLink to="/Report_Section" className="Link">
            <TbReportAnalytics style={{ fontSize: "25px", margin: "0 10px" }} />
             <span className="nav-text-hide">Report Section</span> 
            </NavLink>
          </li>

          <li style={navLinkStyle(location.pathname === "/Account_Setting")}>
           
            <NavLink to="/Account_Setting" className="Link">
            <MdSettingsSuggest style={{ fontSize: "25px", margin: "0 10px" }} />
             <span className="nav-text-hide">Account Setting</span> 
            </NavLink>
          </li>

          <li style={navLinkStyle(location.pathname === "/Logout")}>
            
            <NavLink to="/loginForm" className="Link">
            <BiLogOutCircle style={{ fontSize: "25px", margin: "0 10px" }} />
              <span className="nav-text-hide">Logout</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
