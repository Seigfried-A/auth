"use client";
import { Formik } from "formik";
import React, { useState } from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import styled from "styled-components";
import * as yup from "yup";
import axios from "axios";
import { toast } from "sonner";

interface PasswordModalProps {
  show: boolean;
  onHide: () => void;
}

const schema = yup.object().shape({
  password: yup.string().required(),
});


const URL = "https://auth-back-iota.vercel.app";

const PasswordModal: React.FC<PasswordModalProps> = (props) => {
  const [passwordModal, setPasswordModal] = useState(props.show);

  return (
    <ModalStyle>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        style={{ color: "black" }}
      >
        {/* <Modal.content> */}
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            validationSchema={schema}
            onSubmit={async (values) => {
              await axios
                .post(`${URL}/auth/password-auth`, values)
                .then(function (response) {
                  if (response.data) {
                    toast.success("Password saved successfully");
                    setPasswordModal(false);
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
            }}
            initialValues={{
              password: "",
              verifyPassword: "",
            }}
          >
            {({ handleSubmit, handleChange, values, touched, errors }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Label htmlFor="inputPassword">Password</Form.Label>
                <Form.Control
                  required
                  type="password"
                  id="inputPassword"
                  aria-describedby="passwordHelpBlock"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
                <Form.Text id="passwordHelpBlock" muted>
                  Your password must be at least 8 characters long, contain
                  letters and numbers and special characters.
                </Form.Text>
                <div>
                  <Form.Label htmlFor="verifyPassword">
                    Verify Password
                  </Form.Label>
                  <Form.Control
                    required
                    type="password"
                    id="verifyPassword"
                    aria-describedby="passwordHelpBlock"
                    name="verifyPassword"
                    value={values.verifyPassword}
                    onChange={handleChange}
                    isInvalid={!!errors.verifyPassword}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.verifyPassword}
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
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>

        {/* </Modal.content> */}
      </Modal>
    </ModalStyle>
  );
};

export default PasswordModal;

const ModalStyle = styled.div`
  background-color: black !important;
`;
