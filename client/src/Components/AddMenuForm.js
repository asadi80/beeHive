import React, { useState, useEffect, useCallback } from "react";
import {  useParams } from "react-router-dom"; // Import navigation hooks
import axios from "axios";
import Auth from "../utils/auth";
import { MDBBtn, MDBInputGroup } from "mdb-react-ui-kit"; // Import UI components from MDB

const baseUrl = process.env.REACT_APP_BASE_URL; // Base URL from environment variables

export const AddMenuForm = ({menuItems, setMenuItems, shopColor}) => {
  const { id: shopId } = useParams(); // Extract shopId from URL parameters
  const [menu, setMenu] = useState("");
  
  const [error, setError] = useState(null); // State to hold error messages

  // Function to handle meny in the text area
  const handleMenu = (event) => {
    setMenu(event.target.value);
    
  };

  // Check if the menu item already exists whenever `menu` changes
  useEffect(() => {
    if (menu && menuItems.some((item) => item.category === menu)) {
      setError("Menu already exists");
    } else {
      setError(null); // Clear error if no match is found
    }
  }, [menu, menuItems]);

  // Function to create menu
  const addMenu = async (menu) => {
    console.log(menu);

    const token = Auth.getToken();
    try {
      const response = await axios.post( 
        `${baseUrl}/add-menu/${shopId}`,
        { category: menu }, // Send 'menu' data in the request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      if (response.data) {
        console.log("Menue has been created:", response.data.menu);
        const updatedMenuItmes = response.data.menu;
        console.log(menuItems);
        setMenuItems([])
        setMenuItems((prevMenuItems) => [
          ...prevMenuItems,
          ...updatedMenuItmes,
        ]);
        setMenu("");
      }
    } catch (err) {
      setError("An error occurred while creating menu ");
      console.error("Error creating Menu", err);
    }
  };

  return (
    <>

    <MDBInputGroup className="mb-3">
      <input
        className="form-control"
        placeholder={"Add menu"}
        type="text"
        name="category"
        value={menu}
        onChange={handleMenu}
        required
      />
      <MDBBtn
        outline
        style={{ borderColor: shopColor }}
        disabled={!menu || error} // Disable if input is empty or menu already exists
        onClick={() => addMenu(menu)}
      >
        +
      </MDBBtn>
    </MDBInputGroup>
      <div>

      {error && <p style={{ color: "red" }}>{error}</p>} 
      </div>
    </>
  );
};
