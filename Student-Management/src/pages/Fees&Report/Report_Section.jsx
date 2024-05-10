import React, { useState, useEffect } from "react";
import { Button, Form, Input, Select, Modal } from "antd";
import axios from "axios";
import Pagination from "../Pagination";

const { Option } = Select;

function Fees_Section() {
  const [feesData, setFeesData] = useState([]);
  const [grades, setGrades] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [grade, setGrade] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const [feeDetails, setFeeDetails] = useState([]);

  useEffect(() => {
    const fetchFeesData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/fetchStudent_Detail"
        );
        setFeesData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchFeesData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/fetch-Grade");
        setGrades(response.data);
      } catch (error) {
        console.error("Error fetching grade data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSearch = () => {
    const search = searchQuery.toLowerCase();
    const filtered = feesData.filter((item) => {
      const nameMatch = item.FullName.toLowerCase().includes(search);
      const gradeMatch = grade ? item.stgrade === grade : true;
      return nameMatch && gradeMatch;
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchQuery("");
    setGrade("");
    setFilteredData(feesData);
    setCurrentPage(1);
  };

  const openModal = async (item) => {
    setSelectedItem(item);
    try {
      const response = await axios.get(
        `http://localhost:5000/fees-details/${item.internid}`
      );
      setFeeDetails(response.data);
      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching fees details:", error);
    }
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalVisible(false);
    setFeeDetails([]);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);
  const Total = selectedItem?selectedItem.totalFees:0;
  const Balance = selectedItem?selectedItem.balance:0;
  const Paid = Total -Balance;


  return (
    <>
      <div className="container-fluid py-5">
        <div className="main-container px-4 py-3 rounded">
          <p className="fs-2 fw-bold ps-2 py-3 purple">Fees</p>
          <div className="my-4 col-md-12 col-sm-12 col-lg-12 col-lx-12">
            <fieldset className="border p-2 m-3">
              <legend className="float-none fw-bold text-dark w-auto border-0">
                Search:
              </legend>
              <div className="form-div d-flex justify-content-between">
                <div className="form-group col-12 col-md-6 col-sm-12 col-sm-12 col-lg-6 col-lx-6 ">
                  <Form.Item label={<strong>Name</strong>} colon={false}>
                    <Input
                      type="text"
                      placeholder="Search by Name"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </Form.Item>
                </div>
                <div className="form-group col-md-6 col-sm-12 col-sm-12 col-lg-6 col-lx-6 ps-2">
                  <Form.Item label={<strong>Grade</strong>} colon={false}>
                    <Select
                      placeholder="Select Grade"
                      value={grade}
                      onChange={(value) => setGrade(value)}
                    >
                      {grades.map((grade) => (
                        <Option key={grade._id} value={grade.grade}>
                          {grade.grade}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </div>
              <div className="col-md-12 col-sm-12 col-lg-12 col-xl-12 d-flex ">
               <div className="mx-auto" >
               <Button
                  className="filter text-bg-success border-0 fw-bold px-4 rounded-0 mx-2"
                  onClick={handleSearch}
                >
                  Filter
                </Button>
                <Button
                  className="text-bg-danger border-0 fw-bold px-4 rounded-0 mx-2"
                  onClick={handleReset}
                >
                  Reset
                </Button>
               </div>
              </div>
            </fieldset>
          </div>
          <div className="mt-5 rounded border">
            <div
              className="text-success p-2 d-flex justify-content-between "
              style={{ backgroundColor: "#DFF0D8", height: "50px" }}
            >
              <p className="ms-4">Manage Fees</p>
            </div>
            <div className="p-3 table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Name/Contact</th>
                    <th>Fees</th>
                    <th>Balance</th>
                    <th>Grade</th>
                    <th>Doj</th>
                    <th className="w-25">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((item, index) => (
                    <tr key={index}>
                      <td>
                        {item.FullName}
                        <br />
                        {item.contact}
                      </td>
                      <td>{item.totalFees}</td>
                      <td>{item.balance}</td>
                      <td className="text-center">{item.stgrade}</td>
                      <td>{item.doj}</td>
                      <td className="text-center">
                        <Button
                          className="btn text-bg-success rounded-0"
                          onClick={() => openModal(item)}
                        >
                          Check Report
                        </Button>
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
        </div>
      </div>
      <Modal
        className="w-75"
        title="Fees Collection Report"
        open={modalVisible}
        onCancel={closeModal}
        footer={[
          <Button key="close" onClick={closeModal}>
            Close
          </Button>,
        ]}
      >
        <div className="modal-body" id="formcontent">
          <h4>Student Info</h4>
          <div className="table-responsive">
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th>Full Name</th>
                  <td>{selectedItem?.FullName}</td>
                  <th>Grade</th>
                  <td>{selectedItem?.stgrade}</td>
                </tr>
                <tr>
                  <th>Contact</th>
                  <td>{selectedItem?.contact}</td>
                  <th>Joined On</th>
                  <td>{selectedItem?.doj}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h4>Fee Info</h4>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Paid</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {feeDetails.map((fee, index) => (
                  <tr key={index}>
                    <td>{fee.Date}</td>
                    <td>{fee.Paid}</td>
                    <td>{fee.Remark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <table className="table table-bordered text-center">
            <thead>
              <tr>
                <th>Total Fees</th>
                <th>Total Paid</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Rs. {Total}</td>
                <td>Rs. {Paid}</td>
                <td>Rs. {Balance}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Modal>
    </>
  );
}

export default Fees_Section;
