import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Auth from "../utils/auth";

import { MDBBtn, MDBCardText, MDBTextArea } from "mdb-react-ui-kit"; // Import UI components from MDB
const baseUrl = process.env.REACT_APP_BASE_URL; // Base URL from environment variables
export const AboutUsUpdate = ({ aboutUs, about, setAboutUs, setAbout, setError, shopInfo, shopId, shopColor }) => {
 
 
    // Function to handle updates in the text area
  const handleAboutUs = (event) => {
    setAboutUs(event.target.value); // Update the state with new content
  };

  const updateAboutUs = useCallback(
    async (aboutUs) => {
      const token = Auth.getToken();
      if (!aboutUs) {
        console.error("The 'About Us' field is empty.");
        setError("The 'About Us' field cannot be empty.");
        return;
      }
      try {
        const response = await axios.put(
          `${baseUrl}/update-about-us/${shopId}`,
          { about: aboutUs }, // Send 'about' data in the request body
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
        if (response && response.data) {
          console.log("About Us updated:", response.data.about);
          setAbout(response.data.about || ""); // Update the displayed 'about' text
          setAboutUs("");
        }
      } catch (err) {
        setError("An error occurred while updating the 'About Us' section.");
        console.error("Error updating 'About Us':", err);
      }
    },
    [about, shopId]
  );
  return (
    <>
      <div className="mb-5">
        <p className="lead fw-normal mb-1" style={{color: shopColor}}>About us</p>
        <div
          className="p-4"
          // style={{ backgroundColor: "#f8f9fa" }}
        >
          <MDBCardText className="font-italic mb-1" style={{textAlign: "justify"}}>{about}</MDBCardText>
        </div>
        <div className="p-4">
          <MDBTextArea
            label="Update About us"
            id="textAreaExample"
            value={aboutUs}
            onChange={handleAboutUs} // Call update function on change
            rows={4} // Changed to number instead of string
            style={{ borderColor: "#F54748" }}
          />
          <div className="mt-2 d-grid gap-2 d-md-flex justify-content-md-end">
            <MDBBtn
              onClick={() => updateAboutUs(aboutUs)}
              style={{ backgroundColor: shopColor }}
              disabled={!aboutUs || aboutUs === shopInfo.about}
            >
              update
            </MDBBtn>
          </div>
        </div>
      </div>
    </>
  );
};
