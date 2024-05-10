import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../Images/logo.png";
import "../pages/Dashboard/Dashboard.css";

function LoginForm({ setisLogin }) {
  const [form] = Form.useForm();
  const [login, setLogin] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/Login-user");
      setLogin(response.data);
      form.resetFields();
    } catch (error) {
      console.error("Fetch data error:", error);
      message.error("Failed to retrieve data");
    }
  };

  const onFinish = (values) => {
    const { UserName, Password } = values;

    const user = login.find((item) => item.Name === UserName);

    if (!user) {
      message.error("User Not Found");
    } else if (user.Password !== Password) {
      message.error("Incorrect Password");
    } else {
      sessionStorage.setItem("sessionActive", "true");
      setisLogin(true);
      navigate("/");
    }
  };

  return (
    <div className="container-fluid  h-100 pt-5 m-0">
      <div className="container  py-5 rounded-1 d-flex justify-content-center">
        <div className="login-container  col-md-4 col-sm-6 p-5 rounded-4 ">
          <div className="text-center">
            <img src={logo} alt="logo" width={90} />
            <h3 className="fs-3 fw-bold mt-3">Login</h3>
          </div>
          <div className="mt-4">
            <Form
              className=""
              form={form}
              name="signup-form"
              onFinish={onFinish}
              initialValues={{
                remember: true,
              }}
            >
              <div>
                <Form.Item
                  name="UserName"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your username!",
                    },
                  ]}
                >
                  <Input
                    className="myInput"
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder="Username"
                    variant="borderless"
                    addonAfter={<span className="input-focus-border" />}
                    style={{
                      background: "transparent",
                      border: "none",
                      borderBottom: "1px solid #000",
                    }}
                  />
                </Form.Item>
              </div>

              <div className="mt-3">
                <Form.Item
                  name="Password"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your password!",
                    },
                  ]}
                >
                  <Input.Password
                    className="py-2 ant-input-password rounded-0  border-0 border-bottom border-1 border-dark"
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    placeholder="Password"
                    variant="borderless"
                    addonAfter={<span className="input-focus-border" />}
                    style={{
                      background: "transparent",
                      border: "none",
                      borderBottom: "1px solid #000",
                      borderRadius: "0",
                    }}
                  />
                </Form.Item>
              </div>

              <div className="d-flex justify-content-center">
                <Form.Item>
                  <button
                    type="submit"
                    className="btn btncolor text-white px-5 fw-bold mt-4 py-0 fs-5"
                  >
                    Login
                  </button>
                </Form.Item>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
