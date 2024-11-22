import React, { useState, useEffect } from "react"; // Import necessary React hooks
import { useNavigate, Link } from "react-router-dom"; // Import navigation hooks for routing
import axios from "axios"; // Import axios for making HTTP requests
import Auth from "../../utils/auth"; // Import authentication utility functions
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
} from "mdb-react-ui-kit"; // Import UI components from MDB

const baseUrl = process.env.REACT_APP_BASE_URL; // Get the base URL from environment variables

export const Login = () => {
  const navigate = useNavigate(); // Hook for programmatic navigation
  const [email, setEmail] = useState(""); // State to store email input
  const [password, setPassword] = useState(""); // State to store password input
  const [error, setError] = useState(""); // State to store error messages



  // Handle input changes for both email and password
  const handleChange = ({ target: { name, value } }) => {
    // Update state based on input name
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    const user = { email, password }; // Construct user object for login

    try {
      // Attempt to log in by sending a POST request
      const response = await axios.post(`${baseUrl}/login`, user);

      // Handle response
      if (response.data.message) {
        // Set error if a message is returned
        setError(response.data.message);
      } else {
        // Successful login: save token and navigate to the main page
        Auth.login(response.data.token);
        navigate("/main-page");
      }
    } catch (err) {
      // Catch and handle errors
      console.error(err); // Log error for debugging
      setError("Login failed. Please check your credentials."); // Generic error message
    }
  };

  // Check if the form is valid (both fields filled)
  const isFormValid = email && password; // Form is valid only if both fields are filled

  return (
    <MDBContainer fluid className="p-4 center"> {/* Full-width container for the login page */}
      <MDBRow>
        <MDBCol
          md="6"
          className="text-center text-md-start d-flex flex-column justify-content-center" // Column layout for text
        >
          <h1 className="my-5 display-3 fw-bold ls-tight px-3">
            The best offer <br />
            <span className="text-primary">for your business</span> {/* Highlighted text */}
          </h1>
          <p className="px-3" style={{ color: "hsl(217, 10%, 50.8%)" }}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet,
            itaque accusantium odio, soluta, corrupti aliquam quibusdam tempora
            at cupiditate quis eum maiores libero veritatis? Dicta facilis sint
            aliquid ipsum atque? {/* Description text */}
          </p>
        </MDBCol>

        <MDBCol md="6" xs="12"> {/* Responsive column for the login form */}
          <MDBCard className="my-5"> {/* Card component for styling */}
            <MDBCardBody className="p-4">
              <form onSubmit={handleSubmit}> {/* Form with submit handler */}
                <MDBInput
                  wrapperClass="mb-4"
                  label="Email input"
                  id="typeEmail"
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange} // Handle email input changes
                  required
                />
                <MDBInput
                  wrapperClass="mb-4"
                  label="Password input"
                  id="typePassword"
                  type="password"
                  name="password"
                  value={password}
                  onChange={handleChange} // Handle password input changes
                  required
                />
                {error && <div className="text-danger mb-3">{error}</div>} {/* Display error message if exists */}
                <MDBBtn
                  className="w-100 mb-4"
                  style={{ backgroundColor: "#fab769" }}
                  size="md"
                  type="submit"
                  disabled={!isFormValid} // Disable button if form is invalid
                >
                  Login
                </MDBBtn>
                <div className="text-center">
                  <p>
                    or <Link to="/signup"> Sign Up</Link> {/* Link to signup page */}
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
