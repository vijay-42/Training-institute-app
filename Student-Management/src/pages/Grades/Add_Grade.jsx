import React from "react";
import { Form, Input, Button, message } from "antd";

import axios from "axios";

function Add_Grade() {


  const [form] = Form.useForm();

  const onFinish = (values) => {
    axios
      .post("http://localhost:5000/Grade", values)
      .then((response) => {
        message.success("Form data submitted successfully:");
        form.resetFields();
       
      })
      .catch((error) => {
        console.error("Error submitting form data:", error);
      });
  };

  return (
    <>
      
          <div className="rounded my-3  pb-5 mx-auto border col-md-8">
            <div
              className="text-success rounded"
              style={{ backgroundColor: "#DFF0D8" }}
            >
              <p className="ms-4 py-3">Add Student Details</p>
            </div>

            <div className=" p-2">
              <Form form={form} onFinish={onFinish}>
                <Form.Item
                  label={<strong>Grade</strong>}
                  name="grade"
                  className="ms-4"
                  colon={false}
                  rules={[
                    {
                      required: true,
                      message: "Please input grade!",
                    },
                  ]}
                >
                  <Input placeholder="Enter Grade" className="form-control " />
                </Form.Item>

                <Form.Item
                  label={<strong>Details</strong>}
                  name="details"
                  className="ps-3"
                  colon={false}
                  rules={[
                    {
                      required: true,
                      message: "Please input details!",
                    },
                  ]}
                >
                  <Input.TextArea
                    className="pt-2"
                    rows={2}
                    placeholder="Enter Detail"
                  />
                </Form.Item>

                <div className="form-group justify-content-center d-flex">
                  <Button
                    className="btn  px-5 py-1 fw-bold text-bg-success"
                    
                    htmlType="submit"
                  >
                    Submit
                  </Button>
                </div>
              </Form>
            </div>
          </div>
       
    </>
  );
}

export default Add_Grade;
