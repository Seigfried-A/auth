"use client";
import React, { useState } from "react";
import styled from "styled-components";
import PasswordModal from "./PasswordModal";
import { toast } from "sonner";
import OtpModal from "./OtpModal";

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;

  div {
    background-color: #4212af;
    padding: 20px;
    border-radius: 10px;
    width: 350px;
    min-width: 250px;
    transition: transform 0.3s ease;
    &:hover {
      transform: scale(1.1);
    }

    span {
      color: #ffb100;
      margin-top: 10px;
      display: flex;
      gap: 20px;
      justify-content: space-between;
    }
  }
`;

const Section = styled.section`
  height: 100vh;
  width: 100vw;
  padding: 20px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
`;

const Cards: React.FC = () => {
  const [passwordModal, setPasswordModal] = useState(false);
  const [otpModal, setOtpModal] = useState(false);

  return (
    <>
      <Section>
        <PasswordModal
          show={passwordModal}
          onHide={() => setPasswordModal(false)}
        />
        <OtpModal show={otpModal} onHide={() => setOtpModal(false)} />
        <Card>
          <div onClick={() => setPasswordModal(true)}>
            Password
            <span>Click here to test</span>
          </div>
          <div onClick={() => setOtpModal(true)}>
            OTP
            <span>Click here to test</span>
          </div>
          <div>
            Biometrics
            <span>Click here to test </span>
          </div>
        </Card>
      </Section>
    </>
  );
};

export default Cards;
