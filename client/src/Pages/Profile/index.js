// Profile.js
import React, { useState, useEffect, useCallback } from "react";
import Auth from "../../utils/auth";
import axios from "axios";
import { useNavigate, Navigate } from "react-router-dom";
import BusinessForm from "../../Components/BusinessForm"; // Import BusinessForm
import UserShopsList from "../../Components/UserShopsList"; // Import UserShopsList
import { MDBContainer, MDBBtn } from "mdb-react-ui-kit";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const baseUrl = process.env.REACT_APP_BASE_URL;

export const Profile = () => {
  const navigate = useNavigate();
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [businessInfo, setBusinessInfo] = useState({
    name: "",
    email: "",
    phone: "",
    location: {},
  });
  const [userShops, setUserShops] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [shopColor, setShopColor] = useState("#ff9d2a")

  // Validate form inputs in real-time
  const validateForm = () => {
    let errors = {};
    if (!businessInfo.name) {
      errors.name = "Shop name is required.";
    }
    if (!/\S+@\S+\.\S+/.test(businessInfo.email)) {
      errors.email = "Please enter a valid email.";
    }
    if (!businessInfo.phone) {
      errors.phone = "Phone number is required.";
    } else if (!/^\d+$/.test(businessInfo.phone)) {
      errors.phone = "Phone number must contain only numbers.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  // Handle API error messages
  const handleApiError = (error) => {
    if (error.response) {
      // Server responded with a status code outside of the 2xx range
      setErrorMessage(
        error.response.data.message || "An error occurred. Please try again."
      );
    } else if (error.request) {
      // Request was made but no response was received
      setErrorMessage("Network error. Please check your connection.");
    } else {
      // Something else caused the error
      setErrorMessage("An error occurred. Please try again.");
    }
    console.error("Error:", error); // Log the error for debugging
  };

  // Rest of the helper functions are the same as the original Profile component
  // Fetch user's location data based on IP
  const fetchLocationData = useCallback(async () => {
    try {
      setLoading(true); // Show loading indicator
      const res = await axios.get("https://ipapi.co/json"); // Fetch location data
      const newLocation = {
        latitude: res.data.latitude,
        longitude: res.data.longitude,
      };
      // Update businessInfo state with location data
      setBusinessInfo((prevInfo) => ({ ...prevInfo, location: newLocation }));
      setLongitude(newLocation.longitude); // Update longitude state
      setLatitude(newLocation.latitude); // Update latitude state
    } catch (error) {
      handleApiError(error); // Handle any errors that occur
    } finally {
      setLoading(false); // Hide loading indicator
    }
  }, []);

  // Fetch user's shops
  const getUserShops = useCallback(async () => {
    const token = Auth.getToken(); // Retrieve authentication token
    const userId = Auth.getUserId(); // Retrieve user ID
    setLoading(true); // Show loading indicator
    try {
      const res = await axios.get(`${baseUrl}/user-shops/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in request headers
          Accept: "application/json",
        },
      });
      // Update userShops state with the fetched shops
      setUserShops(res.data.shops || []); // Default to empty array if undefined
    } catch (error) {
      handleApiError(error); // Handle any errors that occur
    } finally {
      setLoading(false); // Hide loading indicator
    }
  }, []);

  const handleInputChange = ({ target: { name, value } }) => {
    setBusinessInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleMarkerDragEnd = ({ lngLat }) => {
    const newLocation = {
      latitude: lngLat.lat,
      longitude: lngLat.lng,
    };
    setBusinessInfo((prevInfo) => ({ ...prevInfo, location: newLocation }));
    setLongitude(newLocation.longitude);
    setLatitude(newLocation.latitude);
  };

  // Handle form submission logic...
  const handleFormSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    if (!validateForm()) return; // Only proceed if validation passes

    const { name, email, phone, location } = businessInfo;

    const shopExists = userShops.some((shop) => shop.name === name);
    if (shopExists) {
      setErrorMessage("Shop with this name already exists.");
      return;
    }

    const token = Auth.getToken(); // Retrieve authentication token
    const userId = Auth.getUserId(); // Retrieve user ID

    setLoading(true); // Show loading indicator
    try {
      const response = await axios.post(
        `${baseUrl}/create-organization/${userId}`,
        { name, email, phone, location },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in request headers
            Accept: "application/json",
          },
        }
      );

      if (response.status === 201) {
        console.log(response.data);
        // alert("Organization created successfully!");
        toast.success("Shop created successfully !", {
          position: "top-center",
          autoClose: 3000,
        });
        setUserShops([...userShops, response.data.organization]); // Add newly created shop to user shops
        setIsFormVisible(false); // Hide form after successful creation
        setBusinessInfo({ name: "", email: "", phone: "", location: {} }); // Reset form
      } else if (response.status === 409) {
        setErrorMessage("Conflict: Organization already exists.");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } catch (err) {
      handleApiError(err); // Handle any errors that occur
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  const deleteShop = async (shopId) => {
    const token = Auth.getToken(); // Retrieve authentication token
    const userId = Auth.getUserId(); // Retrieve user ID

    try {
      const response = await axios.delete(`${baseUrl}/delete-shope/${shopId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in request headers
          Accept: "application/json",
        },
        data: { userId }, // Pass userId in the request body under `data`
      });

      if (response.data.message) {
        setErrorMessage(response.data.message);
      } else {
        console.log(response.data);
        toast.success("Shop deleted successfully !", {
          position: "top-center",
          autoClose: 2000,
        });
        setUserShops(userShops.filter((shop) => shop.id !== shopId)); // Remove the deleted shop from the state
      }
    } catch (err) {
      setErrorMessage("An error occurred. Please try again.");
      console.error(err);
    }
  };

  const navigateTo = (id) => {
    navigate(`/dashboard/${id}`);
  };

  useEffect(() => {
    if (Auth.loggedIn()) {
      fetchLocationData();
      getUserShops();
    }
  }, [fetchLocationData, getUserShops]);

  return (
    <>
      {Auth.loggedIn() ? (
        <MDBContainer
          className="d-flex flex-column"
          style={{ minHeight: "100vh" }}
        >
        
          <div className="mt-5 mb-5">
            <MDBBtn
              style={{ backgroundColor: "#ff9d2a" }}
              onClick={() => setIsFormVisible((prev) => !prev)}
            >
              Add Business
            </MDBBtn>
          </div>
          {isFormVisible && (
            <BusinessForm
              businessInfo={businessInfo}
              formErrors={formErrors}
              handleInputChange={handleInputChange}
              handleFormSubmit={handleFormSubmit}
              handleMarkerDragEnd={handleMarkerDragEnd}
              longitude={longitude}
              latitude={latitude}
              loading={loading}
              errorMessage={errorMessage}
              shopColor={shopColor}
            />
          )}
          <div>
            {userShops.length > 0 && (
              <UserShopsList
                userShops={userShops}
                navigateTo={navigateTo}
                deleteShop={deleteShop}
              />
            )}
          </div>
          <ToastContainer /> {/* Add this line */}
        </MDBContainer>
      ) : (
        <Navigate to="/login" />
      )}
    </>
  );
};
