import React, { useState, useEffect, useCallback } from "react";
import { TiTick } from "react-icons/ti";
import { MdDelete } from "react-icons/md";
import { Input, Form, message } from "antd";
import axios from "axios";
import '../in-Active/inActive.css'
import Pagination from "../Pagination"; 

function InActiveStudent() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [search, setSearch] = useState("");
 

  useEffect(() => {
    fetchData();
  }, [currentPage, itemsPerPage, search,data]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/InactiveStudents?page=${currentPage}&limit=${itemsPerPage}&search=${search}`
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching inactive students:", error);
    }
  };

  const handleDelete = useCallback(async (id) => {
    try {
      const confirmed = window.confirm("Are you sure you want to delete this inactive student?");
      if (confirmed) {
        await axios.delete(`http://localhost:5000/deleteInactiveStudent/${id}`);
        setData(prevData => prevData.filter(item => item._id !== id));
      }
    } catch (error) {
      console.error("Error deleting inactive student:", error);
    }
  }, []);

  const handleActivate = useCallback(async (id) => {
    try {
      const confirmed = window.confirm("Move to Active Student?");
      if (!confirmed) return;
      await axios.post(`http://localhost:5000/activate-student/${id}`);
      setData(prevData =>
        prevData.map(item =>
          item._id === id ? { ...item, isActive: true } : item
        )
      );
    } catch (error) {
      console.error("Error activating student:", error);
      message.error("Failed to activate student");
    }
  }, []);

  const handleSearch = useCallback((e) => {
    const value = e.target.value || "";
    setSearch(value.toLowerCase()); 
    setCurrentPage(1);
  }, []);

  const filteredData = data.filter(item => {
  // Check if item.FullName exists and is not undefined before calling toLowerCase()
  return (
    (item.FullName && item.FullName.toLowerCase().includes(search.toLowerCase())) ||
    (item.contact && item.contact.includes(search)) ||
    (item.stgrade && item.stgrade.toLowerCase().includes(search.toLowerCase())) ||
    (item.internid && item.internid.includes(search))
  );
});

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container-fluid py-5">
      <div className="rounded pb-5 px-2 box-shadow">
        <div className="px-4 py-2 purple col-md-12">
          <p className="fs-2 fw-bold ps-2 py-3 d-inline">In-Active Student</p>
        </div>
        <div className="mt-5 rounded border">
          <div
            className="search-bar text-success p-2 d-flex justify-content-between"
            style={{ backgroundColor: "#DFF0D8", height: "50px" }}
          >
            <p className="ms-4">Manage Students</p>
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
                  <th>INTERN_ID</th>
                  <th>Name|Contact</th>
                  <th>Grade</th>
                  <th>Joined On</th>
                  <th>Fees</th>
                  <th>Balance</th>
                  <th >Action</th>
                </tr>
              </thead>
              <tbody >
                {currentItems.map((item, index) => (
                  <tr key={index}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td className="text-center">{item.internid}</td>
                    <td>
                      {item.FullName || ""} | {item.contact || ""}
                    </td>
                    <td className="text-center ">{item.stgrade || ""}</td>
                    <td>{item.doj || ""}</td>
                    <td>{item.totalFees || ""}</td>
                    <td>{item.balance || ""}</td>
                    <td className=" btnicon">
                      {!item.isActive && (
                        <TiTick
                          className="accept mx-2 fs-4"
                          onClick={() => handleActivate(item._id)}
                        />
                      )}
                      <MdDelete
                        className="delete mx-2 fs-5"
                        onClick={() => handleDelete(item._id)}
                      />
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
              totalItems={data.length}
              itemsPerPage={itemsPerPage}
              paginate={paginate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InActiveStudent;
