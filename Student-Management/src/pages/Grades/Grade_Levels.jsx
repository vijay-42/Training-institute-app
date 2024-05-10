import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { Input, Form, Modal, message } from "antd";
import Pagination from "../Pagination";

function Grade_Levels() {
  const [grades, setGrades] = useState([]);
  const [search, setSearch] = useState("");
  const [editGrade, setEditGrade] = useState(null);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/fetch-Grade");
        setGrades(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const filteredData = grades.filter(
    (item) =>
      item.grade.toLowerCase().includes(search.toLowerCase()) ||
      item.details.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/Grade-delete/${id}`);
      const updatedGrades = grades.filter((grade) => grade._id !== id);
      setGrades(updatedGrades);
      message.success("Delete Sucessfull");
    } catch (error) {
      console.log("Error deleting grade:", error);
    }
  };

  const handleEdit = (grade) => {
    setEditGrade(grade);
    setVisible(true);
    form.setFieldsValue(grade);
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      await axios.put(
        `http://localhost:5000/update-Grade/${editGrade._id}`,
        values
      );
      setVisible(false);
      form.resetFields();
      const updatedGrades = grades.map((grade) =>
        grade._id === editGrade._id ? { ...grade, ...values } : grade
      );
      setGrades(updatedGrades);
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <>
     
          <div className="mt-5 rounded border">
            <div
              className="search search text-success p-2 d-flex justify-content-between "
              style={{ backgroundColor: "#DFF0D8", height: "50px" }}
            >
              <p className="ms-4 text">Manage Grade Level</p>
              <Form className="">
                <Form.Item className="" >
                  <Input
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
                  <tr>
                    <th>#</th>
                    <th>Grade</th>
                    <th>Details</th>
                    <th className="w-25">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData
                    .sort((a, b) => {
                      const gradeA = a.grade === "10" ? 1 : parseInt(a.grade);
                      const gradeB = b.grade === "10" ? 1 : parseInt(b.grade);
                      return gradeA - gradeB;
                    })
                    .map((grade, index) => {
                      const dataIndex = startIndex + index + 1;
                      return (
                        <tr key={index}>
                          <td>{dataIndex}</td>
                          <td>{grade.grade}</td>
                          <td>{grade.details}</td>
                          <td className="icons">
                            <FaEdit
                              className="edit ms-5 fs-5"
                              onClick={() => handleEdit(grade)}
                            />
                            <MdDelete
                              className="delete ms-5 fs-5"
                              onClick={() => handleDelete(grade._id)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
          {/* Pagination component */}
          <div className="mt-3 d-flex justify-content-center">
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalItems={filteredData.length}
              itemsPerPage={itemsPerPage}
            />
          </div>
       

      {/* Edit Modal */}
      <Modal
        title="Edit Grade"
        open={visible}
        onOk={handleUpdate}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Grade"
            name="grade"
            rules={[{ required: true, message: "Please input the grade!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Details"
            name="details"
            rules={[{ required: true, message: "Please input the details!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Grade_Levels;
