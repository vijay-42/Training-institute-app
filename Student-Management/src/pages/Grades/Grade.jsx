import  { useEffect ,useState} from "react";
import { GiUpgrade } from "react-icons/gi";
import Add_Grade from "./Add_Grade";
import Grade_Levels from "./Grade_Levels";
import '../Grades/grade.css'

const Grade = () => {
    const [showForm, setShowForm] = useState(() => {
       
        const storedValue = sessionStorage.getItem("showForm");
        return storedValue ? JSON.parse(storedValue) : false;
      });

  const handleAddStudentClick = () => {
    setShowForm(true);
  };

  const handleGoBackClick = () => {
    setShowForm(false);
  };

  useEffect(() => {
    sessionStorage.setItem("showForm", JSON.stringify(showForm));
  }, [showForm]);

  return (
    <div className="container">
      <div className="bg-white row shadow">
        {showForm ? (
          <div className="container-fluid py-5">
            <div className="main-container rounded pb-5 px-2">
              <div className=" px-4 py-2 purple col-md-12">
                <p className="fs-2 fw-bold ps-2 py-3 d-inline ">Add Grade</p>
                <button
                  className="gobtn rounded-0 float-end text-center mt-2 btn text-bg-success fw-bold"
                 
                  onClick={handleGoBackClick}
                >
                  GO Back
                </button>
              </div>
              <Add_Grade/>
            </div>
          </div>
        ) : (


            <div className="container-fluid py-5">
            <div className="main-container rounded pb-5 px-2">
              <div className=" px-4 py-2 purple col-md-12">
                <p className="fs-2 fw-bold ps-2 py-3 d-inline ">Grade Levels</p>
                <button className="btnicon rounded-0 float-end text-center mt-2 btn bg-danger text-white fw-bold"  onClick={handleAddStudentClick}>
                  
                    <GiUpgrade className="fw-bold me-2 mb-1" />{" "}
                    <span className="text-hide">Add New Grade</span>
                  
                </button>
              </div>
               <Grade_Levels/>
              </div></div>
         
        //   <div className="card border-0">
        //     <div className="border_color ms-md-2 my-3 pb-2 float-start">
        //       <h2>
        //         <span className="fontweight">Manage Students</span>
        //         <span
        //           className="float-end change mt-2 bg-opacity-75 p-2 text-bg-danger"
        //           onClick={handleAddStudentClick}
        //           style={{ cursor: "pointer" }}
        //         >
        //           <FaPlus /> Add New Grade
        //         </span>
        //       </h2>
        //     </div>
        //     <div className="card-header border  ">Manage Grade Level</div>
        //     <div className="card-body border mb-5 ">
        //       <Grade_Levels />
        //     </div>
        //   </div>
        )}
      </div>
    </div>
  );
};

export default Grade;
