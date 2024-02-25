"use client";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import styled from "styled-components";
import * as yup from "yup";
import axios from "axios";
import { toast } from "sonner";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import InputGroup from "react-bootstrap/InputGroup";

const URL = "http://localhost:8080";
interface OtpModalProps {
  show: boolean;
  onHide: () => void;
}

type Values = {
  email: string;
  code: string;
};

const schema = yup.object().shape({
  email: yup.string().required(),
  code: yup.string().required(),
});
const OtpModal: React.FC<OtpModalProps> = (props) => {
  const [seconds, setSeconds] = useState(60);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds((prevSeconds) => prevSeconds - 1);
      } else {
        setOtpSent(false);
        clearInterval(countdownInterval);
      }
    }, 1000);
    return () => clearInterval(countdownInterval);
  }, [seconds]);

  const requestOtp = async (values: Values, e: any) => {
    console.log(values);
    e.preventDefault();
    const emailRegex = /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (values.email === "" || !emailRegex.test(values.email)) {
      toast.error("Invalid Email", {
        position: "top-center",
      });
      return;
    }
    await axios
      .post(`${URL}/auth/sendOtp`, values)
      .then(function (response) {
        if (response.data) {
          toast.success("Otp sent successfully", {
            position: "top-center",
          });
          setOtpSent(true);
        }
      })
      .catch(function (error) {
        console.log(error);
        if (error) {
          toast.error(error.response.data.error.message, {
            position: "top-center",
          });
        }
      });
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{ color: "black" }}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">OTP</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          validationSchema={schema}
          onSubmit={async (values: Values) => {
            console.log(values);
            await axios
              .post(`${URL}/auth/verifyOtp`, values)
              .then(function (response) {
                if (response.data) {
                  toast.success("Otp verified!");
                  props.onHide();
                }
              })
              .catch(function (error) {
                console.log(error);
                if (error) {
                  toast.error(error.response.data.message, {
                    position: "top-center",
                  });
                }
              });
          }}
          initialValues={{
            email: "",
            code: "",
          }}
        >
          {({ handleSubmit, handleChange, values, touched, errors }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <FloatingLabel
                controlId="floatingInput"
                label="Email address"
                className="mb-3"
              >
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                />
              </FloatingLabel>
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
              <div>
                <InputGroup className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Enter Otp"
                    name="code"
                    value={values.code}
                    onChange={handleChange}
                    isInvalid={!!errors.code}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={(e) => requestOtp(values, e)}
                    disabled={otpSent}
                  >
                    Send
                  </Button>
                </InputGroup>
                <Form.Text id="passwordHelpBlock" muted></Form.Text>
                <Form.Control.Feedback type="invalid">
                  {errors.code}
                </Form.Control.Feedback>
              </div>
              <Button
                type="submit"
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  margin: "10px",
                }}
              >
                Verify
              </Button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default OtpModal;
