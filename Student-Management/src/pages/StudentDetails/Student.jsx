import React from "react";
import { FaUserPlus } from "react-icons/fa";
import Add_Student from "../StudentDetails/Add_Student";
import { FaCircleArrowLeft } from "react-icons/fa6";
import Student_Management from "../StudentDetails/Student Management";
import "../StudentDetails/Student.css";
import { useEffect } from "react";

const Student = () => {
    const [showForm, setShowForm] = React.useState(() => {
       
        const storedValue = localStorage.getItem("showForm");
        return storedValue ? JSON.parse(storedValue) : false;
      });

  const handleAddStudentClick = () => {
    setShowForm(true);
  };

  const handleGoBackClick = () => {
    setShowForm(false);
  };

  useEffect(() => {
    localStorage.setItem("showForm", JSON.stringify(showForm));
  }, [showForm]);

  return (
    <div className="container">
      <div className="bg-white row shadow">
        {showForm ? (
          <div className="container-fluid py-5">
            <div className="main-container rounded pb-5 px-2">
              <div className="px-1 py-2 purple col-md-12 min">
                <p className="fs-2 fw-bold  py-3 d-inline ">
                  Student Management
                </p>
                <button
                  className="backbtn rounded-0 float-end text-center mt-2 btn text-bg-success fw-bold"
                 
                  onClick={handleGoBackClick}
                >
                    <FaCircleArrowLeft className="fw-bold me-2 mb-1"/>
                 <span className="text-hide">Go Back</span> 
                
                </button>
              </div>
              <Add_Student />
            </div>
          </div>
        ) : (
          <div className="container-fluid py-5">
            <div className="main-container rounded pb-5 px-2">
              <div className="px-4 py-2 purple col-md-12 min">
                <p className="studentext fs-2 fw-bold ps-2 py-3 d-inline">
                  Student Management
                </p>
                <button
                  className="Addbtn rounded-0 float-end text-center mt-2 btn bg-danger text-white fw-bold"
                  onClick={handleAddStudentClick}
                >
                  <FaUserPlus className="fw-bold me-2 mb-1" />
                  <span className="text-hide">Add Student</span>
                </button>
              </div>
              <Student_Management />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Student;
