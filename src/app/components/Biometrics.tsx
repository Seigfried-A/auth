"use client";
import { Field, Formik } from "formik";
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

type Ivalues = {
  username: string;
};


const URL = "https://auth-back-z339.onrender.com";
const schema = yup.object().shape({
  username: yup.string().required(),
});
const BiometricsModal: React.FC<PasswordModalProps> = (props) => {
  const [username, setUsername] = useState("");
  const handleRegistration = async () => {
    const body: Ivalues = {
      username,
    };

    if (!body.username.length) {
      toast.success(" username cannot be empty", {
        position: "top-center",
      });
      return;
    }

    try {
      const response = await axios.post(`${URL}/auth/verifyBio`, body);
      console.log(response.data);
      console.log(response.data.challenge);

      if (window.PublicKeyCredential) {
        console.log("Yaay!! I support credentials");
      }

      const options: any = {
        publicKey: {
          rp: {
            id: "https://auth-zeta-nine.vercel.app/",
            name: "Biometric testers",
          },
          user: {
            id: Buffer.from(response.data._id, "base64"),
            name: `${response.data.username}`,
            displayName: `${response.data.username}`,
          },
          challenge: Uint8Array.from(response.data.challenge),
          pubKeyCredParams: [
            { type: "public-key", alg: -7 },
            { type: "public-key", alg: -257 },
            { type: "public-key", alg: -37 },
          ],
          authenticatorSelection: {
            authenticatorAttachment: "cross-platform",
          },
          timeout: 60000,
          attestation: "direct",
        },
      };

      const credential = await (navigator.credentials as any).create(options);

      const registrationData = {
        username,
        id: credential.id,
        rawId: Buffer.from(credential.rawId).toString("base64"),
        type: credential.type,
        response: {
          clientDataJSON: Buffer.from(
            credential.response.clientDataJSON
          ).toString("base64"),
          attestationObject: Buffer.from(
            credential.response.attestationObject
          ).toString("base64"),
        },
      };
      const credentialResponse = await axios.post(
        `${URL}/auth/verifyBio/response`,
        registrationData
      );
      console.log(credentialResponse);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogin = async () => {
    const body: Ivalues = {
      username,
    };

    if (!body.username.length) {
      toast.success(" username cannot be empty", {
        position: "top-center",
      });
      return;
    }

    try {
      const response = await axios.post(`${URL}/auth/login`, {
        body,
      });

      console.log(response);
      // const options = {
      //   publicKey: {
      //     challenge: Uint8Array.from(response.data.challenge, (c) =>
      //       c.charCodeAt(0)
      //     ),
      //     userVerification: "preferred",
      //     allowCredentials: [
      //       {
      //         type: "public-key",
      //         id: Uint8Array.from(response.data.credentials.id, (c) =>
      //           c.charCodeAt(0)
      //         ),
      //       },
      //     ],
      //   },
      // };

      console.log(response);
      const publicKeyCredentialRequestOptions = {
        challenge: Uint8Array.from(response.data.challenge),
        allowCredentials: [
          {
            id: Uint8Array.from(response.data.credentials.id),
            type: "public-key",
            // transports: ["usb", "ble", "nfc"],
          },
        ],
        timeout: 60000,
      };

      console.log(publicKeyCredentialRequestOptions);

      const credential = await (navigator.credentials as any).get({
        publicKey: publicKeyCredentialRequestOptions,
      });
      console.log(credential);
    } catch (err) {
      console.log(err);
    }
  };

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
          <Modal.Title id="contained-modal-title-vcenter">
            <h4 style={{ color: "red" }}>Biometrics</h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Formik
            validationSchema={schema}
            onSubmit={async (values: Ivalues) => {
              //   await axios
              //     .post("http://localhost:8080/auth/password-auth", values)
              //     .then(function (response) {
              //       if (response.data) {
              //         toast.success("Password saved successfully");
              //         setPasswordModal(false);
              //       }
              //     })
              //     .catch(function (error) {
              //       console.log(error);
              //       if (error) {
              //         toast.error(error.response.data.error.message, {
              //           position: "top-center",
              //         });
              //       }
              //     });

              console.log(values);

              // await axios
              //   .post("http://localhost:8080/auth/verifyBio", values)
              //   .then(function (response): any {
              //     console.log(response.data);
              //     console.log(response.data.challenge);

              //     if (window.PublicKeyCredential) {
              //       console.log("Yaay!! I support credentials");
              //     }

              //     const options: any = {
              //       publicKey: {
              //         user: {
              //           name: `${response.data.username}`,
              //         },
              //         challenge: response.data.challenge.toString(),
              //       },
              //     };
              //     await navigator.credentials.create(options);
              //   })
              //   .catch(function (err) {
              //     console.log(err);
              //   });

              try {
                const response = await axios.post(
                  "http://localhost:8080/auth/verifyBio",
                  values
                );
                console.log(response.data);
                console.log(response.data.challenge);

                if (window.PublicKeyCredential) {
                  console.log("Yaay!! I support credentials");
                }

                const options: any = {
                  publicKey: {
                    rp: { name: "Biometric testers" },
                    user: {
                      id: Buffer.from(response.data._id, "base64"),
                      name: `${response.data.username}`,
                      displayName: `${response.data.username}`,
                    },
                    challenge: Uint8Array.from(response.data.challenge, (c) =>
                      c.charCodeAt(0)
                    ),
                    pubKeyCredParams: [
                      { type: "public-key", alg: -7 }, // Specify the algorithm (you may need to adjust the value)
                    ],
                    authenticatorSlection: {},
                  },
                };

                await (navigator.credentials as any).create(options);
              } catch (err) {
                console.log(err);
              }
            }}
            initialValues={{
              username: "",
            }}
          >
            {({ handleSubmit, handleChange, values, touched, errors }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Label htmlFor="inputPassword">Username</Form.Label>
                <Form.Control
                  required
                  placeholder="Enter a username"
                  type="text"
                  id="inputUsername"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  isInvalid={!!errors.username}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
                <Button
                  type="submit"
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    margin: "10px",
                  }}
                >
                  Register
                </Button>
              </Form>
            )}
          </Formik> */}
          <FieldInput>
            <span className="line"></span>
            <TextInput
              type="text"
              placeholder="Whats your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FieldInput>
          <Buttons>
            <Button variant="dark" onClick={handleRegistration}>
              Register
            </Button>
            <Button variant="primary" onClick={handleLogin}>
              Login
            </Button>
          </Buttons>
        </Modal.Body>

        {/* </Modal.content> */}
      </Modal>
    </ModalStyle>
  );
};

export default BiometricsModal;

const ModalStyle = styled.div`
  background-color: black !important;
`;

const FieldInput = styled.div`
  position: relative;
  margin: 30px;

  .line {
    width: 100%;
    height: 3px;
    position: absolute;
    bottom: -8px;
    background: #bdc3c7;

    &:after {
      content: " ";
      position: absolute;
      float: right;
      width: 100%;
      height: 3px;

      transform: scalex(0);
      transition: transform 0.3s ease;

      background: #1abc9c;
    }
  }
`;

const TextInput = styled.input`
  background: 0;
  border: 0;
  outline: none;
  width: 80vw;
  max-width: 400px;
  font-size: 1.5em;
  transition: padding 0.3s 0.2s ease;

  &:focus {
    padding-bottom: 5px;
  }

  // sibling magic ;o
  &:focus + .line {
    &:after {
      transform: scaleX(1);
    }
  }
`;

const Buttons = styled.div`
  margin: 0px 30px 30px 30px;
  display: inline-flex;
  gap: 25px;
`;
