import React, { useState, useEffect } from "react";
import { Button, Form, Input, Select, Modal, message } from "antd";
import { GiMoneyStack } from "react-icons/gi";
import axios from "axios";
import Pagination from "../Pagination";
import "../Fees&Report/fees.css";
const { Option } = Select;

function Fees_Section() {
  const [feesData, setFeesData] = useState([]);
  const [grades, setGrades] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [grade, setGrade] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [collectModalVisible, setCollectModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Function to handle change in paid amount
  const handleFeesChange = (type, value) => {
    if (type === "paid") {
      const newBalance = selectedStudent.balance - value;
      form.setFieldsValue({ balance: newBalance });
    }
  };

  useEffect(() => {
   
      fetchData();
    
  }, []);


  const fetchData = async () => {
    try {
      const [feesResponse, gradesResponse] = await Promise.all([
        axios.get("http://localhost:5000/fetchStudent_Detail"),
        axios.get("http://localhost:5000/fetch-Grade"),
      ]);
      setFeesData(feesResponse.data);
      setFilteredData(feesResponse.data);
      setGrades(gradesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onFinish = async () => {
    try {
      const values = await form.validateFields();
      if (values.paid > selectedStudent.balance) {
        message.error("Paid amount cannot exceed the balance");
        return;
      }
      const updatedBalance = { balance: values.balance };
      await axios.put(
        `http://localhost:5000/fetchStudent_Detail/${selectedStudent._id}`,
        updatedBalance
      );
      const feeDetails = {
        internid: values.internid,
        Paid: values.Paid,
        Date: values.Date,
        Remark: values.Remark,
      };

      await axios.post("http://localhost:5000/Fees-collect", feeDetails);
      message.success("Fees collected successfully");
      form.resetFields();
      handleCollectModalCancel();
      fetchData();
    } catch (error) {
      console.error("Error collecting fee:", error);
      message.error("Failed to collect fee");
    }
  };

  const handleSearch = () => {
    const search = searchQuery.toLowerCase();
    const filtered = feesData.filter((item) => {
      const nameMatch = item.FullName.toLowerCase().includes(search);
      const gradeMatch = grade ? item.stgrade === grade : true;
      return nameMatch && gradeMatch;
    });
    setFilteredData(filtered);
  };

  const handleReset = () => {
    setSearchQuery("");
    setGrade("");
    setFilteredData(feesData);
    setCurrentPage(1);
  };

  const handleCollectFees = (student) => {
    setSelectedStudent(student);
    form.setFieldsValue({
      FullName: student.FullName,
      contact: student.contact,
      totalFees: student.totalFees,
      balance: student.balance,
      internid: student.internid,
      Paid: student.Paid || "",
      Date: "",
      Remark: "",
    });
    setCollectModalVisible(true);
  };


  const handleCollectModalCancel = () => {
    setSelectedStudent(null);
    setCollectModalVisible(false);
  };
  

 

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <>
      <div className="container-fluid py-5">
        <div className="main-container px-4 py-3 rounded ">
          <p className="fs-2 fw-bold ps-2 py-3 purple">Fees</p>

          <div className="my-4 col-md-12 col-sm-12 col-lg-12 col-lx-12">
            <fieldset className="border p-2 m-3">
              <legend className="float-none fw-bold text-dark w-auto border-0 ">
                Search :
              </legend>

              <div className="form-div d-flex justify-content-between">
                <div className="form-group col-12 col-md-6 col-sm-12 col-sm-12 col-lg-6 col-lx-6 ">
                  <Form.Item label={<strong>Name</strong>} colon={false}>
                    <Input
                      type="text"
                      placeholder="Search by Name or Contact"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </Form.Item>
                </div>

                <div className=" form-group col-md-6 col-sm-12 col-sm-12 col-lg-6 col-lx-6 ps-2">
                  <Form.Item  label={<strong>Grade</strong>} colon={false}>
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

              <div className=" col-md-12 col-sm-12 col-lg-12 col-xl-12 d-flex ">
                <div className="mx-auto ">
                <Button
                  className="filter text-bg-success border-0 fw-bold px-4 rounded-0 mx-2"
                  onClick={handleSearch}
                >
                  Filter
                </Button>
                <Button
                  className="reset text-bg-danger border-0 fw-bold px-4 rounded-0 mx-2"
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
              <p className="ms-4 ">Manage Fees</p>
            </div>

            <div className="p-3 table-responsive">
              <table className="table table-bordered ">
                <thead>
                  <tr>
                    <th>Name/Contact</th>
                    <th>Fees</th>
                    <th>Balance</th>
                    <th>Grade</th>
                    <th >Doj</th>
                    <th >Action</th>
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
                          className="rounded-0 text-bg-success"
                          onClick={() => handleCollectFees(item)}
                        >
                          <GiMoneyStack className="me-2 fs-5" />
                          Collect Fees
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="">
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
        title="Collect Fees"
        open={collectModalVisible}
        onCancel={handleCollectModalCancel}
        className="w-75"
        footer={[
          <Button key="cancel" onClick={handleCollectModalCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              form.submit();
              handleCollectModalCancel();
            }}
          >
            Submit
          </Button>,
        ]}
      >
        <Form form={form} onFinish={onFinish} initialValues={selectedStudent}>
          <Form.Item label="Full Name" colon={false} name="FullName">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Contact" colon={false} name="contact">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Total Fees" colon={false} name="totalFees">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Balance" colon={false} name="balance">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Intern ID" name="internid" colon={false}>
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Paid"
            colon={false}
            name="Paid"
            rules={[
              { required: true, message: "Please enter amount paid" },
              {
                validator: (_, value) => {
                  if (value && value > selectedStudent.balance) {
                    return Promise.reject(
                      "Paid amount cannot exceed the balance"
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
            initialValue={selectedStudent ? selectedStudent.Paid : ""}
          >
            <Input
              type="tel"
              onChange={(e) =>
                handleFeesChange("paid", parseFloat(e.target.value))
              }
            />
          </Form.Item>
          <Form.Item
            label="Date"
            colon={false}
            name="Date"
            rules={[
              {
                required: true,
                message: "Please input date",
              },
            ]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item label="Remark" colon={false} name="Remark">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Fees_Section;
