import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Auth from "../../utils/auth";
import axios from "axios";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
} from "mdb-react-ui-kit";

const baseUrl = process.env.REACT_APP_BASE_URL;

export const Signup = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { name, email, password } = userInfo;
      const response = await axios.post(`${baseUrl}/signup`, {
        name,
        email,
        password,
      });

      if (response.data.message) {
        setError(response.data.message);
      } else {
        Auth.signup(response.data.token);
        navigate("/main-page");
      }
    } catch (err) {
      setError("An error occurred during signup. Please try again.");
      console.error(err);
    }
  };

  const isFormValid = userInfo.email && userInfo.password;

  return (
    <MDBContainer fluid className="p-4 hei center">
      <MDBRow>
        <MDBCol
          md="6"
          className="text-center text-md-start d-flex flex-column justify-content-center"
        >
          <h1 className="my-5 display-3 fw-bold ls-tight px-3">
            The best offer <br />
            <span className="text-primary">for your business</span>
          </h1>
         
          <p className="px-3" style={{ color: "hsl(217, 10%, 50.8%)" }}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet,
            itaque accusantium odio, soluta, corrupti aliquam quibusdam tempora
            at cupiditate quis eum maiores libero veritatis? Dicta facilis sint
            aliquid ipsum atque?
          </p>
        </MDBCol>

        <MDBCol md="6">
          <MDBCard className="my-5">
            <MDBCardBody className="p-5">
              <form onSubmit={handleSubmit}>
                <MDBRow>
                  <MDBCol col="6">
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Name"
                      id="typeText"
                      type="text"
                      name="name"
                      value={userInfo.name}
                      onChange={handleChange}
                      required
                    />
                  </MDBCol>
                </MDBRow>

                <MDBInput
                  wrapperClass="mb-4"
                  label="Email"
                  id="typeEmail"
                  type="email"
                  name="email"
                  value={userInfo.email}
                  onChange={handleChange}
                  required
                />
                <MDBInput
                  wrapperClass="mb-4"
                  label="Password"
                  id="typePassword"
                  type="password"
                  name="password"
                  value={userInfo.password}
                  onChange={handleChange}
                  required
                />

                {error && <div className="text-danger mb-3">{error}</div>}

                <MDBBtn
                  className="w-100 mb-4"
                  style={{ backgroundColor: "#fab769" }}
                  size="md"
                  type="submit"
                  disabled={!isFormValid}
                >
                  Sign Up
                </MDBBtn>

                <div className="text-center">
                  <p>
                    Already have an account? <Link to="/login">Login</Link>
                  </p>
                </div>
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};
