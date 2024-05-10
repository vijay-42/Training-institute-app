import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, message, DatePicker } from "antd";
import axios from "axios";
import "./Student.css";

const { Option } = Select;

function Add_Student() {
  const [form] = Form.useForm();
  const [grade, setGrades] = useState([]);
  const [disable, setDisable] = useState(true);
  const [totalFees, setTotalFees] = useState("");
  const [advanceFees, setAdvanceFees] = useState("");
  const [balance, setBalance] = useState(0);

  const onFinish = async (values) => {
    var formData = {
      ...values,
      balance: balance,
    };

    try {
      // Submit student details
      const studentResponse = await axios.post(
        "http://localhost:5000/Student_Detail",
        formData
      );
      if (studentResponse.status === 201) {
        message.success("Student Added successfully!");
        form.resetFields();
      } else {
        message.error("Failed to add student. Please try again.");
      }
      // Submit fees information
      const feesResponse = await axios.post(
        "http://localhost:5000/Fees-collect",
        {
          Date: values.doj,
          Paid: values.advanceFees,
          Remark: values.feesRemarks,
          internid: values.internid,
        }
      );
      console.log("Fees response:", feesResponse.data);
    } catch (error) {
      console.error("Error:", error);
      message.error("Failed to add student. Please try again.");
    }
  };

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

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    const newBalance =
      parseFloat(totalFees || 0) - parseFloat(advanceFees || 0);
    setBalance(newBalance);
    setDisable(false);
  }, [totalFees, advanceFees]);

  const initialValues = {
    advanceFees: advanceFees,
  };

  return (
    <>
      <div className="rounded my-3 pb-5 mx-auto border border-1 border-secondary col-md-9">
            <div
              className="text-success rounded"
              style={{ backgroundColor: "#DFF0D8" }}
            >
              <p className="ms-4 py-3">Add Student Details</p>
            </div>
            <Form
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              form={form}
              layout="horizontal"
              initialValues={initialValues}
              name="basic"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 18 }}
            >
              {/* Form fields go here */}
              <fieldset className="border p-2 m-3">
                <legend className="float-none fw-bold text-dark w-auto border-0">
                  Personal Information
                </legend>

                <div className="form-group">
                  <Form.Item
                    label={<strong>Full Name</strong>}
                    colon={false}
                    name="FullName"
                    rules={[
                      {
                        required: true,
                        message: "Please input full name!",
                      },
                      {
                        pattern: /^[A-Za-z\s]+$/,
                        message: "Please enter only letters and spaces.",
                      },
                    ]}
                  >
                    <Input type="text" placeholder="Enter Name"/>
                  </Form.Item>
                </div>

                <div className="form-group">
                  <Form.Item
                    label={<strong>Contact</strong>}
                    name="contact"
                    colon={false}
                    rules={[
                      {
                        required: true,
                        message: "Please input contact number!",
                      },
                      {
                        pattern: /^[0-9]+$/,
                        message: "Please enter only numbers.",
                      },
                    ]}
                  >
                    <Input type="tel" placeholder="Enter contact"/>
                  </Form.Item>
                </div>
                <div className="form-group">
                  <Form.Item
                    label={<strong>Parent Contact</strong>}
                    name="parentContact"
                    colon={false}
                    rules={[
                      {
                        required: true,
                        message: "Please input parent contact number!",
                      },
                      {
                        pattern: /^[0-9]+$/,
                        message: "Please enter only numbers.",
                      },
                    ]}
                  >
                    <Input type="tel"  placeholder="Enter Parent Contact"/>
                  </Form.Item>
                </div>
                <div className="form-group">
                  <Form.Item
                    label={<strong>Aadhar</strong>}
                    name="aadhar"
                    colon={false}
                    rules={[
                      {
                        required: true,
                        message: "Please input Aadhar number!",
                      },
                      {
                        pattern: /^[0-9]{12}$/,
                        message: "Please enter a 12-digit Aadhar number.",
                      },
                    ]}
                  >
                    <Input type="tel" placeholder="Enter Aadhar number"/>
                  </Form.Item>
                </div>

                <div className="form-group">
                  <Form.Item
                    label={<strong>Intern ID</strong>}
                    name="internid"
                    colon={false}
                    rules={[
                      {
                        required: true,
                        message: "Please fill the field",
                      }
                      
                    ]}
                  >
                    <Input type="tel" placeholder="Enter Intern ID"/>
                  </Form.Item>
                </div>
                <div className="form-group">
                  <Form.Item
                    label={<strong>Grade</strong>}
                    name="stgrade"
                    colon={false}
                    rules={[
                      {
                        required: true,
                        message: "Please select grade!",
                      },
                    ]}
                  >
                    <Select placeholder="Select Grade">
                      {grade.map((grade) => (
                        <Option key={grade._id} value={grade.grade}>
                          {grade.grade}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="form-group">
                  <Form.Item
                    label={<strong>Date of Joining</strong>}
                    name="doj"
                    colon={false}
                    rules={[
                      {
                        required: true,
                        message: "Please input date of joining!",
                      },
                    ]}
                  >
                     <Input type="date" placeholder="Date"/>
                  </Form.Item>
                </div>
              </fieldset>

              <fieldset className="border p-2 m-3">
                <legend className="float-none fw-bold text-dark w-auto border-0 ">
                  Fees Information
                </legend>
                <div className="form-group">
                  <Form.Item
                    label={<strong>Total Fees</strong>}
                    name="totalFees"
                    colon={false}
                    rules={[
                      {
                        required: true,
                        message: "Please input total fees!",
                      },
                      {
                        pattern: /^[0-9]{5}$/,
                        message: "5 Digits only",
                      },
                    ]}
                  >
                    <Input
                      type="tel"
                      placeholder="Enter Total Fees"
                      value={totalFees}
                      onChange={(e) => setTotalFees(e.target.value)}
                    />
                  </Form.Item>
                </div>
                <div className="form-group">
                  <Form.Item
                    label={<strong>Advance Fees</strong>}
                    name="advanceFees"
                    colon={false}
                    rules={[
                      {
                        required: true,
                        message: "Please input advance fees!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || value.toString().length < 6) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Advance fees must be less than 6 digits!'));
                        },
                      }),
                    ]}
                  >
                    <Input
                      type="tel"
                      placeholder="Enter Advance Fees"
                      value={advanceFees}
                      disabled={disable || !totalFees}
                      onChange={(e) => setAdvanceFees(e.target.value)}
                    />
                  </Form.Item>
                </div>
                <div className="form-group">
                  <Form.Item
                    label={<strong>Balance</strong>}
                    name="balance"
                    colon={false}
                  >
                    <Input
                      type="tel"
                      placeholder={balance}
                      value={balance}
                      disabled
                    />
                  </Form.Item>
                </div>
                <div className="form-group">
                  <Form.Item
                    label={<strong>Fees Remarks</strong>}
                    name="feesRemarks"
                    colon={false}
                    rules={[
                      {
                        required: true,
                        message: "Please input fees remarks!",
                      },
                    ]}
                  >
                    <Input type="text" placeholder="Enter Fees Remarks"/>
                  </Form.Item>
                </div>
              </fieldset>

              <fieldset className="border p-2 m-3">
                <legend className="float-none fw-bold text-dark w-auto border-0">
                  Optional Information
                </legend>
                <div className="form-group">
                  <Form.Item
                    label={<strong>About Student</strong>}
                    name="aboutStudent"
                    colon={false}
                    rules={[
                      {
                        required: true,
                        message: "Please input information about student!",
                      },
                      {
                        validator: (_, value) => {
                          if (!value || value.split("\n").length <= 3) {
                            return Promise.resolve();
                          }
                          return Promise.reject("Maximum 2 rows allowed.");
                        },
                      },
                    ]}
                  >
                    <Input.TextArea
                      rows={2}
                      placeholder="Enter information about the student"
                    />
                  </Form.Item>
                </div>
                <div className="form-group">
                  <Form.Item
                    label={<strong>Email ID</strong>}
                    name="email"
                    colon={false}
                    rules={[
                      {
                        type: "email",
                        message: "The input is not a valid email address!",
                      },
                      {
                        required: true,
                        message: "Please input your email address!",
                      },
                      {
                        pattern:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Please enter a valid email address format!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter email" />
                  </Form.Item>
                </div>
              </fieldset>
              <div className="form-group justify-content-center d-flex">
                <Button
                  className="btn  px-5 py-1 fw-bold text-bg-success border-0"
                 
                  htmlType="submit"
                >
                  Submit
                </Button>
              </div>
            </Form>
          </div>
        
    </>
  );
}

export default Add_Student;
