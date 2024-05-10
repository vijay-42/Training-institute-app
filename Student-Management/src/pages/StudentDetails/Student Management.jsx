import React, { useState, useEffect } from "react";
import {  FaEdit } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { Input, Form, Modal, Button, message } from "antd";
import axios from "axios";
import "./Student.css";
import Pagination from "../Pagination";

function Student_Management() {


  
  const [studentData, setStudentData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [editingStudent, setEditingStudent] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [grades, setGrades] = useState([]);

  useEffect(() => {
   
    fetchData();
  },[studentData,grades]);
  
 
    const fetchData = async () => {
      try {
        const studentResponse = await axios.get(
          "http://localhost:5000/fetchStudent_Detail"
        );
        setStudentData(studentResponse.data);

        const gradeResponse = await axios.get(
          "http://localhost:5000/fetch-Grade"
        );
        setGrades(gradeResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

   


  const handleSubmit = async () => {
    try {
      if (!editingStudent || !editingStudent._id) {
        console.error("No student selected for editing.");
        return;
      }

      await axios.put(
        `http://localhost:5000/update-student-details/${editingStudent._id}`,
        editingStudent
      );

      setEditModalVisible(false);
      
    } catch (error) {
      console.error("Error updating student details:", error);
    }
  };

  const handleRemove = async (studentId) => {
    try {
      const studentDetails = studentData.find(student => student._id === studentId);
      if (!studentDetails) {
        throw new Error("Student details not found");
      }
      
      const confirmed = window.confirm("Are you sure you want to remove this student?");
      if (!confirmed) return;
  
      // Send a request to mark the student as inactive
      const response = await axios.post("http://localhost:5000/inActive", { studentToRemove: studentDetails });
      if (response.status !== 201) {
        throw new Error("Failed to mark student as inactive");
      }
  
      // Send a request to delete the student
      await axios.delete(`http://localhost:5000/delete-student/${studentDetails._id}`);
  
      // Show success message
      message.success("Student Inactive Successfully");
  
      // Fetch updated data after deletion
      fetchData();
    } catch (error) {
      console.error("Error removing student and activating:", error);
      // Handle error, e.g., show an error message to the user
    }
  };
  
  
  
  
  const filteredData = studentData.filter(
    (item) =>
      item.FullName.toLowerCase().includes(search.toLowerCase()) ||
      item.contact.includes(search) ||
      item.stgrade.toLowerCase().includes(search.toLowerCase()) ||
      item.internid.includes(search)
  );

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleModalClose = () => {
    setEditModalVisible(false);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setEditModalVisible(true);
  };
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
const endIndex = startIndex + itemsPerPage - 1;
const currentData = filteredData.slice(startIndex - 1, endIndex);


  return (
    <>
      
          <div className="mt-5 rounded border">
            <div
              className="search-bar text-success p-2 d-flex justify-content-between"
              style={{ backgroundColor: "#DFF0D8", height: "50px" }}
            >
              <p className="ms-4 text">Manage Students</p>
              <Form className="search">
                <Form.Item className="" >
                  <Input
                  className="fw-bold"
                    type="text"
                    placeholder="Search Student"
                    value={search}
                    onChange={handleSearch}
                  />
                </Form.Item>
              </Form>
            </div>
            <div className="p-3 table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr className="text-center">
                    <th>#</th>
                    <th>INTERN_ID</th>
                    <th>Name/Contact</th>
                    <th>Grade</th>
                    <th>Joined On</th>
                    <th>Fees</th>
                    <th>Balance</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData
                   .sort((a, b) => a.internid.localeCompare(b.internid))
                  .map((item, index) => (
                    <tr key={index} className="text-center">
                      <td>{startIndex + index}</td>
                      <td>{item.internid}</td>
                      <td className="text-start Ps-2">
                        {item.FullName}
                        <br />
                        {item.contact}
                      </td>
                      <td className="text-center">{item.stgrade}</td>
                      <td>{item.doj}</td>
                      <td>{item.totalFees}</td>
                      <td>{item.balance}</td>
                      <td className="text-center d-flex  btnicon">
                        <FaEdit
                          className="edit ms-3 fs-4"
                          onClick={() => handleEdit(item)}
                        />
                        <MdCancel className="remove ms-3 fs-4" onClick={() => handleRemove(item._id)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
            <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
        />
            </div>
          </div>
        
      {/* Edit Modal */}
      <Modal
      className="px-2 w-75 text-center"
  title="Edit Student Details"
  open={editModalVisible}
  onCancel={handleModalClose}
  footer={[
    <Button key="cancel" className="text-bg-danger border-0 fw-bold" onClick={handleModalClose}>
      Cancel
    </Button>,
    <Button key="update" className="text-bg-success border-0 fw-bold" onClick={handleSubmit}>
      Update
    </Button>,
  ]}
>
  <Form>
   
    <Form.Item label="Full Name" className="ms-5 fw-bold" colon={false} >
      <Input
      
        value={editingStudent?.FullName}
        onChange={(e) =>
          setEditingStudent({
            ...editingStudent,
            FullName: e.target.value,
          })
        }
      />
    </Form.Item>
    
    <Form.Item colon={false} label="Contact" style={{marginLeft:'62px'}} className="fw-bold">
      <Input
      
        value={editingStudent?.contact}
        onChange={(e) =>
          setEditingStudent({
            ...editingStudent,
            contact: e.target.value,
          })
        }
      />
    </Form.Item>
    <Form.Item label="Parent Contact" colon={false} style={{marginLeft:'14px'}} className="fw-bold">
      <Input
        value={editingStudent?.parentContact}
        onChange={(e) =>
          setEditingStudent({
            ...editingStudent,
            parentContact: e.target.value,
          })
        }
      />
    </Form.Item>
    <Form.Item label="Aadhar" colon={false} style={{marginLeft:'65px'}} className="fw-bold">
      <Input
        value={editingStudent?.aadhar}
        onChange={(e) =>
          setEditingStudent({ ...editingStudent, aadhar: e.target.value })
        }
      />
    </Form.Item>
    <Form.Item label="InternId" colon={false} style={{marginLeft:'60px'}} className="fw-bold">
      <Input
        value={editingStudent?.internid}
        onChange={(e) =>
          setEditingStudent({
            ...editingStudent,
            internid: e.target.value,
          })
        }
      />
    </Form.Item>
    <Form.Item label="Grade" colon={false} style={{marginLeft:'70px'}} className="fw-bold">
      <select
        className="form-select"
        value={editingStudent?.stgrade}
        onChange={(e) =>
          setEditingStudent({
            ...editingStudent,
            stgrade: e.target.value,
          })
        }
      >
        {grades.map((grade) => (
          <option key={grade._id} value={grade.grade}>
            {grade.grade}
          </option>
        ))}
      </select>
    </Form.Item>
    <Form.Item label="Date of Joining" colon={false} style={{marginLeft:'8px'}} className="fw-bold"   rules={[
   {
      pattern: /^\d{4}-\d{2}-\d{2}$/,
      message: "Please use the format yyyy-MM-dd",
    }
  ]}>
      <Input
      format="YYYY-MM-DD"
      type="date"
        value={editingStudent?.doj}
        onChange={(e) =>
          setEditingStudent({ ...editingStudent, doj: e.target.value })
        }
      />
    </Form.Item>
    <Form.Item label="About" colon={false} style={{marginLeft:'68px'}} className="fw-bold">
      <Input
        value={editingStudent?.
          aboutStudent}
        onChange={(e) =>
          setEditingStudent({ ...editingStudent, 
            aboutStudent: e.target.value })
        }
      />
    </Form.Item>
    <Form.Item label="Email" colon={false} style={{marginLeft:'68px'}} className="fw-bold">
      <Input
        value={editingStudent?.email}
        onChange={(e) =>
          setEditingStudent({ ...editingStudent, email: e.target.value })
        }
      />
    </Form.Item>
    <Form.Item label="Balance" colon={false} style={{marginLeft:'50px'}} className="fw-bold">
      <Input
        value={editingStudent?.balance}
        onChange={(e) =>
          setEditingStudent({
            ...editingStudent,
            balance: e.target.value,
          })
        }
        disabled
      />
    </Form.Item>
    <Form.Item label="Total Fees" colon={false} style={{marginLeft:'35px'}} className="fw-bold">
      <Input
        value={editingStudent?.totalFees}
        onChange={(e) =>
          setEditingStudent({
            ...editingStudent,
            totalFees: e.target.value,
          })
        }
        disabled
      />
    </Form.Item>
  </Form>
</Modal>

    </>
  );
}

export default Student_Management;
