import React, { useCallback, useState } from "react";
import axios from "axios";
import { MDBInputGroup, MDBBtn } from "mdb-react-ui-kit"; // Import UI components from MDB
import Auth from "../utils/auth";

const baseUrl = process.env.REACT_APP_BASE_URL;

const UpdateShopColor = ({ color, setColor, shopId, shopColor, setShopColor}) => {
  const [error, setError] = useState(null);

  /**
   * Function to update shop color
   * - Uses `useCallback` to memoize the function and prevent unnecessary re-renders
   */
  const updateShopColor = useCallback(async () => {
    const token = Auth.getToken();
    
    // Basic validation to check if a color is selected
    if (!color) {
      setError("Please select a color.");
      console.error("No color selected.");
      return;
    }

    try {
      // API request to update the shop color
      const response = await axios.put(
        `${baseUrl}/update-shop-color/${shopId}`,
        { color }, // Send 'color' data in the request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      // Check if the response contains data
      if (response && response.data) {
        console.log("Color updated:", response.data.color);
        setColor(response.data.color); // Update state with the new color
        setShopColor(response.data.color)
        setError(null); // Clear error message if successful
      }
    } catch (err) {
      setError("An error occurred while updating the color.");
      console.error("Error updating color:", err);
    }
  }, [color, shopId, setColor]);

  return (
    <>
      {/* Input group for color selection */}
      <MDBInputGroup className="mb-3">
        <input
          className="form-control"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          aria-label="Select color"
        />

        {/* Button to trigger color update */}
        <MDBBtn
          outline
          style={{ borderColor: shopColor }}
          onClick={updateShopColor}
        >
          +
        </MDBBtn>
      </MDBInputGroup>

      {/* Display error message if any */}
      {error && <p className="text-danger">{error}</p>}
    </>
  );
};

export default UpdateShopColor;
