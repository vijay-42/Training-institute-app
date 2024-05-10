import React, { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import axios from "axios";
import logo from "../Account-settings/logo.png";

function AccountSetting() {
  const [form] = Form.useForm();
  const [dbValue, setDbValue] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/Login-user");
      setDbValue(response.data);
      form.resetFields();
    } catch (error) {
      console.error("Fetch data error:", error);
      message.error("Failed to retrieve data");
    }
  };

  const onFinish = async (values) => {
    const { oldPassword, newPassword, confirmPassword } = values;

    if (newPassword !== confirmPassword) {
      message.error("New passwords do not match. Please try again.");
      return;
    }

    try {
      const dbUser = dbValue.find((item) => item.Password === oldPassword);
      if (!dbUser) {
        message.error("Incorrect old password. Please try again.");
        return;
      }
      await updatePassword(dbUser._id, newPassword); // Assuming dbUser has an ID field
      form.resetFields();
      message.success("Password updated successfully");
    } catch (error) {
      console.error("Error updating password:", error);
      message.error("Failed to update password. Please try again later.");
    }
  };

  const updatePassword = async (userId, newPassword) => {
    try {
      await axios.put(`http://localhost:5000/update-password/${userId}`, {
        newPassword: newPassword,
      });
      console.log("Password updated successfully");
    } catch (error) {
      console.error("Failed to update password", error);
    }
  };

  return (
    <div className="container-fluid py-5">
      <div className="main-container px-4 py-3 rounded">
        <p className="fs-2 fw-bold ps-2 py-3 purple">Account Setting</p>
        <div className="login-container mx-auto col-md-6 my-4 p-5 rounded-4">
          <div className="text-center ">
            <img src={logo} alt="" className="w-25 img-fluid" />
            <h3 className="fs-3 mt-3 fw-bold">Change Password</h3>
          </div>
          <div className="mt-5">
            <Form
              className=""
              name="password-form"
              form={form}
              onFinish={onFinish}
              initialValues={{
                remember: true,
              }}
            >
              <Form.Item
                label="Old Password"
                name="oldPassword"
                className="fw-bold"
                colon={false}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Check your old password!",
                  },
                ]}
              >
                <Input.Password
                  placeholder="Old Password"
                  prefix={<LockOutlined className="site-form-item-icon" />}
                />
              </Form.Item>
              <Form.Item
                label="New Password"
                name="newPassword"
                className="fw-bold"
                colon={false}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Please input your new password!",
                  }
                 
                ]}
              >
                <Input.Password
                  placeholder="New Password"
                  prefix={<LockOutlined className="site-form-item-icon" />}
                />
              </Form.Item>
              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                className="fw-bold "
                colon={false}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                
                rules={[
                  {
                    required: true,
                    message: "Please confirm your new password!",
                  }
                 
                ]}
              >
                <Input.Password
                  placeholder="Confirm Password"
                  prefix={<LockOutlined className="site-form-item-icon" />}
                />
              </Form.Item>
              <div className="d-flex justify-content-center">
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="btncolor text-white px-2 fw-bold py-0 fs-5"
                   
                  >
                    Make Changes
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountSetting;
